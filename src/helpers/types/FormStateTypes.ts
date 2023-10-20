type LoginFormStateType = {
  role: string;
  email: string;
  password: string;
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
