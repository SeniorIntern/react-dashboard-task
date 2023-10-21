export type UserContextType = {
  user: UserDataType;
  setUser: React.Dispatch<React.SetStateAction<UserDataType>>;
};

export type UserDataType = {
  accessToken: string;
  refreshToken: string;
  id: string;
  name: string;
  role: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  created_at: string;
  updated_at: string;
  refresh_key?: string;
};
