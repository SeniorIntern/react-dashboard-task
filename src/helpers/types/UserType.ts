import UserDataType from "./UserDataType";

type UserType = {
  user: UserDataType;
  setUser: React.Dispatch<React.SetStateAction<UserDataType>>;
};

export default UserType;
