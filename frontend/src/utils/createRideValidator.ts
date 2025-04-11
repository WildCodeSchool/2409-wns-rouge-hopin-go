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