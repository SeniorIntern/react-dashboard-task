import {
  LoginFormAction,
  PlayerUpdateFormAction,
  RegistrationFormAction,
} from "./types/FormActionTypes";
import {
  LoginFormState,
  PlayerUpdateFormState,
  RegistrationFormState,
} from "./types/FormStateTypes";

export const loginInitialState: LoginFormState = {
  role: "",
  email: "",
  password: "",
};

export const loginFormReducer = (
  state: LoginFormState,
  action: LoginFormAction,
) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field as string]: action.value };
    case "RESET":
      return loginInitialState;
    default:
      return state;
  }
};

export const registrationInitialState: RegistrationFormState = {
  username: "",
  email: "",
  country: "",
  password: "",
};

export const registrationFormReducer = (
  state: RegistrationFormState,
  action: RegistrationFormAction,
) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field as string]: action.value };
    case "RESET":
      return registrationInitialState;
    default:
      return state;
  }
};

export const playerUpdateInitialState: PlayerUpdateFormState = {
  name: "",
  email: "",
  country: "",
};

export const playerUpdateFormReducer = (
  state: PlayerUpdateFormState,
  action: PlayerUpdateFormAction,
) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field as string]: action.value };
    case "RESET":
      return playerUpdateInitialState;
    default:
      return state;
  }
};
