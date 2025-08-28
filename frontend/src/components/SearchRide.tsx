import { useState, useEffect } from "react";
import {
  validateDepartureCity as validateDepartureCityUtils,
  validateDepartureAt as validateDepartureAtUtils,
  validateArrivalCity as validateArrivalCityUtils,
} from "../utils/searchRideValidators";
import { useNavigate } from "react-router-dom";
import SearchFormRide from "./SearchFormRide";
import SearchBarRide from "./SearchBarRide";

type SearchRideProps = {
  variant: "searchFormRide" | "searchBarRide";
  proposeRef?: React.RefObject<HTMLButtonElement>;
};

const SearchRide = ({ variant, proposeRef }: SearchRideProps) => {
  const navigate = useNavigate();
  // Attention, contrairement à createRide, ici c'est City et pas Address qui impacte les suggestions
  const [departureCity, setDepartureCity] = useState("");
  const [departureCoords, setDepartureCoords] = useState({ long: 0, lat: 0 });
  const [departureRadius, setDepartureRadius] = useState(10);
  const [arrivalCity, setArrivalCity] = useState("");
  const [arrivalCoords, setArrivalCoords] = useState({ long: 0, lat: 0 });
  const [arrivalRadius, setArrivalRadius] = useState(10);
  const [departureAt, setDepartureAt] = useState("");
  const [error, setError] = useState<Record<string, string[]>>({});
  const [suggestions, setSuggestions] = useState({
    departure: [],
    arrival: [],
  });
  const [showSuggestions, setShowSuggestions] = useState({
    departure: false,
    arrival: false,
  });
  const [lastModifiedField, setLastModifiedField] = useState<
    "departure" | "arrival" | null
  >(null);

  useEffect(() => {
    const fetchSuggestions = async () => {
      const query =
        lastModifiedField === "departure" ? departureCity : arrivalCity;
      if (!query) return;
      if (lastModifiedField === "departure") {
        try {
          const res = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`
          );
          const data = await res.json();

          type Feature = { properties: { label: string } };
          const labels = data.features.map((f: Feature) => f.properties.label);

          setSuggestions((prev) => ({
            ...prev,
            [lastModifiedField!]: labels,
          }));
          // setDepartureCity(data.features[0].properties.city);
          setDepartureCoords({
            long: data.features[0].geometry.coordinates[0],
            lat: data.features[0].geometry.coordinates[1],
          });
          console.log("Suggestions mises à jour ! : ", data.features);
        } catch (err) {
          console.error("Erreur de récupération des suggestions : ", err);
        }
      } else if (lastModifiedField === "arrival") {
        try {
          const res = await fetch(
            `https://api-adresse.data.gouv.fr/search/?q=${query}&limit=5`
          );
          const data = await res.json();

          type Feature = { properties: { label: string } };
          const labels = data.features.map((f: Feature) => f.properties.label);

          setSuggestions((prev) => ({
            ...prev,
            [lastModifiedField!]: labels,
          }));
          // setArrivalCity(data.features[0].properties.city);
          setArrivalCoords({
            long: data.features[0].geometry.coordinates[0],
            lat: data.features[0].geometry.coordinates[1],
          });
          console.log("Suggestions mises à jour ! : ", data.features);
        } catch (err) {
          console.error("Erreur de récupération des suggestions : ", err);
        }
      }
    };
    const timer = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timer);
  }, [departureCity, arrivalCity, lastModifiedField]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      return;
    }

    const params = new URLSearchParams();
    params.append("departure_city", departureCity);
    params.append("departure_lat", departureCoords.lat.toString());
    params.append("departure_lng", departureCoords.long.toString());
    params.append("departure_radius", departureRadius.toString());
    params.append("arrival_city", arrivalCity);
    params.append("arrival_lat", arrivalCoords.lat.toString());
    params.append("arrival_lng", arrivalCoords.long.toString());
    params.append("arrival_radius", arrivalRadius.toString());
    params.append("departure_at", departureAt);

    navigate(`/ride-results?${params.toString()}`);
  };

  const handleSelect = (field: "departure" | "arrival", value: string) => {
    if (field === "departure") {
      setDepartureCity(value);
    } else {
      setArrivalCity(value);
    }
    setShowSuggestions((prev) => ({ ...prev, [field]: false }));
  };

  const props = {
    departureCity,
    setDepartureCity,
    setDepartureCoords,
    departureRadius,
    setDepartureRadius,
    arrivalCity,
    setArrivalCity,
    arrivalRadius,
    setArrivalCoords,
    setArrivalRadius,
    departureAt,
    setDepartureAt,
    error,
    handleSubmit,
    formatErrors,
    validateCreateForm,
    suggestions,
    showSuggestions,
    setShowSuggestions,
    setLastModifiedField,
    handleSelect,
    proposeRef,
  };

  return variant === "searchFormRide" ? (
    <SearchFormRide {...props} />
  ) : (
    <SearchBarRide {...props} />
  );
};

export default SearchRide;
