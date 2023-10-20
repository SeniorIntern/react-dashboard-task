type LoginFormStateType = {
  role: string;
  email: string;
  password: string;
};

type NewUserFormStateType = {
  role: string;
  name: string;
  email: string;
  password: string;
  country?: string;
};

type PlayerUpdateFormStateType = {
  name: string;
  email: string;
  country: string;
};

type RegistrationFormStateType = {
  username: string;
  email: string;
  country: string;
  password: string;
};

export type LoginFormState = LoginFormStateType;
export type PlayerUpdateFormState = PlayerUpdateFormStateType;
export type RegistrationFormState = RegistrationFormStateType;
export type NewUserFormState = NewUserFormStateType;
