import axios from "axios";
import React, { useEffect, useState } from "react";
import { auth } from "../../../config";
import { useAuth } from "../../Users/Context/AuthContext";
import { toast } from "react-toastify";
import {
  AppBar,
  Box,
  Dialog,
  IconButton,
  Paper,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Icon,
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const AdminComplains = () => {
  const { loading, setLoading } = useAuth();
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;
  const backendUrl = "http://localhost:8000/api/";
  const [disable, setDisable] = useState(false);
  const [data, setData] = useState([]);

  const [open, setOpen] = React.useState(false);
  const [row, setRow] = useState({});

  const [newStatus, setNewStatus] = useState("Due");

  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);

  const [departmentList, setDepartmentList] = useState([]);
  const [filtering, setFiltering] = useState({
    department: "All",
    batch: "",
    roll: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    setLoading(true);
    const fetchDepartments = async () => {
      axios
        .get(`${backendUrl}/admin/department`, {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        })
        .then((response) => {
          setDepartmentList(response.data.departments);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchDepartments();
    setLoading(false);
  }, []);

  useEffect(() => {
    setLoading(true);
    setPage(1); // Reset page to 1
    setTotalPages(0);
    console.log(filtering);
    const fetchComplains = async () => {
      axios
        .get(
          `${backendUrl}/admin/complains?page=${
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
          console.log(response.data.complains[0]);
          setData(response.data.complains[0]);
          setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchComplains();
    setLoading(false);
  }, [filtering]);

  useEffect(() => {
    setLoading(true);
    console.log(page);
    setData([]);
    const fetchComplains = async () => {
      axios
        .get(
          `${backendUrl}/admin/complains?page=${
            page - 1
          }&limit=${itemsPerPage}&department=${filtering.department}&batch=${
            filtering.batch
          }`,
          {
            headers: {
              Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
            },
          }
        )
        .then((response) => {
          console.log(response.data.complains[0]);
          setData(response.data.complains[0]);
          setTotalPages(Math.ceil(response.data.count / itemsPerPage));
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchComplains();
    setLoading(false);
  }, [page]);

  const handleOpenDialog = async (row) => {
    setRow(row);
    setNewStatus(row.status);
    try {
      const res = await axios.get(
        "http://localhost:8000/api/admin/complain/comments",
        {
          params: {
            c_id: row.c_id,
          },
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }
      );
      console.log(res);
      setComments(res.data.comments);
    } catch (error) {
      console.log(error);
    }
    setOpen(true);
  };

  const handleChangeStatus = async () => {
    if (newStatus === "") {
      toast.error("Status can't be empty");
      return;
    }
    setDisable(true);
    try {
      const res = await axios.put(
        "http://localhost:8000/api/admin/complain/status",
        {
          c_id: row.c_id,
          status: newStatus,
          u_id: row.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }
      );
      if (res.status === 200) {
        toast.success("Status updated successfully");
        row.status = newStatus;
      } else {
        console.log(res);
        toast.error("Error updating status");
      }
    } catch (error) {
      console.log(error);
    }
    setDisable(false);
  };

  const handleAddComment = async () => {
    if (commentText === "") {
      toast.error("Comment can't be empty");
      return;
    }
    setDisable(true);
    try {
      const res = await axios.post(
        "http://localhost:8000/api/admin/complain/comment",
        {
          c_id: row.c_id,
          comment: commentText,
          u_id: row.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }
      );
      if (res.status === 200) {
        const name = await auth.currentUser.displayName;
        const newComment = {
          name: name,
          comment: commentText,
          date: new Date().toISOString(),
        };
        setComments([newComment, ...comments]);
        toast.success("Comment added successfully");
        setCommentText("");
      } else {
        console.log(res);
        toast.error("Error adding comment");
      }
    } catch (error) {
      console.log(error);
    }
    setDisable(false);
  };

  const handleDelete = async (com_id) => {
    try {
      const res = await axios.delete(
        `http://localhost:8000/api/admin/complain/comment/${com_id}`,
        {
          headers: {
            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
          },
        }
      );
      if (res.status === 200) {
        const newComments = comments.filter(
          (comment) => comment.com_id !== com_id
        );
        setComments(newComments);
        toast.success("Comment deleted successfully");
      } else {
        console.log(res);
        toast.error("Error deleting comment");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Complaints | Admin Panel | Complain NSTU</title>
      </Helmet>
      <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
        Complaints
      </Typography>

      <Box
        sx={{
          display: ["block", "block", "flex"],
          justifyContent: "space-between",
        }}
      >
        <Box sx={{ display: "flex" }}>
          <Box
            sx={{
              marginRight: 2,
            }}
          >
            <InputLabel id="roll-select-label">Roll</InputLabel>
            <TextField
              id="outlined-basic"
              size="small"
              value={filtering.roll}
              onChange={(e) => {
                setFiltering({ ...filtering, roll: e.target.value });
              }}
            />
          </Box>
          <div>
            <InputLabel id="batch-select-label">Batch</InputLabel>

            <TextField
              id="outlined-basic"
              labelId="batch-select-label"
              size="small"
              value={filtering.batch}
              onChange={(e) => {
                setFiltering({ ...filtering, batch: e.target.value });
              }}
            />
          </div>
        </Box>
        <Box
          sx={{
            maxWidth: "220px",
          }}
        >
          <InputLabel id="dept-select-label">Department</InputLabel>
          <Select
            labelId="dept-select-label"
            value={filtering.department}
            onChange={(e) => {
              setFiltering({ ...filtering, department: e.target.value });
            }}
            fullWidth
            variant="outlined"
            size="small"
            label="Department"
            sx={{ minWidth: "150px" }}
          >
            <MenuItem value="All">All Departments</MenuItem>
            {departmentList.map((department) => (
              <MenuItem value={department.d_id} key={department.shortform}>
                {department.shortform}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>C_ID</TableCell>
              <TableCell>Roll</TableCell>
              <TableCell>Complain</TableCell>
              <TableCell>Date</TableCell>

              <TableCell>Status</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow
                key={row.c_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.c_id}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.roll}
                </TableCell>
                <TableCell>{row.title}</TableCell>
                <TableCell>
                  {new Date(Date.parse(row.created_at)).toLocaleDateString(
                    "en-us",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenDialog(row)}>
                    <EditIcon />
                  </IconButton>
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={async () => {
                      axios
                        .delete(`${backendUrl}admin/complain/${row.c_id}`, {
                          headers: {
                            Authorization: `Bearer ${await auth.currentUser.getIdToken()}`,
                          },
                        })
                        .then((response) => {
                          toast.success(response.data.message);
                          const newData = data.filter(
                            (complain) => complain.c_id !== row.c_id
                          );
                          setData(newData);
                        })
                        .catch((error) => {
                          toast.error(error.response.data.message);
                        });
                    }}
                  >
                    <Delete />
                  </IconButton>
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
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Details
            </Typography>
          </Toolbar>
        </AppBar>
        <Box maxWidth="md" width="100%" sx={{ margin: "auto", padding: 2 }}>
          <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
            {row.title}
          </Typography>
          <Typography variant="body2" textAlign="left" gutterBottom>
            {new Date(Date.parse(row.created_at)).toLocaleDateString("en-us", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            | {row.status}
          </Typography>
          <Typography variant="body2" textAlign="left" gutterBottom>
            {row.name} | {row.roll} | {row.shortform}
          </Typography>
          <Typography variant="body2" textAlign="left" gutterBottom>
            {row.email} | {row?.mobile}
          </Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 3,
            }}
          >
            <FormControl
              fullWidth
              variant="outlined"
              sx={{
                ".MuiSelect-outlined": { padding: "8px 14px" },
                minHeight: "40px",
                marginRight: 2,
              }}
            >
              <InputLabel id="status-select-label">Status</InputLabel>
              <Select
                labelId="status-select-label"
                id="status-select"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="Due">Due</MenuItem>
                <MenuItem value="Approved">Approved</MenuItem>
                <MenuItem value="Rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              color="primary"
              endIcon={<SendIcon />}
              onClick={() => handleChangeStatus()}
              disabled={disable}
            >
              Change
            </Button>
          </Box>
          <Typography variant="body2" marginY={2} textAlign="left" gutterBottom>
            <div dangerouslySetInnerHTML={{ __html: row.details }}></div>
          </Typography>

          <Typography
            variant="body2"
            fontWeight="bold"
            textAlign="left"
            marginTop={2}
          >
            {row?.docs && "Documents attached"}
          </Typography>
          {row?.docs?.split(",").map((doc, id) => (
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
          <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
            Comments ({comments.length})
          </Typography>

          <Box>
            <TextField
              id="outlined-multiline-static"
              label="Comment"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
              onChange={(e) => setCommentText(e.target.value)}
              value={commentText}
              required
            />
            <Box
              sx={{ display: "flex", justifyContent: "flex-end", marginTop: 2 }}
            >
              <Button
                variant="contained"
                color="primary"
                endIcon={<ControlPointIcon />}
                onClick={handleAddComment}
                disabled={disable}
              >
                Comment
              </Button>
            </Box>
          </Box>

          <Box>
            {comments.map((comment) => (
              <Box
                sx={{
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  padding: 2,
                  marginTop: 2,
                }}
              >
                <Typography variant="body2" fontWeight="bold" gutterBottom>
                  {comment.name}
                  <IconButton
                    size="small"
                    sx={{
                      float: "right",
                    }}
                    onClick={() => {
                      handleDelete(comment.com_id);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ fontSize: "0.7rem" }}
                  gutterBottom
                >
                  {new Date(Date.parse(comment.date)).toLocaleDateString(
                    "en-us",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {comment.comment}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Dialog>
    </div>
  );
};
export default AdminComplains;
