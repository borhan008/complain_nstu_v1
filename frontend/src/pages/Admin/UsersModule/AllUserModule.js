import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config";
import { useAuth } from "../../Users/Context/AuthContext";
import { toast } from "react-toastify";
import {
  IconButton,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box,
  Pagination,
} from "@mui/material";
import Button from "@mui/material/Button";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PeopleIcon from "@mui/icons-material/People";
import { Helmet } from "react-helmet";

export default function AllUserModule() {
  const { loading, setLoading } = useAuth();
  const perPage = 20;
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  useEffect(() => {
    setLoading(true);

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
        setTotalPages(Math.ceil(response.data.result[0].count / perPage));
        setTotalUsers(response.data.result[0].count);
      } catch (error) {
        toast.error("Users not found", {
          toastId: "users",
        });
      }
    };
    getTotalUsers();
    setLoading(false);
  }, []);

  useEffect(() => {
    getUsers();
  }, [page]);

  const getUsers = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/users?start=${
          (page - 1) * perPage
        }&end=${page * perPage - 1}`,
        {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        }
      );
      setUsers(response.data.users);
    } catch (error) {
      toast.error("Users not found", {
        toastId: "users",
      });
    }
  };

  const handleChangeRole = async (uid, role) => {
    try {
      const res = await axios.put(
        "http://localhost:8000/api/admin/role",
        {
          role: role,
          uid: uid,
        },
        {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        }
      );
      toast.success("Role changed successfully", {
        toastId: "role",
      });
    } catch (error) {
      toast.error("Role not changed", {
        toastId: "role",
      });
    }
  };

  const handleUserBlock = async (uid, block) => {
    if (block == 0) block = 1;
    else block = 0;
    try {
      const res = await axios.put(
        "http://localhost:8000/api/admin/block",
        {
          block: block,
          uid: uid,
        },
        {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        }
      );

      setUsers((prev) =>
        prev.map((user) => {
          if (user.uid === uid) {
            return { ...user, block: block };
          } else {
            return user;
          }
        })
      );

      toast.success(`User  ${block ? "blocked" : "unblocked"} successfully.`);
    } catch (error) {
      toast.error(
        `Failed! User  ${block ? "blocked" : "unblocked"} successfully.`,
        {
          toastId: "block",
        }
      );
    }
  };
  return (
    <div>
      <Helmet>
        <title>Users | Admin Panel | Complain NSTU</title>
      </Helmet>
      <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
        Users ({totalUsers})
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Department</TableCell>

              <TableCell>Batch</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              users.map((user) => (
                <TableRow
                  key={user.uid}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row" title={user.uid}>
                    {user.uid.substring(0, 2)}.. {user.uid.substr(-2)}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.name || "--"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.email}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user?.shortform || "--"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user?.batch || "--"}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {user.role}
                    <IconButton
                      size="small"
                      onClick={() => {
                        handleChangeRole(
                          user.uid,
                          user.role == "user" ? "admin" : "user"
                        );
                      }}
                      title={`${user.role} to ${
                        user.role == "user" ? "admin" : "user"
                      }`}
                    >
                      {user.role == "user" ? (
                        <AdminPanelSettingsIcon />
                      ) : (
                        <PeopleIcon />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <Button
                      onClick={() => {
                        handleUserBlock(user.uid, user.block);
                      }}
                    >
                      {user.block ? "Unblock" : "Block"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          color="primary"
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </div>
  );
}
