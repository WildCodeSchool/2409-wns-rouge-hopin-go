import { useState } from "react";
import { queryWhoAmI } from "../api/WhoAmI";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { mutationCreateRide } from "../api/CreateRide";


const Home = () => {
  const [departureCity, setDepartureCity] = useState("");
  const [arrivalCity, setArrivalCity] = useState("");
  const [departureAt, setDepartureAt] = useState("");
  const [arrivalAt, setArrivalAt] = useState("");
  const [maxPassenger, setMaxPassenger] = useState(1);
  const [error, setError] = useState<Record<string, string[]>>({});
  const navigate = useNavigate();

  const [doCreateRide, { data }] = useMutation(mutationCreateRide);


  const formatErrors = (errors: string[]) => {
    if (errors.length === 0) return "";
    if (errors.length === 1) return errors[0];
    const lastError = errors.pop();
    return `${errors.join(", ")} et ${lastError}.`;
  };



  async function doSubmit() {
    if (!validateCreateForm()) {
      return;
    }

    try {
      await doCreateRide({
        variables: {
          data: {
            departureCity,
            arrivalCity,
            departureAt,
            arrivalAt,
            maxPassenger,
          },
        },
      });
      setError({});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      console.error(e);
      setError({
        form: ["Une erreur est survenue lors de l'inscription. Réessayez."],
      });
    }
  }

  return (




    <form className="" onSubmit={(e) => {
      e.preventDefault();
      doSubmit();
    }}>
      {/* DepartureCity */}
      <div className="">
        <label
          htmlFor="departureCity"
          className=""
        >
          Ville de départ
        </label>
        <input
          type="text"
          id="departureCity"
          className=""
          placeholder="ex. Marseille"
          value={departureCity}
          onChange={(e) => setDepartureCity(e.target.value)}
          autoComplete="none"
        />
        {error.departure_city && (
          <p className="text-red-500 text-sm">{formatErrors(error.departure_city)}</p>
        )}
      </div>

      {/* ArrivalCity */}
      <div className="">
        <label
          htmlFor="arrivalCity"
          className=""
        >
          Ville d'arrivée
        </label>
        <input
          type="text"
          id="arrivalCity"
          className=""
          placeholder="ex. Lyon"
          value={arrivalCity}
          onChange={(e) => setArrivalCity(e.target.value)}
          autoComplete="none"
        />
        {error.departure_city && (
          <p className="text-red-500 text-sm">{formatErrors(error.departure_city)}</p>
        )}
      </div>

      {/* DepartureTime */}
      <div className="">
        <label
          htmlFor="departureAt"
          className=""
        >
          Horaire de départ
        </label>
        <input
          type="time"
          id="departureAt"
          className=""
          placeholder="Horaire de départ"
          value={departureAt}
          onChange={(e) => setDepartureAt(e.target.value)}
          autoComplete="none"
        />
        {error.departure_at && (
          <p className="text-red-500 text-sm">{formatErrors(error.departure_at)}</p>
        )}
      </div>

      {/* ArrivalTime */}
      <div className="">
        <label
          htmlFor="arrivalAt"
          className=""
        >
          Horaire d'arrivée
        </label>
        <input
          type="time"
          id="arrivalAt"
          className=""
          placeholder="Horaire d'arrivée"
          value={arrivalAt}
          onChange={(e) => setArrivalAt(e.target.value)}
          autoComplete="none"
        />
        {error.arrival_at && (
          <p className="text-red-500 text-sm">{formatErrors(error.arrival_at)}</p>
        )}
      </div>

      {/* MaxPassenger */}
      <div className="">
        <label
          htmlFor="maxPassenger"
          className=""
        >
          Nombre de passager maximum
        </label>
        <input
          type="number"
          id="maxPassenger"
          className=""
          placeholder="Horaire de départ"
          value={maxPassenger}
          onChange={(e) => setMaxPassenger(parseInt(e.target.value))}
          autoComplete="none"
        />
        {error.departure_time && (
          <p className="text-red-500 text-sm">{formatErrors(error.departure_time)}</p>
        )}
      </div>

      {/* Bouton */}
      <button
        onClick={doSubmit}
        type="button"
        className=""
      >
        M'inscrire
      </button>
    </form>
  )
};

export default Home;
