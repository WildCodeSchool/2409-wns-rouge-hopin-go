import Button from "./Button";

type SearchFormRideProps = {
  departureCity: string;
  setDepartureCity: React.Dispatch<React.SetStateAction<string>>;
  departureRadius: number;
  setDepartureRadius: React.Dispatch<React.SetStateAction<number>>;
  arrivalCity: string;
  setArrivalCity: React.Dispatch<React.SetStateAction<string>>;
  arrivalRadius: number;
  setArrivalRadius: React.Dispatch<React.SetStateAction<number>>;
  departureAt: string;
  setDepartureAt: React.Dispatch<React.SetStateAction<string>>;
  error: Record<string, string[]>;
  handleSubmit: (e: React.FormEvent) => void;
  formatErrors: (errors: string[]) => string;
  suggestions?: {
    departure: string[];
    arrival: string[];
  };

  showSuggestions?: {
    departure: boolean;
    arrival: boolean;
  };
  setShowSuggestions?: React.Dispatch<
    React.SetStateAction<{
      departure: boolean;
      arrival: boolean;
    }>
  >;
  setLastModifiedField?: React.Dispatch<
    React.SetStateAction<"departure" | "arrival" | null>
  >;
  handleSelect?: (
    field: "departure" | "arrival",
    value: string
  ) => void;
};

const SearchFormRide = ({
  departureCity,
  setDepartureCity,
  departureRadius,
  setDepartureRadius,
  arrivalCity,
  setArrivalCity,
  arrivalRadius,
  setArrivalRadius,
  departureAt,
  setDepartureAt,
  error,
  handleSubmit,
  formatErrors,
  suggestions = { departure: [], arrival: [] },
  showSuggestions = { departure: false, arrival: false },
  setShowSuggestions = () => { },
  setLastModifiedField = () => { },
  handleSelect = () => { },
}: SearchFormRideProps) => {


  const handleInputChange = (field: "departure" | "arrival", value: string) => {
    setLastModifiedField(field);
    if (field === "departure") {
      setDepartureCity(value);
      setShowSuggestions((prev) => ({ ...prev, departure: true }));
    } else {
      setArrivalCity(value);
      setShowSuggestions((prev) => ({ ...prev, arrival: true }));
    }
  };

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-full max-w-sm mx-auto"
    >
      {/* Ville de départ */}
      <div className="mb-5 w-full relative">
        <label
          htmlFor="departure-city"
          className="block mb-2 text-sm font-medium text-textLight"
        >
          Ville de départ
        </label>
        <input
          autoComplete="off"
          type="text"
          id="departure-city"
          required
          className={`${error.departureCity?.length
            ? "border-error border-2 bg-red-50"
            : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Paris"
          value={departureCity}
          onChange={(e) => handleInputChange("departure", e.target.value)}
        />
        {showSuggestions.departure && suggestions.departure.length > 0 && (
          <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-10">
            {suggestions.departure.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect("departure", suggestion)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error.departureCity && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.departureCity)}
          </p>
        )}
      </div>

      <div className="text-white text-sm gap-2 grid grid-cols-2 mb-4">
        <label
          className="col-span-2"
          htmlFor="departure-radius">
          Rayon de recherche pour la ville de départ
        </label>
        <input
          className="cursor-pointer grid-span-1 w-[300px]"
          type="range"
          id="departure-radius"
          name="departure-radius"
          min="1"
          max="100"
          value={departureRadius}
          onChange={(e) => setDepartureRadius(Number(e.target.value))}
        />
        <label className="grid-span-1 flex justify-end" htmlFor="departure-radius">{departureRadius} km</label>
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
          className={`${error.departureAt?.length
            ? "border-error border-2 bg-red-50"
            : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
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
      <div className="mb-5 w-full relative">
        <label
          htmlFor="arrival-city"
          className="block mb-2 text-sm font-medium text-white"
        >
          Ville d'arrivée
        </label>
        <input
          autoComplete="off"
          type="text"
          id="arrival-city"
          className={`${error.arrivalCity?.length
            ? "border-error border-2 bg-red-50"
            : "border-gray-300 bg-gray-50"
            } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
          placeholder="Lyon"
          value={arrivalCity}
          onChange={(e) => handleInputChange("arrival", e.target.value)}
        />
        {showSuggestions.arrival && suggestions.arrival.length > 0 && (
          <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-10">
            {suggestions.arrival.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelect("arrival", suggestion)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error.arrivalCity && (
          <p className="text-red-400 text-sm">
            {formatErrors(error.arrivalCity)}
          </p>
        )}
      </div>
      <div className=" text-white text-sm gap-2 grid grid-cols-2 mb-6">
        <label
          className="col-span-2"
          htmlFor="arrival-radius">
          Rayon de recherche pour la ville d'arrivée
        </label>
        <input
          className="cursor-pointer grid-span-1 w-[300px]"
          type="range"
          id="arrival-radius"
          name="arrival-radius"
          min="1"
          max="100"
          value={arrivalRadius}
          onChange={(e) => setArrivalRadius(Number(e.target.value))}
        />
        <label className="grid-span-1 flex justify-end" htmlFor="arrival-radius">{arrivalRadius} km</label>
      </div>

      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button variant="validation" type="submit" label="Rechercher" className="border-white border-2" />
      </div>
    </form>
  );
};

export default SearchFormRide;
