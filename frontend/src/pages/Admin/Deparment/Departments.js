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
} from "@mui/material";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import Slide from "@mui/material/Slide";
import EditIcon from "@mui/icons-material/Edit";
import { Delete } from "@mui/icons-material";
import { Helmet } from "react-helmet";
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Departments() {
  const { loading, setLoading } = useAuth();
  const perPage = 20;
  const [page, setPage] = useState(0);
  const [departments, setDepartments] = useState([]);

  const [editMode, setEditMode] = useState(false);

  const [d_id, setD_id] = useState("");
  const [en_name, setEn_name] = useState("");
  const [bn_name, setBn_name] = useState("");
  const [est, setEst] = useState();
  const [shortform, setShortform] = useState("");

  const [open, setOpen] = React.useState(false);

  useEffect(() => {
    setLoading(true);
    getAllDepartments();
    setLoading(false);
  }, []);

  const handleAddDepartment = (e) => {
    e.preventDefault();
    setEditMode(false);
    handleClickOpen();
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmitDepartment = async (e) => {
    e.preventDefault();
    const prev = { d_id, en_name, bn_name, est, shortform };
    if (!d_id || !en_name || !bn_name || !est || !shortform) {
      toast.error("All fields are required", {
        toastId: "department",
      });
      return;
    }
    if (!editMode) {
      try {
        const response = await axios.post(
          "http://localhost:8000/api/admin/department",
          {
            d_id: d_id,
            en_name: en_name,
            bn_name: bn_name,
            est: est,
            shortform: shortform,
          },
          {
            headers: {
              Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
            },
          }
        );
        console.log("response", departments);
        await setDepartments([
          ...departments,
          { d_id, en_name, bn_name, est, shortform },
        ]);
        toast.success("Department added successfully", {
          toastId: "department_add",
        });
        setD_id("");
        setEn_name("");
        setBn_name("");
        setEst("");
        setShortform("");
        handleClose();
      } catch (error) {
        console.log(error);
        toast.error("Department not added", {
          toastId: "department_add_fail",
        });
      }
    } else {
      try {
        const response = await axios.put(
          "http://localhost:8000/api/admin/department",
          {
            d_id: d_id,
            en_name: en_name,
            bn_name: bn_name,
            est: est,
            shortform: shortform,
          },
          {
            headers: {
              Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
            },
          }
        );
        console.log("response", response);
        toast.success("Department updated successfully", {
          toastId: "department_Update",
        });
        setEditMode(false);
        await setDepartments(
          departments.map((dp) =>
            dp.d_id !== prev.d_id
              ? dp
              : { d_id, en_name, bn_name, est, shortform }
          )
        );
        handleClose();
        setD_id("");
        setEn_name("");
        setBn_name("");
        setEst("");
        setShortform("");
      } catch (error) {
        toast.error("Department not updated", {
          toastId: "department_Update_err",
        });
      }
    }
  };

  const getAllDepartments = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/department`,
        {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        }
      );
      if (response.status == 200) {
        console.log(response);
        setDepartments(response.data.departments);
      }
    } catch (error) {
      toast.error("Department not found", {
        toastId: "department",
      });
    }
  };

  const handleDeleteDepartment = async (e, d_id2) => {
    e.preventDefault();
    if (!d_id2) {
      toast.error("Department Id is required", {
        toastId: "department",
      });
      return;
    }
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/department/${d_id2}`,
        {
          headers: {
            Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
          },
        }
      );
      if (response.status == 200) {
        console.log(response);
        setDepartments(departments.filter((dp) => dp.d_id !== d_id2));
        toast.success("Department deleted successfully", {
          toastId: "department_del",
        });
      }
    } catch (error) {
      toast.error("Department not deleted", {
        toastId: "department_del_err",
      });
    }
  };
  return (
    <div>
      <Helmet>
        <title>Departments | Admin Panel | Complain NSTU</title>
      </Helmet>
      <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
        Departments
      </Typography>
      <IconButton
        aria-label="delete"
        sx={{ marginBottom: 1 }}
        onClick={handleAddDepartment}
      >
        <ControlPointIcon />
      </IconButton>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>English</TableCell>
              <TableCell>Shortform</TableCell>
              <TableCell>Bangla</TableCell>
              <TableCell>Established</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Delete</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!loading &&
              departments.map((department) => (
                <TableRow
                  key={department?.d_id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {department?.d_id}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {department?.en_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {department?.shortform}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {department?.bn_name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {department?.est}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <IconButton
                      aria-label="delete"
                      onClick={() => {
                        setEditMode(true);
                        setD_id(department?.d_id);
                        setEn_name(department?.en_name);
                        setBn_name(department?.bn_name);
                        setEst(department?.est);
                        setShortform(department?.shortform);
                        handleClickOpen();
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    <IconButton
                      aria-label="delete"
                      onClick={(e) => {
                        handleDeleteDepartment(e, department.d_id);
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
              {editMode ? "Edit Department" : "Add Department"}
            </Typography>
          </Toolbar>
        </AppBar>
        <Box maxWidth="md" width="100%" sx={{ margin: "auto", padding: 2 }}>
          <form action="">
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Department Id"
                value={d_id}
                placeholder="Department ID at least two characters"
                onChange={(e) => setD_id(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="English Name"
                value={en_name}
                placeholder="English name of the department"
                onChange={(e) => setEn_name(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Bangla Name"
                value={bn_name}
                placeholder="Bangla Name of the department"
                onChange={(e) => setBn_name(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Established"
                value={est}
                placeholder="Established year of the department"
                onChange={(e) => setEst(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Shortform"
                value={shortform}
                placeholder="Shortform of the department"
                onChange={(e) => setShortform(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <Box width="100%" sx={{ marginY: 2, textAlign: "right" }}>
              <Button
                onClick={handleSubmitDepartment}
                variant="contained"
                endIcon={<SendIcon />}
              >
                {editMode ? "Update" : "Add"}
              </Button>
            </Box>
          </form>
        </Box>
      </Dialog>
    </div>
  );
}
