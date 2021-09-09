import { UserInput } from "./UserInput";

export const validateRegister = (options: UserInput) => {
  if (options.username.trim().length <= 4) {
    return [
      {
        field: "username",
        message: "Username must be greater than 4 characters",
      },
    ];
  }

  if (options.username.includes("@")) {
    return [
      {
        field: "username",
        message: "Username could not includes @",
      },
    ];
  }

  if (!options.email.includes("@")) {
    return [
      {
        field: "email",
        message: "Email is not valid",
      },
    ];
  }

  if (options.password.trim().length <= 6) {
    return [
      {
        field: "password",
        message: "Password must be greater than 6 characters",
      },
    ];
  }

  return null;
};
