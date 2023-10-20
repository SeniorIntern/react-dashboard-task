import { Suspense, lazy, useEffect, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout";
import FallbackLoader from "./components/FallbackLoader";
import Login from "./pages/Login";
import { UserContext } from "./context/UserContext";
import UserDataType from "./helpers/types/UserDataType";
import axios from "axios";
import { apiResource } from "./helpers/types/apiResource";
import PermissionDenied from "./pages/PermissionDenied";

const Home = lazy(() => import("./pages/Home"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Players = lazy(() => import("./pages/Players"));
const Leaderboard = lazy(() => import("./pages/Leaderboard"));
const Users = lazy(() => import("./pages/Users"));
const Chat = lazy(() => import("./pages/Chat"));

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<UserDataType>({} as UserDataType);

  useEffect(() => {
    const refreshUserData = async () => {
      console.log("initial refresh trigger: ", user);
      if (Object.keys(user).length > 0) {
        const endpoint = apiResource.refreshToken;
        const res = await axios.post(endpoint, {
          refreshToken: user.refreshToken,
        });
        console.log(`res: `, res);
        const newData = await res.data;
        setUser((prevUser) => ({ ...prevUser, ...newData }));
      }
    };

    // renew token when route changes
    const refreshUserAndNavigate = async () => {
      // persist user data in localStorage
      const lsUser = localStorage.getItem("user");
      if (lsUser) {
        setUser(JSON.parse(lsUser));
      }
      console.log("lsUser", lsUser);

      console.log("route changed!!", location.pathname);
      await refreshUserData();

      navigate(location.pathname);
    };

    refreshUserAndNavigate();
  }, [location.pathname]);

  useEffect(() => {
    // update localStorage when user(token) updates
    if (Object.keys(user).length > 0) {
      console.log("updating token from context");
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  type RoleTypes = "admin" | "staff" | "player";
  // function to check if the user has the required role
  const hasRole = (user: UserDataType, requiredRole: RoleTypes) => {
    return user.role === requiredRole;
  };

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        {Object.keys(user).length === 0 ? (
          <Login />
        ) : (
          <Suspense fallback={<FallbackLoader />}>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route
                  path="players"
                  element={
                    hasRole(user, "admin") || hasRole(user, "staff") ? (
                      <Players />
                    ) : (
                      <Navigate to="/permission-denied" />
                    )
                  }
                />

                <Route
                  path="users"
                  element={
                    hasRole(user, "admin") ? (
                      <Users />
                    ) : (
                      <Navigate to="/permission-denied" />
                    )
                  }
                />

                <Route
                  path="chat"
                  element={
                    hasRole(user, "player") ? (
                      <Chat />
                    ) : (
                      <Navigate to="/permission-denied" />
                    )
                  }
                />

                <Route
                  path="leaderboard"
                  element={
                    hasRole(user, "player") ? (
                      <Leaderboard />
                    ) : (
                      <Navigate to="/permission-denied" />
                    )
                  }
                />
                <Route
                  path="permission-denied"
                  element={<PermissionDenied />}
                />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </Suspense>
        )}
      </UserContext.Provider>
    </>
  );
}
