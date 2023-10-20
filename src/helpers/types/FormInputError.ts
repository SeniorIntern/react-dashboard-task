type FormInputError = {
  name?: string;
  email: string;
  password?: string;
  role?: string;
  country?: string;
  hasInvalidField: boolean;
};

export default FormInputError;
