import React, { useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";

import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { GoogleIcon, SitemarkIcon } from "../../Icons/Icon";
import nstulogo from "../../images/logo.png";
import { Divider } from "@mui/material";
import AdjustIcon from "@mui/icons-material/Adjust";

import { auth, googleProvider } from "../../../config";
import { signInWithPopup } from "firebase/auth";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { Helmet } from "react-helmet";
const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  [theme.breakpoints.up("sm")]: {
    maxWidth: "450px",
  },
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));
const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,

  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));
export default function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const nstuEmailRegex = /^[a-zA-Z0-9._%+-]+[0-9]{4}@student\.nstu\.edu\.bd$/;
  const handleSignInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const userEmail = result.user.email;

      if (!nstuEmailRegex.test(userEmail)) {
        toast.error(
          "You must sign in with an email ending in [xxxx]@student.nstu.edu.bd",
          {
            position: "top-center",
            toastId: "user_auth_error",
          }
        );
        await auth.signOut();
        return;
      }
      const idToken = await result.user.getIdToken();
      setUser(result.user);
      setIsAuthenticated(true);
      console.log(idToken);
      toast.success(
        `${result.user.displayName}, you're successfully signed in. Now you can submit your complain. `,
        {
          position: "top-center",
          toastId: "user_auth_success",
        }
      );
    } catch (error) {
      console.error("Error during sign in:", error);
    }
  };
  return (
    <div>
      <Helmet>
        <title>Login | Complaint, NSTU</title>
      </Helmet>
      <Box
        display="flex"
        flex="1"
        justifyContent="space-between"
        alignItems="center"
        minHeight="100vh"
        maxWidth="md"
        marginX="auto"
        sx={{ flexGrow: 1 }}
      >
        <Grid container width="100%" spacing={2}>
          <Grid size={12} marginBottom="50px">
            <Box display="flex" justifyContent="center" alignItems="center">
              <img src={nstulogo} width="60px" alt="" />
              <div>
                <Typography
                  variant="h6"
                  textAlign="left"
                  marginBottom="0px"
                  paddingBottom="0px"
                  marginLeft="10px"
                >
                  Complaint, NSTU
                </Typography>
                <Typography
                  marginLeft="10px"
                  marginBottom="0px"
                  paddingBottom="0px"
                >
                  Complain us without hesitation.
                </Typography>
              </div>
            </Box>
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <Stack
              sx={{
                flexDirection: "column",
                alignSelf: "center",
                gap: 4,
                maxWidth: 450,
              }}
            >
              <Stack direction="row" sx={{ gap: 2 }}>
                <AdjustIcon />
                <div>
                  <Typography
                    textAlign="left"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Create account using your student email.
                  </Typography>
                </div>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <AdjustIcon />
                <div>
                  <Typography
                    textAlign="left"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Submit your complain.
                  </Typography>
                </div>
              </Stack>
              <Stack direction="row" sx={{ gap: 2 }}>
                <AdjustIcon />
                <div>
                  <Typography
                    textAlign="left"
                    variant="body2"
                    sx={{ color: "text.secondary" }}
                  >
                    Get feedback asap.
                  </Typography>
                </div>
              </Stack>
            </Stack>
          </Grid>
          <Grid size={{ md: 6, xs: 12 }}>
            <CssBaseline enableColorScheme />
            <SignInContainer direction="column" justifyContent="space-between">
              <Card variant="outlined">
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Button
                    type="submit"
                    fullWidth
                    variant="outlined"
                    startIcon={<GoogleIcon />}
                    onClick={handleSignInWithGoogle}
                  >
                    Sign in with Google
                  </Button>
                </Box>
              </Card>
            </SignInContainer>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
