import React, { useEffect, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Container, Button, Typography, TextField } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import Box from "@mui/material/Box";
import Header from "../Header/Header";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { auth } from "../../../config";
import axios from "axios";
import { FilePond, registerPlugin } from "react-filepond";

import "filepond/dist/filepond.min.css";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet";
export default function AddComplain() {
  const [editorData, setEditorData] = useState("");
  const [title, setTitle] = useState("");
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  const [files, setFiles] = useState([]);
  const [checkedUser, setCheckUser] = useState(false);
  const handleSubmitComplain = async (e) => {
    e.preventDefault();
    if (title === "" || title.trim().length > 200) {
      toast.error("Title should be less than 200 characters and not empty.", {
        toastId: "title_error",
      });
      return;
    }
    if (editorData === "" || editorData.trim().length < 100) {
      toast.error("Complain must be at least 100 characters", {
        toastId: "complain",
      });
      return;
    }
    const idtoken = await auth?.currentUser?.getIdToken();
    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("details", editorData.trim());
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    console.log(formData);
    try {
      const response = await axios.post(
        "http://localhost:8000/api/complain/add",
        formData,
        {
          headers: {
            accept: "application/json",
            Authorization: `Bearer ${idtoken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      if (response.status === 201) {
        toast.success("Complain added successfully", {
          toastId: "complain_success",
        });
        setFiles([]);
        setEditorData("");
        setTitle("");
      }
    } catch (error) {
      toast.error("Something went wrong", {
        toastId: "complain_error",
      });
    }
  };
  const onFileChange = (e) => {
    const filesT = e.target.files;
    for (let i = 0; i < filesT.length; i++) {
      setFiles((prev) => [...prev, filesT[i]]);
    }
  };
  useEffect(() => {
    checkProfile();
  });
  const checkProfile = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/user/check", {
        headers: {
          Authorization: `Bearer ${await auth?.currentUser?.getIdToken()}`,
        },
      });
      if (response?.data?.user[0]?.uid === auth.currentUser.uid) {
        setCheckUser(true);
      } else setCheckUser(false);
    } catch (error) {
      setCheckUser(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Add Complaint | Complain NSTU</title>
      </Helmet>
      <Container maxWidth="md" sx={{ marginBottom: 2, textAlign: "left" }}>
        <Typography variant="h6" marginY={2} textAlign="left" gutterBottom>
          Add Complaint
        </Typography>
        {checkedUser === false ? (
          <p> You must be fill up your form first.</p>
        ) : (
          <form action="">
            <Box width="100%" sx={{ marginY: 2 }}>
              <TextField
                required
                id="outlined-required"
                label="Title"
                value={title}
                placeholder="TItle must be with 200 characters"
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Box>
            <CKEditor
              editor={ClassicEditor}
              config={{
                toolbar: [
                  "heading",
                  "|",
                  "bold",
                  "italic",
                  "link",
                  "bulletedList",
                  "numberedList",
                ],
              }}
              data={editorData}
              onChange={(event, editor) => {
                const data = editor.getData();
                setEditorData(data);
              }}
            />

            <Box sx={{ marginY: 2 }}>
              {/*
          <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload files
              <VisuallyHiddenInput
                type="file"
                onChange={onFileChange}
                multiple
              />
            </Button>
          */}
              <FilePond
                onupdatefiles={(fileItems) => {
                  setFiles(fileItems.map((fileItem) => fileItem.file));
                }}
                allowMultiple={true}
                maxFiles={10}
              ></FilePond>
            </Box>
            <Box sx={{ marginY: 2, textAlign: "right" }}>
              <Button
                onClick={handleSubmitComplain}
                variant="contained"
                endIcon={<SendIcon />}
              >
                Send
              </Button>
            </Box>
          </form>
        )}
      </Container>
    </>
  );
}
