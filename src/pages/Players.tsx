import { useContext, useEffect, useState } from "react";
import PlayerTable from "../components/PlayerTable";
import PaginationLinkTypes from "../helpers/types/PaginationLinkTypes";
import axios from "axios";
import { PlayersContext } from "../context/PlayersContext";
import { UserContext } from "../context/UserContext";
import { apiResource } from "../helpers/apiResource";

export default function Players() {
  const contextValue = useContext(PlayersContext);
  const { user } = useContext(UserContext);
  const players = contextValue?.players;
  const setPlayers = contextValue?.setPlayers;
  const [paginationLinks, setPaginationLinks] = useState<PaginationLinkTypes>({
    first: "",
    last: "",
    next: "",
    prev: "",
  });
  const initialUrl = apiResource.players + `?pageSize=20&page=1`;

  const handlePagination = async (endpoint: string) => {
    const api = apiResource.base + endpoint;
    try {
      const res = await axios.get(api, {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
        },
      });
      console.log("players res===", res);

      if (setPlayers) {
        // Check if setPlayers is defined
        setPlayers(res.data.data);
      }
      setPaginationLinks(res.data.links);
    } catch (e: unknown) {
      console.log(e);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const res = await axios.get(initialUrl, {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
          },
        });
        console.log("res===", res.data);
        // Check if setPlayers is defined
        if (setPlayers) {
          setPlayers(res.data.data);
        }
        setPaginationLinks(res.data.links);
        console.log("pagination links===", res.data.links);
      } catch (e: unknown) {
        console.log(e);
      }
    };
    init();
  }, []);

  return (
    <section className="w-full flex flex-col place-items-center">
      {/* players table */}
      {players !== undefined && <PlayerTable players={players} />}
      {/* pagination: first, prev, next, last */}
      <div className="pagination">
        {paginationLinks.first && (
          <button onClick={() => handlePagination(paginationLinks.first)}>
            First
          </button>
        )}
        &nbsp; &nbsp; &nbsp;
        {paginationLinks.prev && (
          <button onClick={() => handlePagination(paginationLinks.prev)}>
            Previous
          </button>
        )}
        &nbsp; &nbsp; &nbsp;
        {paginationLinks.next && (
          <button onClick={() => handlePagination(paginationLinks.next)}>
            Next
          </button>
        )}
        &nbsp; &nbsp; &nbsp;
        {paginationLinks.last && (
          <button onClick={() => handlePagination(paginationLinks.last)}>
            Last
          </button>
        )}
      </div>
    </section>
  );
}
