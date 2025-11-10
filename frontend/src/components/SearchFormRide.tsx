import { useRef } from "react";
import Button from "./Button";
import { useOutsideClick } from "../hooks/useOutsideClick";

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
  setLastModifiedField?: React.Dispatch<React.SetStateAction<"departure" | "arrival" | null>>;
  handleSelect?: (field: "departure" | "arrival", value: string) => void;
  proposeRef?: React.RefObject<HTMLButtonElement>;
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
  setShowSuggestions = () => {},
  setLastModifiedField = () => {},
  handleSelect = () => {},
  proposeRef,
}: SearchFormRideProps) => {
  const departureRef = useRef<HTMLInputElement>(null);
  const departureSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const departureRadiusRef = useRef<HTMLInputElement>(null);
  const departureTimeRef = useRef<HTMLInputElement>(null);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const arrivalSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const arrivalRadiusRef = useRef<HTMLInputElement>(null);

  // hides suggestions when clicking outside
  const departureUlRef = useRef<HTMLUListElement>(null);
  const arrivalUlRef = useRef<HTMLUListElement>(null);
  useOutsideClick(
    departureUlRef,
    () => setShowSuggestions((prev) => ({ ...prev, departure: false })),
    showSuggestions.departure
  );
  useOutsideClick(
    arrivalUlRef,
    () => setShowSuggestions((prev) => ({ ...prev, arrival: false })),
    showSuggestions.arrival
  );

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

  const handleInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    input: "departure" | "arrival"
  ) => {
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
        arrivalSuggestionsRef.current[0]?.focus();
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (input === "departure") {
        if (keyState.shift) {
          if (proposeRef) {
            proposeRef.current?.focus();
          } else {
            departureRef.current?.blur();
          }
        } else {
          departureRadiusRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          departureTimeRef.current?.focus();
        } else {
          arrivalRadiusRef.current?.focus();
        }
      }
    } else if (e.key === "Shift") {
      e.preventDefault();
      keyState.shift = true;
    }
  };

  const handleLiKeyDown = (
    e: React.KeyboardEvent<HTMLLIElement>,
    address: string,
    li: "departure" | "arrival"
  ) => {
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
    <form
      noValidate
      onSubmit={handleSubmit}
      aria-label="Formulaire de recherche de trajets"
      className="mx-auto flex h-full max-w-sm flex-col items-center justify-center"
    >
      {/* Date de départ */}
      <div className="mb-5 w-full">
        <label htmlFor="departure-at" className="mb-2 block text-sm font-medium text-white">
          Date de départ
        </label>
        <input
          type="date"
          id="departure-at"
          className={`${
            error.departureAt?.length
              ? "border-error border-2 bg-red-50"
              : "border-gray-300 bg-gray-50"
          } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
          value={departureAt}
          ref={departureTimeRef}
          onChange={(e) => setDepartureAt(e.target.value)}
          onFocus={() => setShowSuggestions((prev) => ({ ...prev, arrival: false }))}
          required
          aria-describedby={error.departureAt ? "departure-at-error" : undefined}
        />
        {error.departureAt && error.departureAt.length > 0 && (
          <p
            id="departure-at-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.departureAt)}
          </p>
        )}
      </div>

      {/* Ville de départ */}
      <div className="relative mb-5 w-full">
        <label htmlFor="departure-city" className="text-textLight mb-2 block text-sm font-medium">
          Ville de départ
        </label>
        <input
          autoComplete="off"
          type="text"
          id="departure-city"
          required
          className={`${
            error.departureCity?.length
              ? "border-error border-2 bg-red-50"
              : "border-gray-300 bg-gray-50"
          } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
          placeholder="Paris"
          value={departureCity}
          ref={departureRef}
          onChange={(e) => handleInputChange("departure", e.target.value)}
          onFocus={() => {
            setShowSuggestions(() => ({ departure: true, arrival: false }));
            setLastModifiedField("departure");
          }}
          onKeyDown={(e) => handleInputKeyDown(e, "departure")}
          onKeyUp={() => (keyState.shift = false)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions.departure}
          aria-controls="departure-city-suggestions-list"
          aria-describedby={error.departureCity ? "departure-city-error" : undefined}
        />
        {showSuggestions.departure && suggestions.departure.length > 0 && (
          <ul
            role="listbox"
            id="departure-city-suggestions-list"
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
            ref={departureUlRef}
          >
            {suggestions.departure.map((suggestion, index) => (
              <li
                role="option"
                aria-selected
                key={index}
                tabIndex={0}
                ref={(el) => (departureSuggestionsRef.current[index] = el!)}
                onKeyDown={(e) => handleLiKeyDown(e, suggestion, "departure")}
                onClick={() => handleSelect("departure", suggestion)}
                className="cursor-pointer p-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error.departureCity && error.departureCity.length > 0 && (
          <p
            id="departure-city-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.departureCity)}
          </p>
        )}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-2 text-sm text-white">
        <label className="col-span-2" htmlFor="departure-radius">
          Rayon de recherche pour la ville de départ
        </label>
        <input
          className="grid-span-1 w-[300px] cursor-pointer"
          type="range"
          id="departure-radius"
          name="departure-radius"
          min={1}
          max={100}
          value={departureRadius}
          ref={departureRadiusRef}
          onChange={(e) => setDepartureRadius(Number(e.target.value))}
          onFocus={() => setShowSuggestions((prev) => ({ ...prev, departure: false }))}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={departureRadius}
          aria-valuetext={`${departureRadius} kilomètres`}
        />
        <label className="grid-span-1 flex justify-end" htmlFor="departure-radius">
          {departureRadius} km
        </label>
      </div>

      {/* Ville d'arrivée */}
      <div className="relative mb-5 w-full">
        <label htmlFor="arrival-city" className="mb-2 block text-sm font-medium text-white">
          Ville d&apos;arrivée
        </label>
        <input
          autoComplete="off"
          type="text"
          id="arrival-city"
          required
          className={`${
            error.arrivalCity?.length
              ? "border-error border-2 bg-red-50"
              : "border-gray-300 bg-gray-50"
          } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
          placeholder="Lyon"
          value={arrivalCity}
          ref={arrivalRef}
          onFocus={() => {
            setShowSuggestions({ arrival: true, departure: false });
            setLastModifiedField("arrival");
          }}
          onKeyDown={(e) => handleInputKeyDown(e, "arrival")}
          onKeyUp={() => (keyState.shift = false)}
          onChange={(e) => handleInputChange("arrival", e.target.value)}
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={showSuggestions.arrival}
          aria-controls="arrival-city-suggestions-list"
          aria-describedby={error.arrivalCity ? "arrival-city-error" : undefined}
        />
        {showSuggestions.arrival && suggestions.arrival.length > 0 && (
          <ul
            role="listbox"
            id="arrival-city-suggestions-list"
            className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-md border bg-white shadow-lg"
            ref={arrivalUlRef}
          >
            {suggestions.arrival.map((suggestion, index) => (
              <li
                role="option"
                aria-selected
                key={index}
                tabIndex={0}
                ref={(el) => (arrivalSuggestionsRef.current[index] = el!)}
                onKeyDown={(e) => handleLiKeyDown(e, suggestion, "arrival")}
                onClick={() => handleSelect("arrival", suggestion)}
                className="cursor-pointer p-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        {error.arrivalCity && error.arrivalCity.length > 0 && (
          <p
            id="arrival-city-error"
            className="text-full mt-2 w-fit self-start rounded-lg bg-gray-50 px-2 py-1 text-sm"
          >
            {formatErrors(error.arrivalCity)}
          </p>
        )}
      </div>
      <div className="mb-6 grid grid-cols-2 gap-2 text-sm text-white">
        <label className="col-span-2" htmlFor="arrival-radius">
          Rayon de recherche pour la ville d&apos;arrivée
        </label>
        <input
          className="grid-span-1 w-[300px] cursor-pointer"
          type="range"
          id="arrival-radius"
          name="arrival-radius"
          min={1}
          max={100}
          value={arrivalRadius}
          ref={arrivalRadiusRef}
          onChange={(e) => setArrivalRadius(Number(e.target.value))}
          onFocus={() => setShowSuggestions((prev) => ({ ...prev, arrival: false }))}
          aria-valuemin={1}
          aria-valuemax={100}
          aria-valuenow={departureRadius}
          aria-valuetext={`${arrivalRadius} kilomètres`}
        />
        <label className="grid-span-1 flex justify-end" htmlFor="arrival-radius">
          {arrivalRadius} km
        </label>
      </div>

      {/* Bouton */}
      <div className="flex w-full justify-end">
        <Button variant="secondary" type="submit" label="Rechercher" />
      </div>
    </form>
  );
};

export default SearchFormRide;
