type FormErrorsType = Record<string, string>;

export const handleFieldChange = <T, K extends keyof T>(
    field: K,
    value: T[K],
    setFormErrors: React.Dispatch<React.SetStateAction<FormErrorsType>>,
    formErrors: FormErrorsType,
    setFieldState: React.Dispatch<React.SetStateAction<T>>,
    requiredFields: K[]
) => {
    const updatedErrors = { ...formErrors };

    // Masque l'erreur si l'utilisateur commence à corriger le champ
    if (updatedErrors[field as string]) {
        delete updatedErrors[field as string];
        setFormErrors(updatedErrors);
    }

    // Détecter le type de champ et convertir la valeur si nécessaire
    setFieldState((prevState) => {
        let parsedValue: T[K] = value;

        // Conversion basée sur le type du champ
        if (typeof prevState[field] === "number" && typeof value === "string") {
            parsedValue = Number(value) as T[K];
        } else if (typeof prevState[field] === "boolean" && typeof value === "string") {
            parsedValue = (value === "true") as T[K];
        }

        return {
            ...prevState,
            [field]: parsedValue,
        };
    });

    // Ajouter une erreur si le champ est requis et vide
    if (requiredFields.includes(field) && !value) {
        setFormErrors({
            ...updatedErrors,
            [field as string]: "Ce champ est requis",
        });
    }
};
