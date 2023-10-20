import { useContext, useEffect, useState } from "react";
import { PlayersContext } from "../context/PlayersContext";
import { Doughnut, PolarArea } from "react-chartjs-2";
import calculatePlayerStats from "../helpers/calculatePlayerStats";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  RadialLinearScale,
} from "chart.js";
import { UserContext } from "../context/UserContext";
import PlayerDataType from "../helpers/types/PlayerDataType";
import axios from "axios";
import { apiResource } from "../helpers/types/apiResource";
import UserDataType from "../helpers/types/UserDataType";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  RadialLinearScale,
);

type PlayerStats = {
  countryCounts: { [country: string]: number };
  activeCount: number;
  inactiveCount: number;
};
export default function Home() {
  const { user } = useContext(UserContext);
  const contextValue = useContext(PlayersContext);
  const [isProcessing, setIsProcessing] = useState(false);
  const [player, setPlayer] = useState<PlayerDataType>({} as PlayerDataType);
  const [playerStats, setPlayerStats] = useState<PlayerStats>(
    {} as PlayerStats,
  );
  const players = contextValue?.players;

  useEffect(() => {
    const init = async () => {
      // fetch player details using /player resource
      const res = await axios.get(apiResource.playerLogin, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("details res=", res);

      setPlayer(res.data);
    };
    if (players !== undefined) {
      const res = calculatePlayerStats(players);
      console.log("calc res==", res);
      setPlayerStats(res);
    }
    if (user.role == "player") {
      init();
    }
  }, []);

  const doughnutChartData = {
    labels: ["Active Players", "Inactive Players"],
    datasets: [
      {
        data: [playerStats.activeCount, playerStats.inactiveCount],
        backgroundColor: ["#3399ff", "#FF5733"], // Colors for the segments
      },
    ],
  };

  const polarChartData = {
    labels: ["np", "in", "us", "au", "af"],
    datasets: [
      {
        data: [
          playerStats.countryCounts?.np ?? 0,
          playerStats.countryCounts?.in ?? 0,
          playerStats.countryCounts?.us ?? 0,
          playerStats.countryCounts?.au ?? 0,
          playerStats.countryCounts?.af ?? 0,
        ],
        backgroundColor: [
          "#3399ff",
          "#FF5733",
          "#33cc66",
          "#FF416A",
          "#FFCD56",
        ], // Colors for the segments
      },
    ],
  };

  const simulateGame = async (user: UserDataType) => {
    setIsProcessing(true);
    try {
      const res = await axios.get(apiResource.playGame, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("simulateGame res", res);
      if (res.statusText == "OK") {
        alert(res.data.message);
      }
      const newStats = {
        id: player.id,
        name: player.name,
        active: player.active,
        country: player.country,
        statistics: {
          coins: res.data.data.coins,
          experience_point: res.data.data.experience_point,
          games_played: res.data.data.games_played,
          games_won: res.data.data.games_won,
        },
      };

      setIsProcessing(false);
      setPlayer(newStats);
    } catch (e) {
      setIsProcessing(false);
      console.log(e);
    }
  };

  return (
    <section className="w-full flex flex-col bg-gray-100 rounded-lg p-4">
      <div className="w-full flex justify-between">
        <div className="w-[40%]">
          {user.role !== "player" ? (
            <Doughnut data={doughnutChartData} />
          ) : (
            <div>
              <p className="text-center font-bold text-[1.25rem] p-2">
                BASIC INFORMATION
              </p>
              <p>ID: {player.id}</p>
              <p>Name: {player.name}</p>
              <p>Active Status: {player.active}</p>
              <p>Country: {player.country}</p>
            </div>
          )}
        </div>
        <div className="w-[40%]">
          {user.role !== "player" ? (
            <PolarArea data={polarChartData} />
          ) : (
            <div>
              <p className="text-center font-bold text-[1.25rem] p-2">
                STATISTICS
              </p>
              <p>Games Won: {player.statistics?.games_won}</p>
              <p>Coins: {player.statistics?.coins}</p>
              <p>Games Played: {player.statistics?.games_played}</p>
              <p>Experience point: {player.statistics?.experience_point}</p>
            </div>
          )}
        </div>
      </div>
      <div className="pt-10 flex justify-center">
        {isProcessing ? (
          <button className="btn btn-green">PROCESSING...</button>
        ) : (
          <button className="btn btn-orange" onClick={() => simulateGame(user)}>
            Simulate Game
          </button>
        )}
      </div>
    </section>
  );
}
