export const CommentValidation = (data) => {
  const errors = {};

  if (!data.thread || data.thread.trim().length < 3) {
    errors.thread = "Minimum 3 characters.";
  }

  return errors;
};
