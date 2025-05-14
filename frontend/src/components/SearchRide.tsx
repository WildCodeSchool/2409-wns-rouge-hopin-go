import { useState } from "react";
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
};

const SearchRide = ({ variant }: SearchRideProps) => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreateForm()) {
      return;
    }

    const params = new URLSearchParams();
    params.append("departure_city", departureCity);
    params.append("arrival_city", arrivalCity);
    params.append("departure_at", departureAt);

    navigate(`/ride-results?${params.toString()}`);
  };

  const props = {
    departureCity,
    setDepartureCity,
    arrivalCity,
    setArrivalCity,
    departureAt,
    setDepartureAt,
    error,
    handleSubmit,
    formatErrors,
  };

  return variant === "searchFormRide" ? (
    <SearchFormRide {...props} />
  ) : (
    <SearchBarRide {...props} />
  );
};

export default SearchRide;
