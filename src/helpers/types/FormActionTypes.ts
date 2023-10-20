import {
  LoginFormState,
  PlayerUpdateFormState,
  RegistrationFormState,
} from "./FormStateTypes";

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
