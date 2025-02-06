import React, { useEffect } from "react";

import { Container, Button, Typography, TextField } from "@mui/material";
import { auth } from "../../../config";
import axios from "axios";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Header from "../Header/Header";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
export default function Notifications() {
  const [notifications, setNotifications] = React.useState([]);
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const idtoken = await auth?.currentUser?.getIdToken();
        const response = await axios.get(
          "http://localhost:8000/api/user/notifications",
          {
            headers: {
              Authorization: `Bearer ${idtoken}`,
            },
          }
        );
        console.log(response.data.notifications);
        setNotifications(response.data.notifications);
        const up = await axios.put(
          "http://localhost:8000/api/user/notifications",
          {},
          {
            headers: {
              Authorization: `Bearer ${idtoken}`,
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    };
    fetchNotifications();
  }, []);

  return (
    <>
      <Helmet>
        <title>Notifications | Complain NSTU</title>
      </Helmet>
      <Container maxWidth="md" sx={{ marginBottom: 2, textAlign: "left" }}>
        <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
          Notifications
        </Typography>
        {notifications.length === 0 ? (
          <Typography variant="body1" marginY={2} textAlign="left" gutterBottom>
            No new notifications
          </Typography>
        ) : (
          notifications.map((notification) => (
            <Box
              key={notification.n_id}
              sx={{
                border: 1,
                borderColor: "grey.500",
                padding: 2,
                marginBottom: 2,
                backgroundColor: notification.view ? "white" : "lightgrey",
                textDecoration: "none",
                display: "block",
                color: "black",
              }}
              component={Link}
              to={`/complain/detail/${notification.c_id}`}
            >
              <Typography
                variant="body"
                marginY={2}
                textAlign="left"
                gutterBottom
              >
                {notification.message}
              </Typography>

              <Typography
                variant="caption"
                textAlign="left"
                gutterBottom
                sx={{
                  display: "block",
                }}
              >
                {new Date(notification.date).toLocaleString()}
              </Typography>
            </Box>
          ))
        )}
      </Container>
    </>
  );
}
