import {
  LoginFormAction,
  NewUserFormAction,
  PlayerUpdateFormAction,
  RegistrationFormAction,
} from "./types/FormActionTypes";
import {
  LoginFormState,
  NewUserFormState,
  PlayerUpdateFormState,
  RegistrationFormState,
} from "./types/FormStateTypes";

// initial state for all user (admin, staff, player)  form
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

// initial state for admin, staff register form
export const newUserInitialState: NewUserFormState = {
  role: "",
  name: "",
  email: "",
  password: "",
};

export const newUserFormReducer = (
  state: NewUserFormState,
  action: NewUserFormAction,
) => {
  switch (action.type) {
    case "UPDATE_FIELD":
      return { ...state, [action.field as string]: action.value };
    case "RESET":
      return newUserInitialState;
    default:
      return state;
  }
};

// initial state for player register form
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

// initial state for player update form
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
