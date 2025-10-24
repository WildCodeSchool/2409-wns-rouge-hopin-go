export const formatErrors = (errors: string[]) => {
  if (errors.length === 0) return "";
  if (errors.length === 1) return errors[0];
  const lastError = errors.pop();
  return `${errors.join(", ")} et ${lastError}.`;
};
