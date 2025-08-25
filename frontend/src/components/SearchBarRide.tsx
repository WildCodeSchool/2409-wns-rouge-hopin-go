import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

type SearchBarRideProps = {
  departureCity: string;
  setDepartureCity: React.Dispatch<React.SetStateAction<string>>;
  setDepartureCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; long: number }>
  >;
  departureRadius: number;
  setDepartureRadius: React.Dispatch<React.SetStateAction<number>>;
  arrivalCity: string;
  setArrivalCity: React.Dispatch<React.SetStateAction<string>>;
  setArrivalCoords: React.Dispatch<
    React.SetStateAction<{ lat: number; long: number }>
  >;
  arrivalRadius: number;
  setArrivalRadius: React.Dispatch<React.SetStateAction<number>>;
  departureAt: string;
  setDepartureAt: React.Dispatch<React.SetStateAction<string>>;
  error: Record<string, string[]>;
  handleSubmit: (e: React.FormEvent) => void;
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
  handleSelect?: (field: "departure" | "arrival", value: string) => void;
};

const SearchBarRide = ({
  departureCity,
  setDepartureCity,
  setDepartureCoords,
  departureRadius,
  setDepartureRadius,
  arrivalCity,
  setArrivalCity,
  setArrivalCoords,
  arrivalRadius,
  setArrivalRadius,
  departureAt,
  setDepartureAt,
  error,
  handleSubmit,
  suggestions = { departure: [], arrival: [] },
  showSuggestions = { departure: false, arrival: false },
  setShowSuggestions = () => {},
  setLastModifiedField = () => {},
  handleSelect = () => {},
}: SearchBarRideProps) => {
  const [searchParams] = useSearchParams();
  const departureCityParam = searchParams.get("departure_city") || "";
  const arrivalCityParam = searchParams.get("arrival_city") || "";
  const departureAtParam = searchParams.get("departure_at") || "";
  const departureRadiusParam = searchParams.get("departure_radius") || "0";
  const arrivalRadiusParam = searchParams.get("arrival_radius") || "0";
  useEffect(() => {
    const departureCoordsParams = {
      long: Number(searchParams.get("departure_lng")) || 0,
      lat: Number(searchParams.get("departure_lat")) || 0,
    };
    const arrivalCoordsParams = {
      long: Number(searchParams.get("arrival_lng")) || 0,
      lat: Number(searchParams.get("arrival_lat")) || 0,
    };
    setDepartureCity(departureCityParam);
    setDepartureCoords(departureCoordsParams);
    setDepartureRadius(Number(departureRadiusParam));
    setArrivalCity(arrivalCityParam);
    setArrivalCoords(arrivalCoordsParams);
    setArrivalRadius(Number(arrivalRadiusParam));
    setDepartureAt(departureAtParam);
  }, [
    departureCityParam,
    departureRadiusParam,
    arrivalCityParam,
    arrivalRadiusParam,
    departureAtParam,
    setDepartureCity,
    setDepartureRadius,
    setArrivalCity,
    setArrivalRadius,
    setDepartureAt,
    setDepartureCoords,
    setArrivalCoords,
    searchParams,
  ]);

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
    <>
      <>
        <form
          id="search-ride-form"
          // noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          className="flex flex-row w-full gap-4"
        >
          {/* Ville de départ */}
          <div>
            <label
              htmlFor="departure-city"
              className="block mb-1 text-sm font-medium text-textLight"
            >
              Départ
            </label>
            <input
              type="text"
              id="departure-city"
              required
              className={`${
                error.firstName?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Paris"
              value={departureCity}
              onChange={(e) => handleInputChange("departure", e.target.value)}
            />
            {showSuggestions.departure && suggestions.departure.length > 0 && (
              <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-20">
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
          </div>
          {/* Rayon de recherche pour la ville de départ */}
          <div className="flex flex-col">
            <label
              htmlFor="departure-radius"
              className="block mb-1 text-sm font-medium text-white"
            >
              Rayon
            </label>
            <input
              type="number"
              id="departure-radius"
              min="0"
              max="100"
              style={{ width: "52px" }}
              className={`${
                error.departureRadius?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              value={departureRadius}
              onChange={(e) => setDepartureRadius(Number(e.target.value))}
            />
          </div>
          {/* Ville d'arrivée */}
          <div>
            <label
              htmlFor="arrival-city"
              className="block mb-1 text-sm font-medium text-white "
            >
              Arrivée
            </label>
            <input
              type="text"
              id="arrival-city"
              className={`${
                error.arrivalCity?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Lyon"
              value={arrivalCity}
              onChange={(e) => handleInputChange("arrival", e.target.value)}
            />
            {showSuggestions.arrival && suggestions.arrival.length > 0 && (
              <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-20">
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
          </div>
          {/* Rayon de recherche pour la ville d'arrivée */}
          <div className="flex flex-col">
            <label
              htmlFor="arrival-radius"
              className="block mb-1 text-sm font-medium text-white"
            >
              Rayon
            </label>
            <input
              type="number"
              id="arrival-radius"
              min="0"
              max="100"
              style={{ width: "52px" }}
              className={`${
                error.arrivalRadius?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              value={arrivalRadius}
              onChange={(e) => setArrivalRadius(Number(e.target.value))}
            />
          </div>
          {/* Date de départ */}
          <div>
            <label
              htmlFor="departure-at"
              className="block mb-1 text-sm font-medium text-white"
            >
              Date
            </label>
            <input
              type="date"
              id="departure-at"
              min={new Date().toISOString().split("T")[0]}
              className={`${
                error.departureAt?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
              } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5 ${
                !departureAt ? "text-gray-400" : "text-black"
              }`}
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
            />
          </div>
        </form>
      </>
    </>
  );
};

export default SearchBarRide;
