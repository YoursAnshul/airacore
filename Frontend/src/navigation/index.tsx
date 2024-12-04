import {
  Routes,
  Route,
  Navigate,
  RouteProps,
  RoutesProps,
} from "react-router-dom";

import React, { Suspense, useEffect } from "react";
import { useState } from "react";
import ProtectedRoute from "./ProtectedRoute";
import Main from "../components/Main";
import { RootState } from "../config/Store";
import { UserState } from "../reducer/AuthReducer";
import { useSelector } from "react-redux";
import Dashboard from "../pages/Dashboard/Dashboard";
import CategoryManagement from "../pages/Category-Management/category";
const Navigation = () => {
  interface ProtectedRouteProps extends RoutesProps {
    isAuthenticated: boolean;
    authenticationPath: string;
  }

  const login: any = useSelector<RootState, UserState>(
    (state: any) => state.userLogin
  );


  const defaultProtectedRouteProps: Omit<ProtectedRouteProps, "outlet"> = {
    isAuthenticated: localStorage.getItem("token") != null,
    authenticationPath: "/login",
  };

  console.log("defaultProtectedRouteProps", defaultProtectedRouteProps)
  const Login = React.lazy(() => import("../components/Login/Login"));
  const Users = React.lazy(() => import("../pages/Users/Users"));
  const SignUp = React.lazy(() => import("../components/Sign Up/SignUp"));


  return (
    <>
      <div id="main-wraper">
        <Routes>
          <Route
            path="/login"
            element={
              <Suspense fallback={<></>}>
                {defaultProtectedRouteProps.isAuthenticated ||
                  login.loginSuccess ? (
                  <Navigate replace to="/dashboard" />
                ) : (
                  <Login />
                )}
              </Suspense>
            }
          />
           <Route
            path="/signup"
            element={
              <Suspense fallback={<></>}>
                  <SignUp />
              </Suspense>
            }
          />
         
          <Route
            path="/"
            element={
              <ProtectedRoute
                {...defaultProtectedRouteProps}
                outlet={<Main />}
              />
            }
          >
            <Route
              path="/users"
              element={
                <Suspense fallback={<></>}>
                  {" "}
                  <Users />{" "}
                </Suspense>
              }
            />
            <Route 
              path="/dashboard"
              element={
                <Suspense fallback={<></>}>
                  {" "}
                  <Dashboard />{" "}
                </Suspense>
              }
            />
            <Route
              path="/role-management"
              element={
                <Suspense fallback={<></>}>
                  {" "}
                  <CategoryManagement />{" "}
                </Suspense>
              }
            />
          </Route>
        </Routes>
      </div>
    </>
  );
};

export default Navigation;