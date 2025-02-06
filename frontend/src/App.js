import logo from "./logo.svg";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Users/Login/Login";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Home from "./pages/Users/Home/Home";
import "react-toastify/dist/ReactToastify.css";

import AddComplain from "./pages/Users/Complain/AddComplain";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./pages/Users/Context/AuthContext";
import PublicRouter from "./pages/Users/Context/PublicRouter";
import PrivateRouter from "./pages/Users/Context/PrivateRouter";
import ViewComplain from "./pages/Users/Complain/ViewComplain";
import Profile from "./pages/Users/Profile/Profile";
import AdminRoute from "./pages/Admin/AdminRoute";
import AdminHome from "./pages/Admin/Home/AdminHome";
import AllUserModule from "./pages/Admin/UsersModule/AllUserModule";
import Departments from "./pages/Admin/Deparment/Departments";
import AdminComplains from "./pages/Admin/Complains/AdminComplains";
import Notifications from "./pages/Users/Notifications/Notifications";
import { Helmet } from "react-helmet";

function App() {
  return (
    <AuthProvider>
      <Helmet>
        <title>Home | Complain NSTU</title>
      </Helmet>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRouter>
              <Login />
            </PublicRouter>
          }
        ></Route>
        <Route
          path="/"
          element={
            <PrivateRouter>
              <Home />
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/complain/add"
          element={
            <PrivateRouter>
              <AddComplain />
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/complain/detail/:c_id"
          element={
            <PrivateRouter>
              <ViewComplain />
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/notifications"
          element={
            <PrivateRouter>
              <Notifications />
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/profile"
          element={
            <PrivateRouter>
              <Profile />
            </PrivateRouter>
          }
        ></Route>
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminHome />
            </AdminRoute>
          }
        ></Route>
        <Route
          path="/admin/users"
          element={
            <AdminRoute>
              <AllUserModule />
            </AdminRoute>
          }
        ></Route>
        <Route
          path="/admin/departments"
          element={
            <AdminRoute>
              <Departments />
            </AdminRoute>
          }
        ></Route>
        <Route
          path="/admin/complains"
          element={
            <AdminRoute>
              <AdminComplains />
            </AdminRoute>
          }
        ></Route>
      </Routes>
      <ToastContainer position="bottom-right" autoClose={4000} />
    </AuthProvider>
  );
}

export default App;
