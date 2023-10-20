import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import routes from "../helpers/routes";

export default function NotFound() {
  const navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => navigate(routes.home), 2000);
  }, []);
  return (
    <div>
      <h2>Nothing to see here!</h2>
      <p>
        <Link to="/">Redirecting to home page...</Link>
      </p>
    </div>
  );
}
