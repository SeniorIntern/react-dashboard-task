import React, { useContext, useReducer, useState } from "react";
import axios from "axios";
import validateForm from "../validateForm";
import {
  playerUpdateFormReducer,
  playerUpdateInitialState,
} from "../helpers/reducer";
/* import PlayerActionModal from "./PlayerActionModal"; */
import { UserContext } from "../context/UserContext";
import Modal from "./Modal";
import { PlayerDataType } from "../helpers/types/GroupPlayerTypes";
import { apiResource } from "../helpers/apiResource";

interface PlayerTableProps {
  players: PlayerDataType[]; // Assuming that players is an array of PlayerDataType
}

const PlayerTable: React.FC<PlayerTableProps> = ({ players }) => {
  const { user } = useContext(UserContext);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDataType>({
    id: "",
    name: "",
    active: false,
    country: "",
    statistics: {
      coins: 0,
      experience_point: 0,
      games_played: 0,
      games_won: 0,
    },
  });
  const [formData, dispatch] = useReducer(
    playerUpdateFormReducer,
    playerUpdateInitialState,
  );

  const handleStatusChange = async (id: string) => {
    setIsLoading(true);
    // call api
    console.log("change status of user:", id);
    // http request
    try {
      const endpoint = apiResource.playerState + "/" + id;
      console.log("endpoint===", endpoint);
      console.log("token===", `Bearer ${user.accessToken}`);
      const res = await axios.patch(
        endpoint,
        {},
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        },
      );

      console.log("registration res", res);

      setIsLoading(false);
      // udpate player status in the table
      const player = players.find((p) => p.id === id);
      if (player) player.active = !player.active;

      if (res.status < 400) {
        alert("Player status changed!");
      }
    } catch (e: any) {
      setIsLoading(false);
      console.log(e);
      e.response?.data?.message && alert(e.response.data.message);
    }
  };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [validationError, setValidationError] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    country: "",
    hasInvalidField: false,
  });

  const showPlayActionModal = () => {
    setIsModalOpen(true);
  };

  const closePlayActionModal = () => {
    setIsModalOpen(false);
  };

  const handlePlayerUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!isLoading) {
      const name = formData.name;
      const email = formData.email;
      const country = formData.country;

      // validate
      const formInputData = {
        name,
        email,
        country,
      };
      const formValidationResult = validateForm(formInputData, "updatePlayer");

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
        const endpoint = apiResource.playerUpdate + "/" + selectedPlayer.id;
        console.log("endpoint===", endpoint);

        const res = await axios.put(
          endpoint,
          {
            name: name,
            email: email,
            country: country,
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

        // udpate player status in the table
        const player = players.find((p) => p.id === selectedPlayer.id);
        if (player) {
          player.name = name;
          player.country = country;
        }

        if (res.status < 400) {
          alert("Update Sucessful!");
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
    <div className="w-full">
      <table className="w-full">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Active</th>
            <th>Country</th>
            <th>Coins</th>
            <th>Experience Points</th>
            <th>Games Played</th>
            <th>Games Won</th>
            {user.role !== "player" ? (
              <>
                <th>Update</th>
                <th>Change Status</th>
              </>
            ) : (
              <td className="bg-[var(--green)]">Rank</td>
            )}
          </tr>
        </thead>
        <tbody>
          {players?.map((player, index) => (
            <tr key={player.id}>
              <td>{player.id}</td>
              <td>{player.name}</td>
              <td>{player.active ? "Active" : "Inactive"}</td>
              <td>{player.country}</td>
              <td>{player.statistics.coins}</td>
              <td>{player.statistics.experience_point}</td>
              <td>{player.statistics.games_played}</td>
              <td>{player.statistics.games_won}</td>
              {user.role !== "player" ? (
                <>
                  <td
                    onClick={() => {
                      setSelectedPlayer(player);
                      showPlayActionModal();
                    }}
                    className="text-center cursor-pointer"
                  >
                    ✏️
                  </td>
                  {isLoading ? (
                    <td className="text-[var(--blue)]">PROCESSING...</td>
                  ) : (
                    <td
                      className="text-[var(--blue)] cursor-pointer"
                      onClick={() => {
                        handleStatusChange(player.id);
                      }}
                    >
                      {!player.active ? "active" : "Inactive"}
                    </td>
                  )}
                </>
              ) : (
                <td className="bg-[var(--orange)] text-white font-bold">
                  {index + 1}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isModalOpen} onClose={closePlayActionModal}>
        <div className="pt-10 px-4">
          <div>
            <span>
              Update Player:{" "}
              <p className="inline text-[var(--orange)]">
                {selectedPlayer.name}
              </p>
            </span>
          </div>
          <form
            className="grid grid-cols-1 gap-4 w-full pt-4"
            onSubmit={handlePlayerUpdate}
          >
            <div>
              <div className="grid grid-cols-[1fr,3fr] grid-rows-1 gap-0">
                <label>Name:</label>
                <input
                  type="text"
                  id="name"
                  placeholder="Username"
                  className="formInputSmall"
                  value={formData.name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "name",
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <label className="validationError" htmlFor="name">
                <span role="alert" className="inputFieldError">
                  {validationError?.name}
                </span>
              </label>
            </div>

            <div>
              <div className="grid grid-cols-[1fr,3fr] grid-rows-1 gap-0">
                <label>Email:</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  className="formInputSmall"
                  value={formData.email}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "email",
                      value: e.target.value,
                    })
                  }
                />
              </div>
              <label className="validationError" htmlFor="email">
                <span role="alert" className="inputFieldError">
                  {validationError?.email}
                </span>
              </label>
            </div>

            <div>
              <div className="grid grid-cols-[1fr,3fr] grid-rows-1 gap-0">
                <label>Country:</label>
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
                  className="formInputSmall"
                >
                  <option value="">Select a country</option>
                  <option value="np">Nepal</option>
                  <option value="in">India</option>
                  <option value="us">USA</option>
                  <option value="au">Australia</option>
                  <option value="af">Afghanistan</option>
                </select>
              </div>
              <label className="validationError" htmlFor="country">
                <span role="alert" className="inputFieldError">
                  {validationError?.country}
                </span>
              </label>
            </div>

            <div className="w-full flex justify-center">
              {isLoading ? (
                <div className="btn btn-orange mx-auto">PROCESSING...</div>
              ) : (
                <button type="submit" className="btn btn-orange mx-auto">
                  UPDATE
                </button>
              )}
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default PlayerTable;
