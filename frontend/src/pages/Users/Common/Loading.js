import React from "react";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";
import nstulogo from "../../images/logo.png";
import { Helmet } from "react-helmet";
const Loading = () => {
  return (
    <>
      <Helmet>
        <title>Loading | Complaint, NSTU</title>
      </Helmet>
      <LinearProgress />
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="99vh"
      >
        <div style={{ textAlign: "center" }}>
          <img src={nstulogo} alt="NSTU" width="80px" />
          <Typography variant="h6" marginBottom="0px" paddingBottom="0px">
            Complaint, NSTU
          </Typography>
        </div>
      </Box>
    </>
  );
};

export default Loading;
