export const validateAddressUtils = (address: string, key: "departure" | "arrival", selected: string) => {
    console.log("validateAddress ===>", address, " && ", selected)
    const errors: string[] = [];
    if (!address && address.length === 0) {
    errors.push(
        key === "departure"
            ? "Une ville de départ est requise"
            : "Une ville d'arrivée est requise"
    );
    } else if (
        (address !== selected)
    ) {
        errors.push(
            key === "departure"
            ? "L'adresse de départ n'est pas valide"
            : "L'adresse d'arrivée n'est pas valide");
    }
    console.log("Errors", errors)
    return errors;
}

export const validateDepartureAt = (value: string): string[] => {
    const errors: string[] = [];
    const date = new Date(value);
    if (!value) {
        errors.push("La date et l'heure sont requises");
    }
    else if (isNaN(date.getTime())) {
      errors.push("La date et l'heure sont invalides");
    }
    else {
        const now = new Date();
        if (date < now) {
            errors.push("La date et l'heure ne peuvent pas être dans le passé");
        }
    }
    return errors;
  };

export const validateArrivalAt = (value: string, departureAt: string): string[] => {
    const errors: string[] = [];
    const date = new Date(value);
    if (!value) {
        errors.push("La date et l'heure sont requises");
    }
    else if (isNaN(date.getTime())) {
      errors.push("La date et l'heure sont invalides");
    }
    else {
        const now = new Date();
        if (date < now) {
            errors.push("La date et l'heure ne peuvent pas être dans le passé");
        }
        const departureDate = new Date(departureAt);
        if (date < departureDate) {
            errors.push("La date et l'heure d'arrivée ne peuvent pas être avant la date et l'heure de départ");
        }
    }
    return errors;
};