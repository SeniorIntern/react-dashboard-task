import { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import UserDataType from "../helpers/types/UserDataType";
import Header from "./shared/Header";
import routes from "../helpers/routes";

export default function Layout() {
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);
  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav className="flex justify-between items-center h-16 bg-[var(--orange)] px-6 text-white">
        <ul className="flex justify-between w-[15%]">
          <li>
            <Link to="/">Home</Link>
          </li>
          {user.role == "player" && (
            <>
              <li>
                <Link to="/leaderboard">Leaderboard</Link>
              </li>
              <li>
                <Link to="/chat">Chat</Link>
              </li>
            </>
          )}
          {user.role == "admin" && (
            <li>
              <Link to="/players">Players</Link>
            </li>
          )}
          {user.role == "admin" || user.role == "staff" ? (
            <li>
              <Link to="/users">Users</Link>
            </li>
          ) : null}
        </ul>

        <div className="w-[50%] text-black h-full">
          <Header />
        </div>

        <div className="grid gap-0 w-[10%]">
          {user?.name && (
            <span className="text-center">
              {user.name.substring(0, 12)}
              <p className="inline">({user.role})</p>
            </span>
          )}
          <button
            onClick={() => {
              setUser({} as UserDataType);
              localStorage.removeItem("user");
              /* window.location.replace(routes.login); */
              navigate(routes.login);
            }}
            className="bg-red-600 p-1 rounded-lg"
          >
            LOGOUT
          </button>
        </div>
      </nav>
      <main className="min-h-[calc(100vh-4rem)] p-12 flex flex-col justify-center">
        <Outlet />
      </main>
    </div>
  );
}
