import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext"; // Ensure AuthContext is correctly imported
import Loading from "../Common/Loading";
import Header from "../Header/Header";

const PrivateRouter = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }
  return user ? (
    <>
      <Header /> {children}
    </>
  ) : (
    <Navigate to="/login" />
  );
};

export default PrivateRouter;
