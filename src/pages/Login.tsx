import { useContext, useReducer, useState } from "react";
import { loginFormReducer, loginInitialState } from "../helpers/reducer";
import validateForm from "../validateForm";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { apiResource } from "../helpers/types/apiResource";
import routes from "../helpers/routes";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState({
    email: "",
    role: "",
    password: "",
  });
  const [formData, dispatch] = useReducer(loginFormReducer, loginInitialState);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isLoading) {
      const email = formData.email;
      const password = formData.password;
      const role = formData.role;

      // validate
      const formInputData = {
        role,
        email,
        password,
      };
      const formValidationResult = validateForm(formInputData, "login");
      setValidationError((validationError) => ({
        ...validationError,
        ...formValidationResult,
      }));

      /* return if validation error */
      if (formValidationResult.hasInvalidField) {
        setIsLoading(false);
        return;
      }

      // authenticate
      try {
        let endpoint;
        if (formData.role == "user") endpoint = apiResource.login;
        else endpoint = apiResource.playerLogin;
        const res = await axios.post(endpoint, {
          email: email,
          password: password,
        });

        setUser(res.data);

        setIsLoading(false);
        dispatch({ type: "RESET" });
        if (res.status < 400) {
          alert("Login Sucessful!");
          // push route
          navigate(routes.home);
        } else {
          alert("Login Failed!");
        }
      } catch (e: any) {
        setIsLoading(false);
        console.log(e);
        dispatch({ type: "RESET" });
        alert(e.response.data.message);
      }
    }
  };

  return (
    <section className="min-h-screen grid place-items-center">
      <form
        className="bg-[var(--green)] rounded-[1.2em] grid grid-cols-1 gap-4 p-14 w-[40%]"
        onSubmit={handleFormSubmit}
      >
        <select
          id="role"
          name="role"
          className="formInput"
          value={formData.role}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "role",
              value: e.target.value,
            })
          }
        >
          <option value="">Select a user type</option>
          <option value="player">Player</option>
          <option value="user">admin/staff</option>
        </select>
        <label className="validationError" htmlFor="role">
          <span role="alert" className="inputFieldError">
            {validationError?.role}
          </span>
        </label>

        <input
          type="email"
          id="email"
          placeholder="Email"
          className="formInput"
          value={formData.email}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "email",
              value: e.target.value,
            })
          }
        />
        <label htmlFor="email" className="validationError">
          <span role="alert" className="inputFieldError">
            {validationError?.email}
          </span>
        </label>

        <input
          type="password"
          id="password"
          placeholder="Password"
          className="formInput"
          value={formData.password}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "password",
              value: e.target.value,
            })
          }
        />
        <label htmlFor="password" className="validationError">
          <span role="alert" className="inputFieldError">
            {validationError?.password}
          </span>
        </label>

        <div className="w-full flex justify-center">
          {isLoading ? (
            <div className="btn btn-orange mx-auto">PROCESSING...</div>
          ) : (
            <button type="submit" className="btn btn-orange mx-auto">
              LOGIN
            </button>
          )}
        </div>
        <Link to={routes.registerPlayer}>
          <p className="text-white text-[0.75rem]">
            New Player? Create an account.
          </p>
        </Link>
      </form>
    </section>
  );
}
