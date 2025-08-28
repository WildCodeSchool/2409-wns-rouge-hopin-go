import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { mutationCreateRide } from "../api/CreateRide";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { formatErrors } from "../utils/formatErrors";
import {
  validateAddressUtils,
  validateArrivalAt,
  validateDepartureAt,
} from "../utils/createRideValidator";
import { queryWhoAmI } from "../api/WhoAmI";
import { toast } from "react-toastify";
import { queryDriverRides } from "../api/DriverRides";
import { useOutsideClick } from "../hooks/useOutsideClick";

const CreateRide = () => {
  // TO DO => if user is not connected, the form should not be accessible
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAddress, setDepartureAddress] = useState("");
  const [arrivalAddress, setArrivalAddress] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [arrivalAt, setArrivalAt] = useState("");
  const [departureCoords, setDepartureCoords] = useState({ long: 0, lat: 0 });
  const [arrivalCoords, setArrivalCoords] = useState({ long: 0, lat: 0 });
  const [maxPassenger, setMaxPassenger] = useState(1);

  const [error, setError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const [suggestions, setSuggestions] = useState({
    departure: [],
    arrival: [],
  });
  const [showDepartureSuggestions, setShowDepartureSuggestions] =
    useState<boolean>(false);
  const [showArrivalSuggestions, setShowArrivalSuggestions] =
    useState<boolean>(false);
  const [selected, setSelected] = useState({ departure: "", arrival: "" });
  const [lastModifiedCity, setLastModifiedCity] = useState<
    "departure" | "arrival" | null
  >(null);

  const [doCreateRide] = useMutation(mutationCreateRide, {
    refetchQueries: [queryDriverRides],
  });
  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const driver = whoAmIData?.whoami;

  const departureRef = useRef<HTMLInputElement>(null);
  const departureSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const arrivalRef = useRef<HTMLInputElement>(null);
  const arrivalSuggestionsRef = useRef<HTMLLIElement[]>([]);
  const departureTimeRef = useRef<HTMLInputElement>(null);

  // hides suggestions when clicking outside
  const departureUlRef = useRef<HTMLUListElement>(null);
  const arrivalUlRef = useRef<HTMLUListElement>(null);
  useOutsideClick(departureUlRef, () => setShowDepartureSuggestions(false), showDepartureSuggestions);
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
            departure: data.features.map(
              (suggestion: Suggestion) => suggestion.properties.label
            ),
          });
          console.log(
            "data.features[0].properties.city => ",
            data.features[0].properties.city
          );

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
            arrival: data.features.map(
              (suggestion: Suggestion) => suggestion.properties.label
            ),
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
    if (arrivalAt) {
      validateArrivalAt(arrivalAt, departureAt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departureAddress, arrivalAddress, selected, departureAt, arrivalAt]);

  const validateAddress = (value: string, key: "departure" | "arrival") => {
    if (key === "departure") {
      console.log("value saisie + departureAddress:", value, departureAddress);
      console.log("selected departure :", selected.departure);
    }

    const cityErrors: string[] = validateAddressUtils(
      value,
      key,
      selected[key]
    ); // tableau d'erreurs

    // Mise à jour des erreurs dans le state
    setError((prev) => ({
      ...prev,
      [key === "departure" ? "departure_address" : "arrival_address"]:
        cityErrors,
    }));
  };

  const validateCreateForm = () => {
    validateAddress(departureAddress, "departure");
    validateAddress(arrivalAddress, "arrival");
    const departure_at = validateDepartureAt(departureAt);
    const arrival_at = validateArrivalAt(arrivalAt, departureAt);
    console.log("departureAtErrors", departure_at);
    console.log("arrivalAtErrors", arrival_at);
    setError((prev) => ({
      ...prev,
      departure_at,
      arrival_at,
    }));

    return (
      Object.values(error).every((errArray) => errArray.length === 0) &&
      departureCity
    );
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
      arrivalAt,
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
              arrival_at: new Date(arrivalAt + ":00").toISOString(),
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
        form: [
          "Une erreur est survenue lors de la création du trajet. Réessayez.",
        ],
      });
    }
    navigate("/"); // ToDo : rediriger vers la page 'Mes trajets' une fois la création du trajet réussie
  }

  const handleSelect = async (address: string) => {
    console.log("handleSelect is triggered : ", address);
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
      setDepartureAddress(address);
    } else {
      setArrivalAddress(address);
    }
  };

  // Allows tracking if a key is pressed
  const keyState = {
    shift: false,
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, input: "departure" | "arrival") => {
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
          proposeRef.current?.focus();
        } else {
          arrivalRef.current?.focus();
        }
      } else {
        if (keyState.shift) {
          departureRef.current?.focus();
        } else {
          departureTimeRef.current?.focus();
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
          departureTimeRef.current?.focus();
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
      className="flex flex-col items-center h-full w-full  max-w-xl mx-auto  justify-center"
      onSubmit={(e) => {
        e.preventDefault();
        doSubmit();
      }}
    >
      <div className="flex w-full flex-col  md:flex-row justify-center gap-8 mb-4">
        <div className="flex flex-col md:w-3/4 justify-between  gap-8 mb-4">
          {/* DepartureCity */}
          <div className="flex-col w-full">
            <label
              htmlFor="departureAddress"
              className="block mb-2 text-sm font-medium text-textLight"
            >
              Adresse de départ
            </label>
            <input
              type="text"
              id="departureAddress"
              className={`${error.departure_city?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
              placeholder="ex. Marseille"
              value={departureAddress}
              onChange={(e) => handleChange(e.target.value, "departure")}
              onKeyDown={() => setShowDepartureSuggestions(true)}
              autoComplete="none"
              maxLength={255}
            />
            {suggestions.departure.length > 0 && showDepartureSuggestions && (
              <ul className="absolute bg-white border mt-1 max-h-60 w-fit overflow-auto shadow-lg no-scrollbar"
                ref={departureUlRef}
              >
                {suggestions.departure.map((address, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(address)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
            {error.departure_address && (
              <p className="text-red-500 text-sm">
                {formatErrors(error.departure_address)}
              </p>
            )}
          </div>
          {/* ArrivalCity */}
          <div className="flex-col w-full">
            <label
              htmlFor="arrivalAddress"
              className="block mb-2 text-sm font-medium text-textLight"
            >
              Adresse d'arrivée
            </label>
            <input
              type="text"
              id="arrivalAddress"
              className={`${error.arrival_city?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
              placeholder="ex. Lyon"
              value={arrivalAddress}
              onChange={(e) => handleChange(e.target.value, "arrival")}
              onKeyDown={() => setShowArrivalSuggestions(true)}
              autoComplete="none"
              maxLength={255}
            />
            {suggestions.arrival.length > 0 && showArrivalSuggestions && (
              <ul className="absolute bg-white border mt-1 max-h-60 overflow-auto no-scrollbar"
                ref={arrivalUlRef}
              >
                {suggestions.arrival.map((address, index) => (
                  <li
                    key={index}
                    onClick={() => handleSelect(address)}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                  >
                    {address}
                  </li>
                ))}
              </ul>
            )}
            {error.arrival_address && (
              <p className="text-red-500 text-sm">
                {formatErrors(error.arrival_address)}
              </p>
            )}
          </div>
        </div>

        <div className="flex md:flex-col flex-wrap sm:flex-nowrap  md:w-1/4 w-full gap-4 md:gap-0 justify-between mb-4">
          {/* DepartureTime */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="departureAt"
              className="block mb-2 text-sm font-medium text-textLight"
            >
              Horaire de départ
            </label>
            <input
              type="datetime-local"
              id="departureAt"
              className={`${error.departure_at?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
              placeholder="Horaire de départ"
              value={departureAt}
              onChange={(e) => setDepartureAt(e.target.value)}
              autoComplete="none"
            />
            {error.departure_at && (
              <p className="text-red-500 text-sm">
                {formatErrors(error.departure_at)}
              </p>
            )}
          </div>

          {/* ArrivalTime */}
          <div className="flex flex-col w-full">
            <label
              htmlFor="arrivalAt"
              className="block mb-2 text-sm font-medium text-textLight"
            >
              Horaire d'arrivée
            </label>
            <input
              type="datetime-local"
              id="arrivalAt"
              className={`${error.arrival_at?.length
                  ? "border-error border-2 bg-red-50 focus:ring-0 placeholder:text-primary[50%]"
                  : "border-gray-300 bg-gray-50"
                } shadow-sm border textDark text-sm rounded-lg focus:outline-none block w-full p-2.5`}
              placeholder="Horaire d'arrivée"
              value={arrivalAt}
              onChange={(e) => setArrivalAt(e.target.value)}
              autoComplete="none"
            />
            {error.arrival_at && (
              <p className="text-red-500 text-sm">
                {formatErrors(error.arrival_at)}
              </p>
            )}
          </div>
        </div>
      </div>
      {/* MaxPassenger */}
      <div className=" w-full">
        <label
          htmlFor="maxPassenger"
          className="flex mb-2 text-sm font-medium text-textLight"
        >
          Nombre de passager maximum
        </label>
        <div className="flex justify-between">
          <Button
            onClick={() => setMaxPassenger(1)}
            variant={`${maxPassenger === 1 ? "validation" : "pending"}`}
            type="button"
            label="1"
          />
          <Button
            onClick={() => setMaxPassenger(2)}
            variant={`${maxPassenger === 2 ? "validation" : "pending"}`}
            type="button"
            label="2"
          />
          <Button
            onClick={() => setMaxPassenger(3)}
            variant={`${maxPassenger === 3 ? "validation" : "pending"}`}
            type="button"
            label="3"
          />
          <Button
            onClick={() => setMaxPassenger(4)}
            variant={`${maxPassenger === 4 ? "validation" : "pending"}`}
            type="button"
            label="4"
          />
        </div>
      </div>

      <div className="flex w-full justify-end mt-6">
        <Button
          onClick={doSubmit}
          variant="validation"
          type="button"
          label="Créer mon trajet"
          isHoverBgColor
          isDisabled={
            showDepartureSuggestions || showArrivalSuggestions ? true : false
          }
        />
      </div>
    </form>
  );
};

export default CreateRide;
