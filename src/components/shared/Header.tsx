import { useContext, useState } from "react";
import PlayerDetailsModal from "../PlayerDetailsModal";
import SearchBar from "../SearchBar";
import axios from "axios";
import { UserContext } from "../../context/UserContext";
import { PlayerDataType } from "../../helpers/types/GroupPlayerTypes";
import { apiResource } from "../../helpers/apiResource";

export default function Header() {
  const [searchResults, setSearchResults] = useState<PlayerDataType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDataType | null>(
    null,
  );
  const { user } = useContext(UserContext);

  const handleQueryChange = async (query: {
    name: string;
    country: string;
  }) => {
    // Implement the API call
    if (query.name.length > 0 || query.country.length > 0) {
      console.log("query changed!", query);
      const endpoint = `${apiResource.searchPlayer}country=${query.country}&pageSize=8&page=1&searchKey=${query.name}`;
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("search result:", res);

      setSearchResults(res.data.data);
    }
  };

  const openPlayerDetails = (player: PlayerDataType) => {
    setSelectedPlayer(player);
  };

  const closePlayerDetails = () => {
    setSelectedPlayer(null);
  };

  if (user.role === "player") return;
  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="w-full h-full flex items-center">
        <SearchBar onQueryChange={handleQueryChange} />
      </div>
      {searchResults.length > 0 && (
        <div className="top-14 absolute bg-[var(--black)] text-white border-2 border-black rounded-md h-fit">
          <div className="flex justify-end pr-4">
            <button onClick={() => setSearchResults([])}>X</button>
          </div>
          <ul className="w-[100%] grid gap-4">
            {searchResults.map((player) => (
              <li
                key={player.id}
                onClick={() => openPlayerDetails(player)}
                className="cursor-pointer"
              >
                {player.name} - {player.country}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedPlayer && (
        <PlayerDetailsModal
          player={selectedPlayer}
          onClose={closePlayerDetails}
        />
      )}
    </div>
  );
}
