import { useState } from "react";
import PlayerDataType from "../../helpers/types/PlayerDataType";
import PlayerDetailsModal from "../PlayerDetailsModal";
import SearchBar from "../SearchBar";
import { apiResource } from "../../helpers/types/apiResource";
import axios from "axios";
import { getLocalStorage } from "../../helpers/types/getLocalStorage";

export default function Header() {
  const [searchResults, setSearchResults] = useState<PlayerDataType[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerDataType | null>(
    null,
  );

  /* useEffect(() => {
  }, []); */

  const handleQueryChange = async (query: {
    name: string;
    country: string;
  }) => {
    // Implement the API call
    if (query.name.length > 0 || query.country.length > 0) {
      console.log("query changed!", query);
      const endpoint = `${apiResource.searchPlayer}country=${query.country}&pageSize=8&page=1&searchKey=${query.name}`;
      /* const endpoint = */
      /*   "http://localhost:3000/user/players/all?country=%20np&pageSize=10&page=1&searchKey=noe"; */
      const token = getLocalStorage("token");
      const res = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
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
