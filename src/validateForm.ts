import FormInputError from "./helpers/types/FormInputError";

// all users
interface LoginForm {
  role: string;
  email: string;
  password: string;
}

// admin,staff
interface CreateUserForm {
  name: string;
  role: string;
  email: string;
  password: string;
  country?: string;
}

// player registration
interface RegistrationForm {
  name: string;
  email: string;
  country: string;
  password: string;
}

// player update
interface PlayerUpdateForm {
  name: string;
  email: string;
  password?: string;
  country: string;
}

type FormType = "login" | "registration" | "createUser" | "updatePlayer";

const validateForm = (
  formData: LoginForm | CreateUserForm | RegistrationForm | PlayerUpdateForm,
  formType: FormType,
) => {
  let hasInvalidField = false;

  let errors: FormInputError = {
    name: "",
    email: "",
    password: "",
    role: "",
    country: "",
    hasInvalidField: false,
  };

  // Common validation logic for all forms
  if (!formData.email || !formData.email.trim()) {
    errors.email = "Email is required";
    hasInvalidField = true;
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    errors.email = "Invalid email address";
    hasInvalidField = true;
  }

  // Specific validation logic based on form type
  if (formType === "login") {
    const loginFormData = formData as LoginForm;
    if (!loginFormData.role || !loginFormData.role.trim()) {
      errors.role = "User role is required";
      hasInvalidField = true;
    }

    if (!formData.password || !formData.password.trim()) {
      errors.password = "Password is required";
      hasInvalidField = true;
    }
  } else if (formType === "createUser") {
    const createUserFormData = formData as CreateUserForm;
    if (!createUserFormData.name || !createUserFormData.name.trim()) {
      errors.name = "User name is required";
      hasInvalidField = true;
    }

    if (!createUserFormData.role || !createUserFormData.role.trim()) {
      errors.role = "User role is required";
      hasInvalidField = true;
    }

    if (!formData.password || !formData.password.trim()) {
      errors.password = "Password is required";
      hasInvalidField = true;
    }
  } else if (formType === "registration") {
    const registrationFormData = formData as RegistrationForm;
    if (!registrationFormData.name || !registrationFormData.name.trim()) {
      errors.name = "Name is required";
      hasInvalidField = true;
    }

    if (!registrationFormData.country || !registrationFormData.country.trim()) {
      errors.country = "Country is required";
      hasInvalidField = true;
    }

    if (!formData.password || !formData.password.trim()) {
      errors.password = "Password is required";
      hasInvalidField = true;
    }
  } else if (formType === "updatePlayer") {
    const registrationFormData = formData as PlayerUpdateForm;
    if (!registrationFormData.name || !registrationFormData.name.trim()) {
      errors.name = "Name is required";
      hasInvalidField = true;
    }

    if (!registrationFormData.country || !registrationFormData.country.trim()) {
      errors.country = "Country is required";
      hasInvalidField = true;
    }
  }

  // Return errors object containing validation results
  errors = { ...errors, ...{ hasInvalidField } };
  return errors;
};

export default validateForm;
