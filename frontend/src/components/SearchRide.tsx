import { useState } from "react";
import Button from "./Button";

const SearchRide = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [arrivalAt, setArrivalAt] = useState("");
  //   const [error, setError] = useState<Record<string, string[]>>({});

  // Fonction pour regrouper les erreurs en une phrase
  //   const formatErrors = (errors: string[]) => {
  //     if (errors.length === 0) return "";
  //     if (errors.length === 1) return errors[0];
  //     const lastError = errors.pop();
  //     return `${errors.join(", ")} et ${lastError}.`;
  //   };

  return (
    <form className="max-w-sm mx-auto">
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
          //   className={`${
          //     error.firstName?.length
          //       ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
          //       : "border-gray-300 bg-gray-50"
          //   } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Paris"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
        />
        {/* {error.firstName && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.firstName)}
          </p>
        )} */}
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
          //   className={`${
          //     error.lastName?.length
          //       ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
          //       : "border-gray-300 bg-gray-50"
          //   } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Dupont"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
        />
        {/* {error.lastName && (
          <p className="text-red-400 text-sm">{formatErrors(error.lastName)}</p>
        )} */}
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
          //   className={`${
          //     error.firstName?.length
          //       ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
          //       : "border-gray-300 bg-gray-50"
          //   } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Lyon"
          value={arrivalCity}
          onChange={(e) => setArrivalCity(e.target.value)}
        />
        {/* {error.email && (
          <p className="text-red-400 text-sm">{formatErrors(error.email)}</p>
        )} */}
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
          //   className={`${
          //     error.lastName?.length
          //       ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
          //       : "border-gray-300 bg-gray-50"
          //   } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Dupont"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
        />
        {/* {error.lastName && (
          <p className="text-red-400 text-sm">{formatErrors(error.lastName)}</p>
        )} */}
      </div>

      {/* Bouton */}
      <div className="flex w-full justify-end">
        {/* <Button
          onClick={doSubmit}
          variant="validation"
          type="button"
          label="S'inscrire"
        /> */}
      </div>
    </form>
  );
};

export default SearchRide;
