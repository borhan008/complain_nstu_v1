import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import {
  Container,
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import Header from "../Header/Header";
import { auth } from "../../../config";
import { complainStatus, formatedDate } from "../Common/Common";
import Loading from "../Common/Loading";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dangerous } from "@mui/icons-material";
import { toast } from "react-toastify";
import axios from "axios";
import { Helmet } from "react-helmet";

export default function ViewComplain() {
  const [complains, setComplains] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const c_id = useParams().c_id;
  const uid = auth?.currentUser?.uid;
  useEffect(() => {
    setLoading(true);
    fetchComplains();
    fetchComments();
    setLoading(false);
    console.log(complains);
  }, []);

  const navigate = useNavigate();

  const fetchComplains = async () => {
    try {
      const idtoken = await auth?.currentUser?.getIdToken();
      const response = await axios.get(
        `http://localhost:8000/api/complain/detail/${c_id}`,
        {
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      );

      const data = response.data;
      setComplains(data.complains);
    } catch (error) {
      if (error.response && error.response.status !== 200) {
        toast.error("Complain not found", {
          toastId: "complain",
        });
        navigate("/");
      } else {
        toast.error("Complain not found", {
          toastId: "complain",
        });
        navigate("/");
      }
    }
  };

  const fetchComments = async () => {
    try {
      const idtoken = await auth?.currentUser?.getIdToken();
      const u_uid = await auth?.currentUser?.uid;
      const res = await axios.get(
        `http://localhost:8000/api/user/comments?c_id=${c_id}&u_id=${u_uid}`,
        {
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      );
      console.log(res.data.comments);
      if (res.status === 200) {
        setComments(res.data.comments);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleComment = async () => {
    if (commentText.length === 0) {
      toast.error("Comment can't be empty", {
        toastId: "comment",
      });
      return;
    }

    try {
      const idtoken = await auth?.currentUser?.getIdToken();
      const u_uid = await auth?.currentUser?.uid;
      const res = await axios.post(
        `http://localhost:8000/api/user/comment`,
        {
          c_id,
          u_id: u_uid,
          comment: commentText,
        },
        {
          headers: {
            Authorization: `Bearer ${idtoken}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Comment added successfully", {
          toastId: "comment",
        });

        setComments((prev) => [
          {
            name: auth?.currentUser?.displayName,
            role: "User",
            comment: commentText,
            date: new Date().toISOString(),
          },
          ...prev,
        ]);
        setCommentText("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Helmet>
            <title>Complaint | Complain NSTU</title>
          </Helmet>
          <Container maxWidth="md" sx={{ marginBottom: 2 }}>
            <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
              Complaint Details
            </Typography>
            <Grid container spacing={2}>
              {complains?.length > 0 &&
                complains.map((complain) => (
                  <Grid item size={12}>
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
                          <div
                            dangerouslySetInnerHTML={{
                              __html: complain.details,
                            }}
                          ></div>
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight="bold"
                          textAlign="left"
                          marginTop={2}
                        >
                          {complain?.docs && "Documents attached"}
                        </Typography>
                        {complain?.docs?.split(",").map((doc, id) => (
                          <Typography
                            variant="overline"
                            to={`http://localhost:8000/src/upload/complains/${doc}`}
                            target="_blank"
                            component={Link}
                            sx={{ display: "block" }}
                          >
                            {id + 1}.{doc.substr(0, 10)}...{doc.substr(-6)}
                          </Typography>
                        ))}
                      </CardContent>
                    </Card>
                    <Typography variant="h6" textAlign="left" marginY={2}>
                      Comments ({comments.length})
                    </Typography>
                    <form>
                      <TextField
                        fullWidth
                        label="Comment"
                        multiline
                        onChange={(e) => setCommentText(e.target.value)}
                        value={commentText}
                      />
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{ marginTop: 2 }}
                        onClick={handleComment}
                      >
                        Comment
                      </Button>
                    </form>
                    {comments.length > 0 &&
                      comments.map((comment) => (
                        <Card sx={{ minWidth: 275, marginY: 2 }}>
                          <CardContent>
                            <Typography textAlign="left" variant="body2">
                              {comment.name} ({comment.role})
                            </Typography>
                            <Typography
                              textAlign="left"
                              sx={{ color: "text.secondary", fontSize: "12px" }}
                            >
                              {formatedDate(comment.date)}
                            </Typography>
                            <Typography
                              textAlign="left"
                              variant="body2"
                              marginTop={1}
                            >
                              {comment.comment}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                  </Grid>
                ))}
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}
