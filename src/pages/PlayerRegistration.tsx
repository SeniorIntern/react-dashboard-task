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
          alert("Registration Sucessful!");
          // push route
          navigate(routes.home);
        }
      } catch (e: any) {
        setIsLoading(false);
        dispatch({ type: "RESET" });
        console.log(e);
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
        <input
          type="text"
          id="name"
          placeholder="Username"
          className="formInput"
          value={formData.username}
          onChange={(e) =>
            dispatch({
              type: "UPDATE_FIELD",
              field: "username",
              value: e.target.value,
            })
          }
        />
        <label className="validationError" htmlFor="name">
          <span role="alert" className="inputFieldError">
            {validationError?.name}
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
          className="formInput"
        >
          <option value="">Select your country</option>
          <option value="np">Nepal</option>
          <option value="in">India</option>
          <option value="us">USA</option>
          <option value="au">Australia</option>
          <option value="af">Afghanistan</option>
        </select>
        <label className="validationError" htmlFor="country">
          <span role="alert" className="inputFieldError">
            {validationError?.country}
          </span>
        </label>

        <input
          type="password"
          id="password"
          placeholder="Password"
          minLength={6}
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
        <label className="validationError" htmlFor="password">
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
          <div className="flex justify-center">
            <p className="text-white border-b border-blue-800 w-fit">
              Already have an account? Login.
            </p>
          </div>
        </Link>
      </form>
    </section>
  );
}
