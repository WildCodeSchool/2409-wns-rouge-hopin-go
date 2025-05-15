import React from "react";
import Button from "./Button";

type SearchFormRideProps = {
  departureCity: string;
  setDepartureCity: React.Dispatch<React.SetStateAction<string>>;
  arrivalCity: string;
  setArrivalCity: React.Dispatch<React.SetStateAction<string>>;
  departureAt: string;
  setDepartureAt: React.Dispatch<React.SetStateAction<string>>;
  error: Record<string, string[]>;
  handleSubmit: (e: React.FormEvent) => void;
  formatErrors: (errors: string[]) => string;
};

const SearchFormRide = ({
  departureCity,
  setDepartureCity,
  arrivalCity,
  setArrivalCity,
  departureAt,
  setDepartureAt,
  error,
  handleSubmit,
  formatErrors,
}: SearchFormRideProps) => {
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit(e);
      }}
      className=" flex flex-col items-center justify-center h-full max-w-sm mx-auto"
    >
      {/* Ville de départ */}
      <div className="mb-5 w-full">
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
      <div className="mb-5 w-full">
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
      <div className="mb-5 w-full">
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

export default SearchFormRide;
