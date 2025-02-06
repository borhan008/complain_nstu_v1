import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../Users/Context/AuthContext";
import Loading from "../Users/Common/Loading";
import AdminInterface from "./Common/AdminInterface";

const AdminRoute = ({ children }) => {
  const { user, loading, role } = useAuth();
  console.log(role);

  if (loading) {
    return <Loading />;
  }
  return user && role == "admin" ? (
    <>
      <AdminInterface>{children}</AdminInterface>
    </>
  ) : (
    <Navigate to="/" />
  );
};

export default AdminRoute;
