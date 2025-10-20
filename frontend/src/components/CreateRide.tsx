import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useRef, useState } from "react";
import { mutationCreateRide } from "../api/CreateRide";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { formatErrors } from "../utils/formatErrors";
import { validateAddressUtils, validateDepartureAt } from "../utils/createRideValidator";
import { queryWhoAmI } from "../api/WhoAmI";
import { toast } from "react-toastify";
import { queryDriverRides } from "../api/DriverRides";
import { useOutsideClick } from "../hooks/useOutsideClick";
import { LoaderCircle } from "lucide-react";

const CreateRide = () => {
  // TO DO => if user is not connected, the form should not be accessible
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  const [arrivalAddress, setArrivalAddress] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [departureCoords, setDepartureCoords] = useState({ long: 0, lat: 0 });
  const [arrivalCoords, setArrivalCoords] = useState({ long: 0, lat: 0 });
  const [maxPassenger, setMaxPassenger] = useState(1);

  const [error, setError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState({
    departure: [],
    arrival: [],
  });
  const [showDepartureSuggestions, setShowDepartureSuggestions] = useState<boolean>(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] = useState<boolean>(false);
  const [selected, setSelected] = useState({ departure: "", arrival: "" });
  const [lastModifiedCity, setLastModifiedCity] = useState<"departure" | "arrival" | null>(null);
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const driver = whoAmIData?.whoami;

  const [doCreateRide, { loading: isCreatingRideLoading }] = useMutation(mutationCreateRide, {
    refetchQueries: [queryDriverRides, queryWhoAmI],
  });

  const departureTimeRef = useRef<HTMLInputElement>(null);
  const departureRef = useRef<HTMLInputElement>(null);
  const departureSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const arrivalSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const passenger1Ref = useRef<HTMLButtonElement>(null);

  // hides suggestions when clicking outside
  const departureUlRef = useRef<HTMLUListElement>(null);
  const arrivalUlRef = useRef<HTMLUListElement>(null);
  useOutsideClick(
    departureUlRef,
    () => setShowDepartureSuggestions(false),
    showDepartureSuggestions
  );
  useOutsideClick(arrivalUlRef, () => setShowArrivalSuggestions(false), showArrivalSuggestions);

  type Suggestion = {
    properties: {
      label: string;
      city: string;
    };
    geometry: {
      coordinates: [number, number];
    };
  };

  useEffect(() => {
    const fetchCityAddress = async () => {
      if (lastModifiedCity === "departure") {
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${departureAddress}`
          );
          const data = await response.json();
          console.log("FetchAddress => ", data);
          setSuggestions({
            ...suggestions,
            departure: data.features.map((suggestion: Suggestion) => suggestion.properties.label),
          });
          console.log("data.features[0].properties.city => ", data.features[0].properties.city);

          setDepartureCity(data.features[0].properties.city);
          setDepartureCoords({
            long: data.features[0].geometry.coordinates[0],
            lat: data.features[0].geometry.coordinates[1],
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des adresses :", error);
        }
      } else if (lastModifiedCity === "arrival") {
        try {
          const response = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${arrivalAddress}`
          );
          const data = await response.json();
          console.log("FetchAddress => ", data);
          setSuggestions({
            ...suggestions,
            arrival: data.features.map((suggestion: Suggestion) => suggestion.properties.label),
          });
          setArrivalCity(data.features[0].properties.city);
          setArrivalCoords({
            long: data.features[0].geometry.coordinates[0],
            lat: data.features[0].geometry.coordinates[1],
          });
        } catch (error) {
          console.error("Erreur lors de la récupération des adresses :", error);
        }
      }
    };

    const timer = setTimeout(fetchCityAddress, 300); // Débounce la requête
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureAddress, arrivalAddress]);

  useEffect(() => {
    // les conditions évitent d'afficher les erreurs au montage du composant
    if (departureAddress) {
      validateAddress(departureAddress, "departure");
    }
    if (arrivalAddress) {
      validateAddress(arrivalAddress, "arrival");
    }
    if (departureAt) {
      validateDepartureAt(departureAt);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureAddress, arrivalAddress, selected, departureAt]);

  const validateAddress = (value: string, key: "departure" | "arrival") => {
    if (key === "departure") {
      console.log("value saisie + departureAddress:", value, departureAddress);
      console.log("selected departure :", selected.departure);
    }

    const cityErrors: string[] = validateAddressUtils(value, key, selected[key]); // tableau d'erreurs

    // Mise à jour des erreurs dans le state
    setError((prev) => ({
      ...prev,
      [key === "departure" ? "departure_address" : "arrival_address"]: cityErrors,
    }));
  };

  const validateCreateForm = () => {
    validateAddress(departureAddress, "departure");
    validateAddress(arrivalAddress, "arrival");
    const departure_at = validateDepartureAt(departureAt);
    console.log("departureAtErrors", departure_at);
    setError((prev) => ({
      ...prev,
      departure_at,
    }));

    return Object.values(error).every((errArray) => errArray.length === 0) && departureCity;
  };

  async function doSubmit() {
    if (!validateCreateForm()) {
      return;
    }
    console.log(
      "doSubmit => ",
      departureCity,
      arrivalCity,
      departureAt,
      maxPassenger,
      departureCoords.lat,
      arrivalCoords.lat,
      departureCoords.long,
      arrivalCoords.long
    );
    try {
      if (driver)
        await doCreateRide({
          variables: {
            data: {
              departure_city: departureCity,
              arrival_city: arrivalCity,
              departure_address: departureAddress,
              arrival_address: arrivalAddress,
              departure_at: new Date(departureAt + ":00").toISOString(),
              max_passenger: maxPassenger,
              departure_lng: departureCoords.long,
              departure_lat: departureCoords.lat,
              arrival_lng: arrivalCoords.long,
              arrival_lat: arrivalCoords.lat,
              driver: { id: driver.id },
            },
          },
        });
      toast.success("Trajet créé avec succès !");
      setError({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      toast.error("Une erreur est survenue lors de l'inscription.");
      setError({
        form: ["Une erreur est survenue lors de la création du trajet. Réessayez."],
      });
    }
    navigate("/"); // ToDo : rediriger vers la page 'Mes trajets' une fois la création du trajet réussie
  }

  const handleSelect = async (address: string) => {
    if (lastModifiedCity === "departure") {
      setShowDepartureSuggestions(false);
      setSelected({ ...selected, departure: address });
      setDepartureAddress(address);
    } else {
      setShowArrivalSuggestions(false);
      setSelected({ ...selected, arrival: address });
      setArrivalAddress(address);
    }
  };

  const handleChange = (address: string, key: "departure" | "arrival") => {
    setLastModifiedCity(key);
    if (key === "departure") {
      setShowDepartureSuggestions(true);
      setDepartureAddress(address);
    } else {
      setShowArrivalSuggestions(true);
      setArrivalAddress(address);
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
        setShowDepartureSuggestions(false);
        departureRef.current?.blur();
      } else {
        setShowArrivalSuggestions(false);
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
          departureTimeRef.current?.focus();
        } else {
          arrivalRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          departureRef.current?.focus();
        } else {
          passenger1Ref.current?.focus();
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
      handleSelect(address);
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
      handleSelect(address);
      if (li === "departure") {
        if (keyState.shift) {
          departureRef.current?.focus();
        } else {
          arrivalRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          arrivalRef.current?.focus();
        } else {
          passenger1Ref.current?.focus();
        }
      }
    } else if (e.key === "Escape") {
      if (li === "departure") {
        setShowDepartureSuggestions(false);
      } else {
        setShowArrivalSuggestions(false);
      }
    } else if (e.key === "Shift") {
      e.preventDefault();
      keyState.shift = true;
    }
  };

  return (
    <form
      className="flex flex-col items-center h-full w-full lg:p-20 mx-auto  justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        doSubmit();
      }}
    >
      <div className="mb-4 flex w-full flex-col justify-center gap-8">
        {/* DepartureTime */}
        <div className="flex w-full flex-col">
          <label htmlFor="departureAt" className="text-textLight mb-2 block text-sm font-medium">
            Date et horaire de départ
          </label>
          <input
            type="datetime-local"
            id="departureAt"
            className={`${
              error.departure_at?.length
                ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                : "border-gray-300 bg-gray-50"
            } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
            placeholder="Date et horaire de départ"
            value={departureAt}
            ref={departureTimeRef}
            onChange={(e) => setDepartureAt(e.target.value)}
            autoComplete="none"
            required
            aria-describedby={error.departure_at ? "departure-at-error" : undefined}
          />
          {error.departure_at && error.departure_at.length > 0 && (
            <p id="departure-at-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
              {formatErrors(error.departure_at)}
            </p>
          )}
        </div>
        <div className="mb-4 flex w-full flex-col justify-between gap-8">
          {/* DepartureCity */}
          <div className="w-full flex-col">
            <label
              htmlFor="departureAddress"
              className="text-textLight mb-2 block text-sm font-medium"
            >
              Adresse de départ
            </label>
            <input
              type="text"
              id="departureAddress"
              className={`${
                error.departure_city?.length
                  ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                  : "border-gray-300 bg-gray-50"
              } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
              placeholder="ex. Marseille"
              value={departureAddress}
              ref={departureRef}
              onChange={(e) => handleChange(e.target.value, "departure")}
              onFocus={() => {
                setShowArrivalSuggestions(false);
                setLastModifiedCity("departure");
                setShowDepartureSuggestions(true);
              }}
              onKeyDown={(e) => handleInputKeyDown(e, "departure")}
              onKeyUp={() => (keyState.shift = false)}
              autoComplete="off"
              maxLength={255}
              required
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showDepartureSuggestions}
              aria-controls="departure-city-suggestions-list"
              aria-describedby={error.departure_address ? "departure-address-error" : undefined}
            />
            {suggestions.departure.length > 0 && showDepartureSuggestions && (
              <ul
                id="departure-city-suggestions-list"
                role="listbox"
                className="no-scrollbar absolute mt-1 max-h-60 w-fit overflow-auto border bg-white shadow-lg"
                ref={departureUlRef}
              >
                {suggestions.departure.map((address, index) => (
                  <li
                    role="option"
                    aria-selected
                    key={index}
                    tabIndex={0}
                    ref={(el) => (departureSuggestionsRef.current[index] = el!)}
                    onClick={() => handleSelect(address)}
                    onKeyDown={(e) => handleLiKeyDown(e, address, "departure")}
                    className="cursor-pointer p-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
            {error.departure_address && error.departure_address.length > 0 && (
              <p id="departure-address-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                {formatErrors(error.departure_address)}
              </p>
            )}
          </div>
          {/* ArrivalCity */}
          <div className="w-full flex-col">
            <label
              htmlFor="arrivalAddress"
              className="text-textLight mb-2 block text-sm font-medium"
            >
              Adresse d&apos;arrivée
            </label>
            <input
              type="text"
              id="arrivalAddress"
              className={`${
                error.arrival_city?.length
                  ? "border-error placeholder:text-primary[50%] border-2 bg-red-50 focus:ring-0"
                  : "border-gray-300 bg-gray-50"
              } textDark block w-full rounded-lg border p-2.5 text-sm shadow-sm focus:outline-none`}
              placeholder="ex. Lyon"
              value={arrivalAddress}
              ref={arrivalRef}
              onChange={(e) => handleChange(e.target.value, "arrival")}
              onFocus={() => {
                setShowDepartureSuggestions(false);
                setLastModifiedCity("arrival");
                setShowArrivalSuggestions(true);
              }}
              onKeyDown={(e) => handleInputKeyDown(e, "arrival")}
              onKeyUp={() => (keyState.shift = false)}
              autoComplete="off"
              maxLength={255}
              required
              role="combobox"
              aria-autocomplete="list"
              aria-expanded={showArrivalSuggestions}
              aria-controls="arrival-city-suggestions-list"
              aria-describedby={error.arrival_address ? "arrival-address-error" : undefined}
            />
            {suggestions.arrival.length > 0 && showArrivalSuggestions && (
              <ul
                id="arrival-city-suggestions-list"
                role="listbox"
                className="no-scrollbar absolute mt-1 max-h-60 overflow-auto border bg-white"
                ref={arrivalUlRef}
              >
                {suggestions.arrival.map((address, index) => (
                  <li
                    role="option"
                    aria-selected
                    key={index}
                    tabIndex={0}
                    ref={(el) => (arrivalSuggestionsRef.current[index] = el!)}
                    onKeyDown={(e) => handleLiKeyDown(e, address, "arrival")}
                    onClick={() => handleSelect(address)}
                    className="cursor-pointer p-2 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
            {error.arrival_address && error.arrival_address.length > 0 && (
              <p id="arrival-address-error" className="text-full self-start text-sm bg-gray-50 px-2 py-1 rounded-lg w-fit mt-2">
                {formatErrors(error.arrival_address)}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* MaxPassenger */}
      <div className="w-full">
        <label
          htmlFor="maxPassenger"
          className="text-textLight mb-2 flex text-sm font-medium"
          id="maxPassenger"
        >
          Nombre de passager maximum
        </label>
        <div role="radiogroup" className="flex justify-between" aria-labelledby="maxPassenger">
          <Button
            onClick={() => setMaxPassenger(1)}
            onFocus={() => setShowArrivalSuggestions(false)}
            variant={`${maxPassenger === 1 ? "validation" : "pending"}`}
            ref={passenger1Ref}
            type="button"
            label="1"
            role="radio"
            aria-checked={maxPassenger === 1}
          />
          <Button
            onClick={() => setMaxPassenger(2)}
            variant={`${maxPassenger === 2 ? "validation" : "pending"}`}
            type="button"
            label="2"
            role="radio"
            aria-checked={maxPassenger === 2}
          />
          <Button
            onClick={() => setMaxPassenger(3)}
            variant={`${maxPassenger === 3 ? "validation" : "pending"}`}
            type="button"
            label="3"
            role="radio"
            aria-checked={maxPassenger === 3}
          />
          <Button
            onClick={() => setMaxPassenger(4)}
            variant={`${maxPassenger === 4 ? "validation" : "pending"}`}
            type="button"
            label="4"
            role="radio"
            aria-checked={maxPassenger === 4}
          />
        </div>
      </div>

      <div className="mt-6 flex w-full justify-end">
        <Button
          onClick={doSubmit}
          variant={isCreatingRideLoading ? "pending" : "secondary"}
          type="button"
          label={isCreatingRideLoading ? "Création..." : "Créer mon trajet"}
          isHoverBgColor
          icon={isCreatingRideLoading ? LoaderCircle : undefined}
          iconRotateAnimation
          className={isCreatingRideLoading ? "disabled:cursor-not-allowed" : ""}
          isDisabled={
            (showDepartureSuggestions || showArrivalSuggestions ? true : false) ||
            isCreatingRideLoading
          }
        />
      </div>
    </form>
  );
};

export default CreateRide;
