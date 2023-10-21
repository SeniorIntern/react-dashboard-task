import { createContext } from "react";
import { PlayersContextType } from "../helpers/types/GroupPlayerTypes";

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined,
);
/* export const PlayersContext = createContext<PlayersContextType>(
  [] as Players
); */
