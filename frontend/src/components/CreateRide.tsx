import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { mutationCreateRide } from "../api/CreateRide";
import { useNavigate } from "react-router-dom";

const CreateRide = () => {

    // if user is not connected form is not accessible

    const [departureCity, setDepartureCity] = useState("");
    const [arrivalCity, setArrivalCity] = useState("");
    const [departureAt, setDepartureAt] = useState("");
    const [arrivalAt, setArrivalAt] = useState("");
    const [maxPassenger, setMaxPassenger] = useState(1);
    const [error, setError] = useState<Record<string, string[]>>({});
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [departureCoords, setDepartureCoords] = useState({ lat: 0, long: 0 })

    const [doCreateRide, { data }] = useMutation(mutationCreateRide);




    const formatErrors = (errors: string[]) => {
        if (errors.length === 0) return "";
        if (errors.length === 1) return errors[0];
        const lastError = errors.pop();
        return `${errors.join(", ")} et ${lastError}.`;
    };

    const validateDepartureCity = (value: string) => {
        const departureCityError: string[] = [];
        if (!value) {
            departureCityError.push("Une ville de départ est requise");
        } else if (
            !/^\w*$/.test(value)
        ) {
            departureCityError.push(
                "Le n"
            );
        }
        // si l'input ne correspond pas à un lieu présent dans l'API -> erreur
        setError((prev) => ({ ...prev, email: departureCityError }));
        setDepartureCity(value);
    };


    const validateCreateForm = () => {
        validateDepartureCity(departureCity);

        return (
            Object.values(error).every((errArray) => errArray.length === 0) &&
            departureCity

        );
    };


    async function doSubmit() {
        if (!validateCreateForm()) {
            return;
        }

        try {
            await doCreateRide({
                variables: {
                    data: {
                        departure_city: departureCity,
                        arrival_city: arrivalCity,
                        departure_at: departureAt,
                        arrival_at: arrivalAt,
                        max_passenger: maxPassenger,
                    },
                },

            });

            setError({});
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (e: any) {
            console.error(e);
            setError({
                form: ["Une erreur est survenue lors de la création du trajet. Réessayez."],
            });

        }
        navigate("/")

    }

    useEffect(() => {
        if (departureCity.length < 3) {
            setSuggestions([]);
            return;
        }

        const fetchAddresses = async () => {
            try {
                const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${departureCity}`);
                const data = await response.json();
                console.log("FetchAddress => ", data)
                setSuggestions(data.features.map((feature: any) => feature.properties.label));
                setDepartureCoords({ lat: data.features[0].geometry.coordinates[0], long: data.features[0].geometry.coordinates[1] })

            } catch (error) {
                console.error("Erreur lors de la récupération des adresses :", error);
            }
        };

        const timer = setTimeout(fetchAddresses, 300); // Débounce la requête
        return () => clearTimeout(timer);
    }, [departureCity]);

    const handleSelect = (address: string) => {


        setDepartureCity(address);

    };

    // console.info(data)
    console.info("Suggestion", suggestions)
    console.info("coordonées", departureCoords)

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
                    onChange={(e) => validateDepartureCity(e.target.value)}
                    autoComplete="none"
                    maxLength={255}
                />
                {suggestions.length > 0 && (
                    <ul className="absolute bg-white border w-full mt-1 max-h-60 overflow-y-auto shadow-lg">
                        {suggestions.map((address, index) => (
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
                    maxLength={255}
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
                    type="datetime-local"
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
                    type="datetime-local"
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
                    max="4"
                />
                {error.departure_time && (
                    <p className="text-red-500 text-sm">{formatErrors(error.departure_time)}</p>
                )}
            </div>

            {/* Bouton */}
            <button
                onClick={doSubmit}
                type="button"
                className="button-secondary"
            >
                Créer mon trajet
            </button>
        </form>
    )

}

export default CreateRide;