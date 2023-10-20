import { useContext } from "react";
import { Link, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import UserDataType from "../helpers/types/UserDataType";

export default function Layout() {
  const { user, setUser } = useContext(UserContext);
  return (
    <div className="flex flex-col min-h-screen w-full">
      <nav>
        <ul className="flex justify-between px-4">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/players">Players</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/leaderboard">Leaderboard</Link>
          </li>
          <li>
            <Link to="/chat">Chat</Link>
          </li>
        </ul>

        <span>
          <p>Hello {user?.name && user.name}</p>
        </span>
        <button
          onClick={() => {
            setUser({} as UserDataType);
            localStorage.removeItem("user");
            window.location.reload();
          }}
        >
          Logout
        </button>
      </nav>
      <Outlet />
    </div>
  );
}
