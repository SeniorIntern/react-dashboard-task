import { useContext, useEffect, useState } from "react";
import { PlayersContext } from "../context/PlayersContext";

export default function Home() {
  const contextValue = useContext(PlayersContext);
  const players = contextValue?.players;
  const [playerSurvey, setPlayerSurvey] = useState();

  useEffect(() => {}, []);
  return (
    <div>
      <p>Total Players: {players?.length}</p>
    </div>
  );
}
