import { createContext } from "react";
import UserContextType from "../helpers/types/UserContextType";

export const UserContext = createContext<UserContextType>(
  {} as UserContextType,
);
