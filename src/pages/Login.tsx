import { useContext, useReducer, useState } from "react";
import { loginFormReducer, loginInitialState } from "../helpers/reducer";
import validateForm from "../validateForm";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import routes from "../helpers/routes";
import { UserContext } from "../context/UserContext";
import { apiResource } from "../helpers/apiResource";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toast.css";

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
          /* alert("Login Sucessful!"); */
          toast.success(`Login Sucessful`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          // push route
          navigate(routes.home);
        } else {
          /* alert("Login Failed!"); */
          toast.error(`Login Failed!`, {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } catch (e: any) {
        setIsLoading(false);
        console.log(e);
        dispatch({ type: "RESET" });
        /* alert(e.response.data.message); */
        toast.error(`${e.response.data.message}`, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }
  };
  const inputField = `w-full border border-gray-800 px-3 py-2 rounded-lg`;
  const labelCss = `w-full h-4 px-3`;
  return (
    <section className="min-h-screen flex flex-col items-center">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Zoom}
      />

      <div className="flex my-auto bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="relative">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
          <div className="bg-white p-10 rounded-lg shadow-2xl w-full relative z-10 transform transition duration-500 ease-in-out">
            <h2 className="text-center text-3xl font-bold mb-10 text-gray-800 w-[30vw]">
              Login
            </h2>
            <div className="space-y-5 w-full">
              <form
                className="rounded-[1.2em] grid grid-cols-1 gap-2 w-full"
                onSubmit={handleFormSubmit}
              >
                <select
                  id="role"
                  name="role"
                  className={inputField}
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
                <label className={labelCss} htmlFor="role">
                  <span role="alert" className="inputFieldError">
                    {validationError?.role}
                  </span>
                </label>

                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className={inputField}
                  value={formData.email}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "email",
                      value: e.target.value,
                    })
                  }
                />
                <label htmlFor="email" className={labelCss}>
                  <span role="alert" className="inputFieldError">
                    {validationError?.email}
                  </span>
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  className={inputField}
                  value={formData.password}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "password",
                      value: e.target.value,
                    })
                  }
                />
                <label htmlFor="password" className={labelCss}>
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
                  <div className="flex justify-center pt-4">
                    <p className="text-[var(--orange)] border-t border-blue-800 w-fit">
                      New Player? Create an account.
                    </p>
                  </div>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
