import { useContext, useEffect, useReducer, useState } from "react";
import validateForm from "../validateForm";
import axios from "axios";
import UserTabView from "../components/UserTabView";
import { newUserFormReducer, newUserInitialState } from "../helpers/reducer";
import { UserContext } from "../context/UserContext";
import Modal from "../components/Modal";
import { User } from "../helpers/types/GroupUserTypes";
import { apiResource } from "../helpers/apiResource";
import { ToastContainer, Zoom, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../toast.css";

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const { user } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [createPlayer, setCreatePlayer] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    country: "",
    hasInvalidField: false,
  });
  const [formData, dispatch] = useReducer(
    newUserFormReducer,
    newUserInitialState,
  );
  const [refreshTabCount, setRefreshTabCount] = useState<number>(0);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleUserFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isLoading) {
      const email = formData.email;
      const password = formData.password;
      const name = formData.name;
      const country = formData.country;
      const role = formData.role;

      // validate
      const FinalformData = createPlayer
        ? {
            name,
            email,
            country,
            password,
            role,
          }
        : {
            name,
            email,
            role,
            password,
          };
      const formValidationResult = createPlayer
        ? validateForm(FinalformData, "registration")
        : validateForm(FinalformData, "createUser");

      setValidationError((validationError) => ({
        ...validationError,
        ...formValidationResult,
      }));

      /* return if validation error */
      if (formValidationResult.hasInvalidField) {
        setIsLoading(false);
        return;
      }

      try {
        const endpoint = createPlayer
          ? apiResource.playerLogin
          : apiResource.addUser;
        const res = await axios.post(
          endpoint,
          {
            name: name,
            email: email,
            country: country,
            role: role,
            password: password,
          },
          {
            headers: {
              Authorization: `Bearer ${user.accessToken}`,
            },
          },
        );
        console.log("registration res", res);
        setIsLoading(false);
        dispatch({ type: "RESET" });
        closeModal();

        if (res.status < 400) {
          res?.data?.message &&
            toast.success(`${res.data.message}`, {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "light",
            });
          setRefreshTabCount((prevCount) => prevCount + 1);
          /* alert(res.data.message); */
        }
      } catch (e: any) {
        setIsLoading(false);
        console.log(e);
        dispatch({ type: "RESET" });
        closeModal();
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

  useEffect(() => {
    // fetch players to display in leaderboard
    const endpoint = `${apiResource.allUser}?pageSize=10&page=1`;
    const init = async () => {
      try {
        const res = await axios.get(endpoint, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        console.log("users res===", res);
        setUsers(res.data.data);
      } catch (e: unknown) {
        console.log(e);
      }
    };
    init();
  }, [refreshTabCount]);

  return (
    <div className="w-full h-full">
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

      <div className="w-full flex justify-end pr-12">
        <button onClick={openModal} className="btn btn-orange">
          Create User
        </button>
      </div>

      <div className="w-full flex justify-center pt-10">
        <UserTabView users={users} />
      </div>
      <div className="w-full flex justify-center">
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <form
            className="rounded-[1.2em] grid grid-cols-1 gap-4 pt-10 w-full"
            onSubmit={handleUserFormSubmit}
          >
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={(e) => {
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "role",
                  value: e.target.value,
                });

                if (e.target.value == "player") setCreatePlayer(true);
                else setCreatePlayer(false);
              }}
              className="formInput"
            >
              <option value="">Select user role</option>
              <option value="admin">Admin</option>
              <option value="staff">Staff</option>
              <option value="player">Player</option>
            </select>
            <label className="validationError" htmlFor="role">
              <span role="alert" className="inputFieldError">
                {validationError?.role}
              </span>
            </label>

            {createPlayer && (
              <>
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
                  <option value="">Select player's country</option>
                  <option value="np">Nepal</option>
                  <option value="in">India</option>
                  <option value="us">USA</option>
                  <option value="au">Australia</option>
                  <option value="af">Afghanistan</option>
                </select>
                <label className="validationError" htmlFor="country">
                  {createPlayer && (
                    <span role="alert" className="inputFieldError">
                      {validationError?.country}
                    </span>
                  )}
                </label>
              </>
            )}
            <input
              type="text"
              id="name"
              placeholder="User Name"
              className="formInput"
              value={formData.name}
              onChange={(e) =>
                dispatch({
                  type: "UPDATE_FIELD",
                  field: "name",
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

            <input
              type="password"
              id="password"
              placeholder="Password"
              required
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
                  CREATE
                </button>
              )}
            </div>
          </form>
        </Modal>
      </div>
    </div>
  );
}
