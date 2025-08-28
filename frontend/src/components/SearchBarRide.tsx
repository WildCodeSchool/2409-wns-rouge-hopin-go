import { useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { useOutsideClick } from "../hooks/useOutsideClick";

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
  setShowSuggestions = () => { },
  setLastModifiedField = () => { },
  handleSelect = () => { },
}: SearchBarRideProps) => {
  const [searchParams] = useSearchParams();
  const departureCityParam = searchParams.get("departure_city") || "";
  const arrivalCityParam = searchParams.get("arrival_city") || "";
  const departureAtParam = searchParams.get("departure_at") || "";
  const departureRadiusParam = searchParams.get("departure_radius") || "0";
  const arrivalRadiusParam = searchParams.get("arrival_radius") || "0";
  useEffect(() => {
    const departureCoordsParams = {
      lat: Number(searchParams.get("departure_lat")) || 0,
      long: Number(searchParams.get("departure_lng")) || 0,
    };
    const arrivalCoordsParams = {
      lat: Number(searchParams.get("arrival_lat")) || 0,
      long: Number(searchParams.get("arrival_lng")) || 0,
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

  const departureRef = useRef<HTMLInputElement>(null);
  const departureSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const departureRadiusRef = useRef<HTMLInputElement>(null);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const arrivalSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const arrivalRadiusRef = useRef<HTMLInputElement>(null);

  // hides suggestions when clicking outside
  const departureUlRef = useRef<HTMLUListElement>(null);
  const arrivalUlRef = useRef<HTMLUListElement>(null);
  useOutsideClick(departureUlRef, () => setShowSuggestions((prev) => ({ ...prev, departure: false })), showSuggestions.departure);
  useOutsideClick(arrivalUlRef, () => setShowSuggestions((prev) => ({ ...prev, arrival: false })), showSuggestions.arrival);

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

  // Allows tracking if a key is pressed
  const keyState = {
    shift: false,
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, input: "departure" | "arrival") => {
    if (e.key === "Escape") {
      if (input === "departure") {
        setShowSuggestions((prev) => ({ ...prev, departure: false }));
        departureRef.current?.blur();
      } else {
        setShowSuggestions((prev) => ({ ...prev, arrival: false }));
        arrivalRef.current?.blur();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (input === "departure") {
        departureSuggestionsRef.current[0]?.focus();
      } else {
        console.log(arrivalSuggestionsRef.current[0]);
        arrivalSuggestionsRef.current[0]?.focus();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (input === "departure") {
        if (keyState.shift) {
          departureRef.current?.blur();
        } else {
          departureRadiusRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          departureRadiusRef.current?.focus();
        } else {
          arrivalRadiusRef.current?.focus();
        }
      }
    } else if (e.key === "Shift") {
      e.preventDefault();
      keyState.shift = true;
    }
  };

  const handleLiKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, address: string, li: "departure" | "arrival") => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSelect(`${li}`, address);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (li === "departure") {
        const nextIndex = departureSuggestionsRef.current.indexOf(e.currentTarget) + 1;
        departureSuggestionsRef.current[nextIndex]?.focus();
      } else {
        const nextIndex = arrivalSuggestionsRef.current.indexOf(e.currentTarget) + 1;
        arrivalSuggestionsRef.current[nextIndex]?.focus();
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (li === "departure") {
        const prevIndex = departureSuggestionsRef.current.indexOf(e.currentTarget) - 1;
        departureSuggestionsRef.current[prevIndex]?.focus();
      } else {
        const prevIndex = arrivalSuggestionsRef.current.indexOf(e.currentTarget) - 1;
        arrivalSuggestionsRef.current[prevIndex]?.focus();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (li === "departure") {
        if (keyState.shift) {
          departureRef.current?.focus();
        } else {
          handleSelect(`${li}`, address);
          departureRadiusRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          arrivalRef.current?.focus();
        } else {
          handleSelect(`${li}`, address);
          arrivalRadiusRef.current?.focus();
        }
      }
    } else if (e.key === "Escape") {
      setShowSuggestions({ departure: false, arrival: false });
    } else if (e.key === "Shift") {
      e.preventDefault();
      keyState.shift = true;
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
              className={`${error.firstName?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Paris"
              value={departureCity}
              ref={departureRef}
              onChange={(e) => handleInputChange("departure", e.target.value)}
              onFocus={() => { setShowSuggestions(() => ({ departure: true, arrival: false })); setLastModifiedField("departure"); }}
              onKeyDown={(e) => handleInputKeyDown(e, "departure")}
              onKeyUp={() => keyState.shift = false}
            />
            {showSuggestions.departure && suggestions.departure.length > 0 && (
              <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-20"
                ref={departureUlRef}
              >
                {suggestions.departure.map((suggestion, index) => (
                  <li
                    key={index}
                    tabIndex={0}
                    ref={(el) => departureSuggestionsRef.current[index] = el!}
                    onKeyDown={(e) => handleLiKeyDown(e, suggestion, "departure")}
                    onClick={() => handleSelect("departure", suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
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
              className={`${error.departureRadius?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              value={departureRadius}
              ref={departureRadiusRef}
              onChange={(e) => setDepartureRadius(Number(e.target.value))}
              onFocus={() => setShowSuggestions(() => ({ departure: false, arrival: false }))}
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
              className={`${error.arrivalCity?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              placeholder="Lyon"
              value={arrivalCity}
              ref={arrivalRef}
              onFocus={() => { setShowSuggestions({ arrival: true, departure: false }); setLastModifiedField("arrival"); }}
              onKeyDown={(e) => handleInputKeyDown(e, "arrival")}
              onKeyUp={() => keyState.shift = false}
              onChange={(e) => handleInputChange("arrival", e.target.value)}
            />
            {showSuggestions.arrival && suggestions.arrival.length > 0 && (
              <ul className="absolute w-full bg-white border mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-20"
                ref={arrivalUlRef}
              >
                {suggestions.arrival.map((suggestion, index) => (
                  <li
                    key={index}
                    tabIndex={0}
                    ref={(el) => arrivalSuggestionsRef.current[index] = el!}
                    onKeyDown={(e) => handleLiKeyDown(e, suggestion, "arrival")}
                    onClick={() => handleSelect("arrival", suggestion)}
                    className="p-2 cursor-pointer hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
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
              className={`${error.arrivalRadius?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5`}
              value={arrivalRadius}
              ref={arrivalRadiusRef}
              onChange={(e) => setArrivalRadius(Number(e.target.value))}
              onFocus={() => setShowSuggestions((prev) => ({ ...prev, arrival: false }))}
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
              className={`${error.departureAt?.length
                ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-1.5 ${!departureAt ? "text-gray-400" : "text-black"
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
