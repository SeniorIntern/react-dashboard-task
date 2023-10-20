import UserDataType from "./UserDataType";

type UserContextType = {
  user: UserDataType;
  setUser: React.Dispatch<React.SetStateAction<UserDataType>>;
};

export default UserContextType;
