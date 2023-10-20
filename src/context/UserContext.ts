import { createContext } from "react";
import UserType from "../helpers/types/UserType";

export const UserContext = createContext<UserType>({} as UserType);
