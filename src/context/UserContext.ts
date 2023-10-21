import { createContext } from "react";
import { UserContextType } from "../helpers/types/GroupUserTypes";

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);
