import { Routes, Route, Navigate, RoutesProps } from "react-router-dom";
import React, { Suspense, useEffect } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../components/Main";
import { useSelector } from "react-redux";
import { RootState } from "../config/Store";
import { UserState } from "../reducer/AuthReducer";
import Login from "../components/Login/Login";
import ForgotPassword from "../components/Login/ForgotPassword";
import Otp from "../components/Login/Otp";
import ResetPassword from "../components/Login/ResetPassword";
import WebService from "../Services/WebService";
const Dashboard = React.lazy(() => import("../pages/Dashboard/Dashboard"));
const LogninLogoutLogs = React.lazy(() => import("../pages/LoginLogoutLogs/LoginLogoutLogs"));
const UserManagement = React.lazy(() => import("../pages/AdminUserManagement/AdminUserManagement"));
const RoleManagement = React.lazy(() => import("../pages/AdminRoleManagement/AdminRoleManagement"));
const AddRole = React.lazy(() => import("../pages/AdminRoleManagement/AddRole"));
const Profile = React.lazy(() => import("../pages/Profile/Profile"));

interface ProtectedRouteProps extends RoutesProps {
  isAuthenticated: boolean;
  authenticationPath: string;
};




const Navigation = () => {
  const login: any = useSelector<RootState, UserState>((state: any) => state.userLogin);
  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: localStorage.getItem("token") != null,
    authenticationPath: "/login",
  };




  return (
    <>
      <div id="main-wraper">
        <Routes>
          <Route path="*" element={<Login />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={defaultProtectedRouteProps.isAuthenticated || login.loginSuccess ? (
            <Navigate replace to="/dashboard" />) : (<Login />)} />
          <Route path="/sign-up" element={defaultProtectedRouteProps.isAuthenticated || login.loginSuccess ? (
            <Navigate replace to="/dashboard" />) : (<ForgotPassword />)} />
          <Route path="/otp" element={defaultProtectedRouteProps.isAuthenticated || login.loginSuccess ? (
            <Navigate replace to="/dashboard" />) : (<Otp />)} />
          <Route path="/reset-password" element={defaultProtectedRouteProps.isAuthenticated || login.loginSuccess ? (
            <Navigate replace to="/dashboard" />) : (<ResetPassword />)} />

          <Route path="/" element={<ProtectedRoute {...defaultProtectedRouteProps} outlet={<Main />} />}>
            <Route path="/dashboard" element={<Suspense fallback={<></>}> <Dashboard /> </Suspense>} />
            <Route path="/user-management" element={<Suspense fallback={<></>}> <UserManagement /> </Suspense>} />
            <Route path="/role-management" element={<Suspense fallback={<></>}> <RoleManagement /> </Suspense>} />
            <Route path="/login-logout" element={<Suspense fallback={<></>}> <LogninLogoutLogs /> </Suspense>} />
            <Route path="/add-role" element={<Suspense fallback={<></>}> <AddRole /> </Suspense>} />
            <Route path="/profile" element={<Suspense fallback={<></>}> <Profile /> </Suspense>} />
          </Route>
        </Routes >
      </div >
    </>
  );
};

export default Navigation;
