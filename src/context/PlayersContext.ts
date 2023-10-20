import { createContext } from "react";
import PlayersContextType from "../helpers/types/PlayersContextType";

export const PlayersContext = createContext<PlayersContextType | undefined>(
  undefined,
);
/* export const PlayersContext = createContext<PlayersContextType>(
  [] as Players
); */
