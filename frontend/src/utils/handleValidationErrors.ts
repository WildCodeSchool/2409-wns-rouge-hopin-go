export const handleValidationErrors = (error: any, setFieldErrors: any) => {
    const validationErrors =
        error?.graphQLErrors?.[0]?.extensions?.validationErrors || [];
    const errors: Record<string, string[]> = {};

    validationErrors.forEach((err: any) => {
        if (err.property && err.constraints) {
            errors[err.property] = Object.values(err.constraints);
        }
    });

    setFieldErrors(errors); // Met à jour le state
    console.log("Processed Validation Errors:", errors); // Debug

    return errors; // Retourne les erreurs pour un usage immédiat
};
