import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Container,
  Card,
  CardActions,
  CardContent,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Header from "../Header/Header";
import { auth } from "../../../config";
import { complainStatus, formatedDate } from "../Common/Common";
import Loading from "../Common/Loading";
import { Link } from "react-router-dom";

export default function Home() {
  const [complains, setComplains] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    fetchComplains();
    setLoading(false);
  }, []);

  const fetchComplains = async () => {
    const idtoken = await auth?.currentUser?.getIdToken();
    const response = await fetch("http://localhost:8000/api/complain/all", {
      headers: {
        Authorization: `Bearer ${idtoken}`,
      },
    });
    const data = await response.json();
    setComplains(data.complains);
    console.log(data.complains);
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Container maxWidth="md" sx={{ marginBottom: 2 }}>
            <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
              Your Complains
            </Typography>
            <Grid container spacing={2}>
              {complains?.length > 0 &&
                complains.map((complain) => (
                  <Grid
                    item
                    size={12}
                    component={Link}
                    to={`/complain/detail/${complain.c_id}`}
                    sx={{ textDecoration: "none" }}
                  >
                    <Card sx={{ minWidth: 275 }}>
                      <CardContent>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography
                            textAlign="left"
                            sx={{ color: "text.secondary", fontSize: "12px" }}
                          >
                            {formatedDate(complain.created_at)}
                          </Typography>
                          <Typography
                            textAlign="center"
                            sx={{
                              fontSize: "12px",
                              color: "white",
                              paddingX: "4px",
                            }}
                            backgroundColor={complainStatus(complain.status)}
                          >
                            {complain.status}
                          </Typography>
                        </Box>
                        {complain?.title.length > 0 && (
                          <Typography
                            variant="h6"
                            fontWeight="normal"
                            textAlign="left"
                          >
                            {complain.title}
                          </Typography>
                        )}
                        <Typography variant="body2" textAlign="left">
                          {complain.details
                            .replace(/<[^>]*>?/gm, "")
                            .replace(/&nbsp;/g, " ")
                            .substr(0, 200)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}
