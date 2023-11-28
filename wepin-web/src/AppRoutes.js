import React from "react";
import { Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./_helpers/PrivateRoute";
import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Join from "./pages/Join/Join";
import Search from "./pages/Search/Search";
import FeedDetail from "./pages/Feed/FeedDetail";
import FeedIndex from "./pages/Feed/FeedIndex";

function AppRoutes() {
  const pathList = [
    {
      path: "/",
      element: <Home />,
      isLogin: true,
    },
    {
      path: "/login",
      element: <Login />,
      isLogin: false,
    },
    {
      path: "/join",
      element: <Join />,
      isLogin: false,
    },
    {
      path: "/search",
      element: <Search />,
      isLogin: true,
    },
    {
      path: "/feed/detail/:feedId",
      element: <FeedDetail />,
      isLogin: true,
    },
    {
      path: "/feed/index/:memberId",
      element: <FeedIndex />,
      isLogin: true,
    },
  ];

  return (
    <Routes>
      {pathList.map((v, idx) => {
        if (v.isLogin) {
          return (
            <Route
              key={idx}
              path={v?.path}
              element={<PrivateRoute>{v?.element}</PrivateRoute>}
            />
          );
        } else {
          return <Route key={idx} path={v?.path} element={v?.element} />;
        }
      })}
    </Routes>
  );
}

export default AppRoutes;
