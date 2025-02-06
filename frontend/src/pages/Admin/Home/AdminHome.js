import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { Box, Typography } from "@mui/material";
import { auth } from "../../../config";
import { toast } from "react-toastify";
import axios from "axios";
import {
  Group,
  MarkAsUnread,
  NoteAddOutlined,
  PersonPinCircleOutlined,
} from "@mui/icons-material";
export default function AdminHome() {
  const [totalUsers, setTotalUsers] = useState(0);

  const [filtering, setFiltering] = useState({
    department: "All",
    batch: "",
    roll: "",
  });
  const page = 1;
  const itemsPerPage = 0;

  const [totalComplaints, setTotalComplaints] = useState(0);
  useEffect(() => {
    const getTotalUsers = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/admin/countusers`,
          {
            headers: {
              Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
            },
          }
        );
        setTotalUsers(response.data.result[0].count);
      } catch (error) {}
    };
    const fetchComplains = async () => {
      axios
        .get(
          `http://localhost:8000/api/admin/complains?page=${
            page - 1
          }&limit=${itemsPerPage}&department=${filtering.department}&batch=${
            filtering.batch
          }&roll=${filtering.roll}`,
          {
            headers: {
              Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
            },
          }
        )
        .then((response) => {
          setTotalComplaints(response.data.count);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchComplains();
    getTotalUsers();
  }, []);

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h5" component="h2">
          Welcome, {auth.currentUser.displayName}!
        </Typography>

        <Typography variant="body2" component="p">
          You are logged in as an admin. You can manage users, departments and
          complaints. You can also comment and change the status of complaints.
        </Typography>
      </Box>

      <Box
        sx={{
          display: ["block", "flex"],
          marginTop: "20px",
        }}
      >
        <Card
          sx={{
            marginRight: ["0px", "20px"],
            marginBottom: ["20px", "0px"],
          }}
        >
          <CardContent>
            <Group />
            <Typography variant="h5" component="div">
              Total <strong> {totalUsers}</strong> Users
            </Typography>
            <Typography variant="body2">
              are registered with roll and mobile verification.
            </Typography>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <MarkAsUnread />
            <Typography variant="h5" component="div">
              Total <strong> {totalComplaints}</strong> Complaints
            </Typography>
            <Typography variant="body2">
              are registered and waiting for the admin to take action.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  );
}
