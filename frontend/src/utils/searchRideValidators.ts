export const validateDepartureCity = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) errors.push("La ville de départ est requise");
  if (value.length < 2) errors.push("doit comporter au moins 2 caractères");
  if (value.length > 100)
    errors.push("La ville ne peut pas dépasser 100 caractères");
  return errors;
};

export const validateArrivalCity = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) errors.push("La ville d'arrivée est requise");
  if (value.length < 2) errors.push("doit comporter au moins 2 caractères");
  if (value.length > 100)
    errors.push("La ville ne peut pas dépasser 100 caractères");
  return errors;
};

export const validateDepartureAt = (value: string): string[] => {
  const errors: string[] = [];
  if (!value) errors.push("La date et l'heure sont requises");
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    errors.push("La date et l'heure sont invalides");
  } else {
    const now = new Date();
    if (date < now) {
      errors.push("La date et l'heure ne peuvent pas être dans le passé");
    }
  }

  return errors;
};
