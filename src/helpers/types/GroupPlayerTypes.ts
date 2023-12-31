export type PlayerDataType = {
  id: string;
  name: string;
  password?: string;
  rank?: number;
  active: boolean;
  country: string;
  statistics: {
    coins: number;
    experience_point: number;
    games_played: number;
    games_won: number;
  };
};

export type PlayersContextType = {
  players: PlayerDataType[];
  setPlayers: React.Dispatch<React.SetStateAction<PlayerDataType[]>>;
};
