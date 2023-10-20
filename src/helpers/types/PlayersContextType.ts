import PlayerDataType from "./PlayerDataType";

type PlayersContextType = {
  players: PlayerDataType[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDataType[]>>;
};

export default PlayersContextType;
