import { useState } from "react";
import Button from "./Button";
import { useLazyQuery } from "@apollo/client";
import { querySearchRide } from "../api/SearchRide";
import {
  validateDepartureCity as validateDepartureCityUtils,
  validateDepartureAt as validateDepartureAtUtils,
  validateArrivalCity as validateArrivalCityUtils,
} from "../utils/searchRideValidators";
import { toast } from "react-toastify";

const SearchRide = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAt, setDepartureAt] = useState("");
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
    const arrivalCityErrors = validateArrivalCityUtils(arrivalCity);

    // Mise à jour de l'état des erreurs une seule fois (plus clean !)
    setError({
      departureCity: departureCityErrors,
      arrivalCity: arrivalCityErrors,
      departureAt: departureAtErrors,
    });

    // Retourne true si TOUT est valide
    return [departureCityErrors, arrivalCityErrors, departureAtErrors].every(
      (errors) => errors.length === 0
    );
  };

  const [searchRide] = useLazyQuery(querySearchRide);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      return;
    }
    try {
      const result = await searchRide({
        variables: {
          data: {
            departure_city: departureCity,
            arrival_city: arrivalCity,
            departure_at: new Date(departureAt + ":00"),
          },
        },
      });
      console.log(result.data?.searchRide);
      toast.success("Inscription réussie !");
    } catch (error) {
      console.error(error);
      setError({
        form: ["Une erreur est survenue lors de l'inscription. Réessayez."],
      });
    }
  };

  return (
    <form
      noValidate
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
          type="datetime-local"
          id="departure-at"
          className={`${
            error.departureAt?.length
              ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
              : "border-gray-300 bg-gray-50"
          } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="2025-05-15T08:00"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        {error.departureAt && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.departureAt)}
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
      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button variant="validation" type="submit" label="Rechercher" />
      </div>
    </form>
  );
};

export default SearchRide;
