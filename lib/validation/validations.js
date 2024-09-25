export const CommentValidation = (input) => {
  if (input.length < 3) {
    return false;
  }

  return true;
};
