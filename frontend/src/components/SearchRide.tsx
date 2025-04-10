import { useState } from "react";
import Button from "./Button";
import { useLazyQuery } from "@apollo/client";
import { querySearchRide } from "../api/SearchRide";

const SearchRide = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [arrivalAt, setArrivalAt] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});

  //Fonction pour regrouper les erreurs en une phrase
  const formatErrors = (errors: string[]) => {
    if (errors.length === 0) return "";
    if (errors.length === 1) return errors[0];
    const lastError = errors.pop();
    return `${errors.join(", ")} et ${lastError}.`;
  };

  const validateCreateForm = (): boolean => {
    const departureCityErrors = validateDepartureCityUtils(departureCity);
    const departureAtErrors = validateDepartureAtUtils(departureAt);
    const arrivalAtErrors = validateArrivalAtUtils(arrivalAt);
    const arrivalCityErrors = validateArrivalCityUtils(arrivalCity);

    // Mise à jour de l'état des erreurs une seule fois (plus clean !)
    setError({
      departureCity: departureCityErrors,
      arrivalCity: arrivalCityErrors,
      departureAt: departureAtErrors,
      arrivalAt: arrivalAtErrors,
    });

    // Retourne true si TOUT est valide
    return [
      departureCityErrors,
      arrivalCityErrors,
      departureAtErrors,
      arrivalAtErrors,
    ].every((errors) => errors.length === 0);
  };

  const [searchRide, { loading, data }] = useLazyQuery(querySearchRide);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await searchRide({
        variables: {
          departure_city: departureCity,
          arrival_city: arrivalCity,
          departure_at: departureAt,
          arrival_at: arrivalAt,
        },
      });
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className="max-w-sm mx-auto"
    >
      {/* Ville de départ */}
      <div className="mb-5">
        <label
          htmlFor="departure-city"
          className="block mb-2 text-sm font-medium text-textLight"
        >
          Ville de départ
        </label>
        <input
          type="text"
          id="departure-city"
          minLength={2}
          maxLength={50}
          required
          className={`${
            error.firstName?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Paris"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
        />
        {error.departureCity && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.departureCity)}
          </p>
        )}
      </div>
      {/* Date de départ */}
      <div className="mb-5">
        <label
          htmlFor="departure-at"
          className="block mb-2 text-sm font-medium text-white"
        >
          Date de départ
        </label>
        <input
          type="date"
          id="departure-at"
          className={`${
            error.departureCity?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Dupont"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        {error.departureCity && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.departureCity)}
          </p>
        )}
      </div>
      {/* Ville d'arrivée */}
      <div className="mb-5">
        <label
          htmlFor="arrival-city"
          className="block mb-2 text-sm font-medium text-white "
        >
          Ville d'arrivée
        </label>
        <input
          type="text"
          id="arrival-city"
          className={`${
            error.arrivalCity?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Lyon"
          value={arrivalCity}
          onChange={(e) => setArrivalCity(e.target.value)}
        />
        {error.arrivalCity && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.arrivalCity)}
          </p>
        )}
      </div>
      {/* Date d'arrivée' */}
      <div className="mb-5">
        <label
          htmlFor="arrival-at"
          className="block mb-2 text-sm font-medium text-white"
        >
          Date d'arrivée
        </label>
        <input
          type="date"
          id="arrival-at"
          className={`${
            error.arrivalAt?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Dupont"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
        />
        {error.arrivalAt && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.arrivalAt)}
          </p>
        )}
      </div>
      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button variant="validation" type="submit" label="Rechercher" />
      </div>
    </form>
  );
};

export default SearchRide;
