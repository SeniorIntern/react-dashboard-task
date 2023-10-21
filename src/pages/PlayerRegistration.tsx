"use client";
import axios from "axios";
import React, { useReducer, useState } from "react";
import {
  registrationFormReducer,
  registrationInitialState,
} from "../helpers/reducer";
import validateForm from "../validateForm";
import { Link, useNavigate } from "react-router-dom";
import routes from "../helpers/routes";
import { apiResource } from "../helpers/apiResource";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toast.css";

export default function PlayerRegistration() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState({
    name: "",
    email: "",
    password: "",
    country: "",
    hasInvalidField: false,
  });
  const [formData, dispatch] = useReducer(
    registrationFormReducer,
    registrationInitialState,
  );

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    if (!isLoading) {
      const name = formData.username;
      const email = formData.email;
      const password = formData.password;
      const country = formData.country;

      // validate
      const formInputData = {
        name,
        email,
        country,
        password,
      };
      const formValidationResult = validateForm(formInputData, "registration");
      setValidationError((validationError) => ({
        ...validationError,
        ...formValidationResult,
      }));

      /* return if validation error */
      if (formValidationResult.hasInvalidField) {
        setIsLoading(false);
        return;
      }

      // http request
      try {
        const endpoint = apiResource.playerLogin;
        console.log("endpoint", endpoint);
        const res = await axios.post(endpoint, {
          name: name,
          email: email,
          country: country,
          password: password,
        });

        console.log("registration res", res);

        // store user in localStorage
        localStorage.setItem("user", JSON.stringify(res?.data));

        setIsLoading(false);
        dispatch({ type: "RESET" });
        if (res.status < 400) {
          /* alert("Registration Sucessful!"); */
          toast.success(`Registration Successful!`, {
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
        }
      } catch (e: any) {
        setIsLoading(false);
        dispatch({ type: "RESET" });
        console.log(e);
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
              Register
            </h2>
            <div className="space-y-5 w-full">
              <form
                className="rounded-[1.2em] grid grid-cols-1 gap-2 w-full"
                onSubmit={handleFormSubmit}
              >
                <input
                  type="text"
                  id="name"
                  placeholder="Username"
                  className={inputField}
                  value={formData.username}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "username",
                      value: e.target.value,
                    })
                  }
                />
                <label className={labelCss} htmlFor="name">
                  <span role="alert" className="inputFieldError">
                    {validationError?.name}
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

                <select
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "country",
                      value: e.target.value,
                    })
                  }
                  className={inputField}
                >
                  <option value="">Select your country</option>
                  <option value="np">Nepal</option>
                  <option value="in">India</option>
                  <option value="us">USA</option>
                  <option value="au">Australia</option>
                  <option value="af">Afghanistan</option>
                </select>
                <label className={labelCss} htmlFor="country">
                  <span role="alert" className="inputFieldError">
                    {validationError?.country}
                  </span>
                </label>

                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  minLength={6}
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
                <label className={labelCss} htmlFor="password">
                  <span role="alert" className="inputFieldError">
                    {validationError?.password}
                  </span>
                </label>

                <div className="w-full flex justify-center">
                  {isLoading ? (
                    <div className="btn btn-orange mx-auto">PROCESSING...</div>
                  ) : (
                    <button type="submit" className="btn btn-orange mx-auto">
                      REGISTER
                    </button>
                  )}
                </div>
                <Link to={routes.login}>
                  <div className="flex justify-center pt-4">
                    <p className="text-[var(--orange)] border-t border-blue-800 w-fit">
                      Already have an account? Login.
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
