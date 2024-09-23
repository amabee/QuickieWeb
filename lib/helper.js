export const validateInputs = ({
  firstName,
  lastName,
  email,
  username,
  password,
  confirmPassword,
}) => {
  const errors = {};

  if (!firstName) {
    errors.firstName = "First name is required.";
  }

  if (!lastName) {
    errors.lastName = "Last name is required.";
  }

  if (!email) {
    errors.email = "Email is required.";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = "Email format is invalid.";
  }

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 3) {
    errors.username = "Username must be at least 3 characters long.";
  }

  if (!password) {
    errors.password = "Password is required.";
  } else if (password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.password = "Password must include at least one special character.";
  }

  if (confirmPassword !== password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};
