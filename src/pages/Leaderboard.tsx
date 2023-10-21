import axios from "axios";
import { useContext, useEffect, useState } from "react";
import PlayerTable from "../components/PlayerTable";
import { UserContext } from "../context/UserContext";
import { PlayerDataType } from "../helpers/types/GroupPlayerTypes";
import { apiResource } from "../helpers/apiResource";

export default function Leaderboard() {
  const [topPlayers, setTopPlayers] = useState<PlayerDataType[]>([]);
  const { user } = useContext(UserContext);
  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(apiResource.leaderboard, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        console.log("res", res);

        setTopPlayers(res.data);
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, []);

  return (
    <section>
      {topPlayers !== undefined && <PlayerTable players={topPlayers} />}
    </section>
  );
}
