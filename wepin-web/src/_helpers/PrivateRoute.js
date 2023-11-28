import React from "react";
import { Navigate } from "react-router-dom";
// import {useSelector} from 'react-redux';
import { history } from "./history";
import { localStorageUtil } from "../utils/LocalStorage";

export { PrivateRoute };

function PrivateRoute({ children }) {
  // const {user: authUser} = useSelector((x) => x.auth);
  let authUser = true;

  // accessToken이 있는지 검사
  if (
    localStorageUtil.get("accessToken") !== null &&
    localStorageUtil.get("accessToken") !== "null"
  ) {
    authUser = true;
  } else {
    authUser = false;
  }

  if (!authUser) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" state={{ from: history.location }} />;
  }

  // authorized so return child components
  return children;
}
