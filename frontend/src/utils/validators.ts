// src/utils/validators.ts

export const validateEmail = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) {
    errors.push("L'email est requis");
  } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
    errors.push("L'email doit être au format valide, par exemple nom@mail.com");
  }
  return errors;
};

export const validatePassword = (value: string): string[] => {
  const errors: string[] = [];

  if (!value) {
    errors.push("Le mot de passe est requis");
    return errors;
  }

  if (value.length < 8) errors.push("8 caractères");
  if (value.length > 32) errors.push("moins de 32 caractères");
  if (!/[a-z]/.test(value)) errors.push("une lettre minuscule");
  if (!/[A-Z]/.test(value)) errors.push("une lettre majuscule");
  if (!/\d/.test(value)) errors.push("un chiffre");
  if (!/[@$!%*?&]/.test(value)) errors.push("un caractère spécial (@$!%*?&)");

  if (errors.length) {
    return [`Le mot de passe doit comporter au moins ${errors.join(", ")}.`];
  }

  return [];
};

export const validateFirstName = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) errors.push("Le prénom est requis");
  if (value.length < 2) errors.push("doit comporter au moins 2 caractères");
  if (value.length > 50)
    errors.push("Le prénom ne peut pas dépasser 50 caractères");
  return errors;
};

export const validateLastName = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) errors.push("Le nom est requis");
  if (value.length < 2) errors.push("doit comporter au moins 2 caractères");
  if (value.length > 100)
    errors.push("Le nom ne peut pas dépasser 100 caractères");
  return errors;
};

export const validateConfirmPassword = (
  password: string,
  confirmPassword: string
): string[] => {
  const errors: string[] = [];
  if (confirmPassword !== password) {
    errors.push("Les mots de passe ne correspondent pas");
  }
  return errors;
};
