import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { mutationCreateRide } from "../api/CreateRide";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { verify } from "crypto";

const CreateRide = () => {

    // if user is not connected form is not accessible

    const [departureCity, setDepartureCity] = useState("");
    const [arrivalCity, setArrivalCity] = useState("");
    const [departureAt, setDepartureAt] = useState("");
    const [arrivalAt, setArrivalAt] = useState("");
    const [maxPassenger, setMaxPassenger] = useState(1);
    const [error, setError] = useState<Record<string, string[]>>({});
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState({ departure: [], arrival: [] });
    const [showDepartureSuggestions, setShowDepartureSuggestions] = useState<boolean>(false);
    const [showArrivalSuggestions, setShowArrivalSuggestions] = useState<boolean>(false);
    const [departureCoords, setDepartureCoords] = useState({ lat: 0, long: 0 })
    const [arrivalCoords, setArrivalCoords] = useState({ lat: 0, long: 0 })
    const [selected, setSelected] = useState({ departure: "", arrival: "" });
    const [lastModifiedCity, setLastModifiedCity] = useState<"departure" | "arrival" | null>(null);


    const [doCreateRide, { data }] = useMutation(mutationCreateRide);


    useEffect(() => {
        const fetchCityAddress = async () => {
            if (lastModifiedCity === "departure") {
                try {
                    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${departureCity}`);
                    const data = await response.json();
                    console.log("FetchAddress => ", data)
                    setSuggestions({ ...suggestions, departure: data.features.map((feature: any) => feature.properties.label) });
                    setDepartureCoords({ lat: data.features[0].geometry.coordinates[0], long: data.features[0].geometry.coordinates[1] })

                } catch (error) {
                    console.error("Erreur lors de la récupération des adresses :", error);
                }
            } else if (lastModifiedCity === "arrival") {
                try {
                    const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${arrivalCity}`);
                    const data = await response.json();
                    console.log("FetchAddress => ", data)
                    setSuggestions({ ...suggestions, arrival: data.features.map((feature: any) => feature.properties.label) });
                    setArrivalCoords({ lat: data.features[0].geometry.coordinates[0], long: data.features[0].geometry.coordinates[1] })

                } catch (error) {
                    console.error("Erreur lors de la récupération des adresses :", error);
                }
            }
        };

        const timer = setTimeout(fetchCityAddress, 300); // Débounce la requête
        return () => clearTimeout(timer);
    }, [departureCity, arrivalCity]);



    useEffect(() => {
        validateCity(departureCity, "departure");
        validateCity(arrivalCity, "arrival");
    }, [departureCity, arrivalCity, selected]);

    const formatErrors = (errors: string[]) => {
        if (errors.length === 0) return "";
        if (errors.length === 1) return errors[0];
        const lastError = errors.pop();
        return `${errors.join(", ")} et ${lastError}.`;
    };

    const validateCity = (value: string, key: "departure" | "arrival") => {
        console.log("value saisie :", `"${value}"`);
        console.log("selected departure :", selected.departure);
        console.log("selected arrival :", selected.arrival);
        console.log("Égalité exacte sur departure ?", value === selected.departure);
        console.log("Égalité exacte sur arrival ?", value === selected.arrival);

        const cityError: string[] = [];

        if (!value) {
            cityError.push(
                key === "departure"
                    ? "Une ville de départ est requise"
                    : "Une ville d'arrivée est requise"
            );
        } else if (
            (key === "departure" && value !== selected.departure) ||
            (key === "arrival" && value !== selected.arrival)
        ) {
            cityError.push("L'adresse n'est pas valide");
        } else if (suggestions.length > 1) {
            cityError.push("L'adresse n'est pas assez précise");
        }

        // Mise à jour des erreurs dans le state
        setError((prev) => ({
            ...prev,
            [key === "departure" ? "departure_city" : "arrival_city"]: cityError,
        }));

        // Mise à jour du bon state en fonction de la clé
        if (key === "departure") {
            console.log("departureCity before setter:", departureCity);
            setDepartureCity(value);
            console.log("departureCity after setter:", departureCity);
        } else {
            console.log("arrivalCity before setter:", arrivalCity);
            setArrivalCity(value);
            console.log("arrivalCity after setter:", arrivalCity);
        }
    };




    const validateCreateForm = () => {
        validateCity(departureCity, "departure")
        validateCity(arrivalCity, "arrival")

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
                        departure_city: departureCity, // properties.city
                        arrival_city: arrivalCity,
                        departure_address: "", // properties.label (moins la ville ?)
                        arrival_address: "",
                        departure_at: departureAt,
                        arrival_at: arrivalAt,
                        max_passenger: maxPassenger,
                        departure_lat: departureCoords.lat,
                        departure_lng: departureCoords.long,
                        arrival_lat: arrivalCoords.lat,
                        arrival_lng: arrivalCoords.long,

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



    const handleSelect = async (address: string) => {
        console.log("handleSelect is triggered : ", address)
        if (lastModifiedCity === "departure") {
            setShowDepartureSuggestions(false)
            setSelected({ ...selected, departure: address })
            setDepartureCity(address)
            validateCity(address, "departure")
        } else {
            setShowArrivalSuggestions(false)
            setSelected({ ...selected, arrival: address })
            setArrivalCity(address)
            validateCity(address, "arrival")
        }
    };






    return (
        <form className="" onSubmit={(e) => {
            e.preventDefault();
            doSubmit();
        }}>
            {/* DepartureCity */}
            <div className="flex flex-row justify-between">
                <div className="flex-col w-7/12">
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
                        value={departureCity}
                        onChange={(e) => {
                            setDepartureCity(e.target.value);
                            setLastModifiedCity("departure")
                        }
                        }
                        onKeyDown={() => setShowDepartureSuggestions(true)}
                        autoComplete="none"
                        maxLength={255}
                    />
                    {suggestions.departure.length > 0 && showDepartureSuggestions && (
                        <ul className="absolute bg-white border mt-1 max-h-60 overflow-y-auto shadow-lg">
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
                    {error.departure_city && (
                        <p className="text-red-500 text-sm">{formatErrors(error.departure_city)}</p>
                    )}
                </div>

                {/* DepartureTime */}
                <div className="flex-col text-center">
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
                        <p className="text-red-500 text-sm">{formatErrors(error.departure_at)}</p>
                    )}
                </div>
            </div>

            <div className="flex flex-row justify-between">
                {/* ArrivalCity */}
                <div className="flex-col w-7/12">
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
                        value={arrivalCity}
                        onChange={(e) => {
                            validateCity(e.target.value, "arrival"); setLastModifiedCity("arrival");
                        }}
                        onKeyDown={() => setShowArrivalSuggestions(true)}
                        autoComplete="none"
                        maxLength={255}
                    />
                    {suggestions.arrival.length > 0 && showArrivalSuggestions && (
                        <ul className="absolute bg-white border mt-1 max-h-60 overflow-y-auto shadow-lg">
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
                    {error.arrival_city && (
                        <p className="text-red-500 text-sm">{formatErrors(error.departure_city)}</p>
                    )}
                </div>

                {/* ArrivalTime */}
                <div className="flex-col text-center" >

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
                        <p className="text-red-500 text-sm">{formatErrors(error.arrival_at)}</p>
                    )}
                </div>
            </div>

            {/* MaxPassenger */}
            <div className="">
                <label
                    htmlFor="maxPassenger"
                    className="block mb-2 text-sm font-medium text-textLight"
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

            {/* Bouton */}
            <div className="flex w-full justify-end mt-6">
                <Button
                    variant="validation"
                    type="button"
                    label="Créer mon trajet"
                />
            </div>
        </form>
    )

}

export default CreateRide;