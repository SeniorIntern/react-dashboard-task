type LoginFormActionType = {
  type: "UPDATE_FIELD" | "RESET";
  field?: keyof LoginFormState;
  value?: string;
};

export type LoginFormAction = LoginFormActionType;

type RegistrationFormActionType = {
  type: "UPDATE_FIELD" | "RESET";
  field?: keyof RegistrationFormState;
  value?: string;
};

export type RegistrationFormAction = RegistrationFormActionType;

type PlayerUpdateFormActionType = {
  type: "UPDATE_FIELD" | "RESET";
  field?: keyof PlayerUpdateFormState;
  value?: string;
};

export type PlayerUpdateFormAction = PlayerUpdateFormActionType;

type NewUserFormActionType = {
  type: "UPDATE_FIELD" | "RESET";
  field?: keyof NewUserFormState;
  value?: string;
};

export type NewUserFormAction = NewUserFormActionType;

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

type FormInputError = {
  name?: string;
  email: string;
  password?: string;
  role?: string;
  country?: string;
  hasInvalidField: boolean;
};

export default FormInputError;
