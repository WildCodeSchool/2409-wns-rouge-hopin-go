import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { mutationCreateRide } from "../api/CreateRide";
import { useNavigate } from "react-router-dom";
import Button from "./Button";

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
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [departureCoords, setDepartureCoords] = useState({ lat: 0, long: 0 })
    const [selected, setSelected] = useState<number>();

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
        } else if (departureCity !== suggestions[0]) {
            departureCityError.push(
                "L'addresse n'est pas valide"
            );
        } else if (suggestions.length > 1) {
            departureCityError.push(
                "L'addresse n'est pas assez précise"
            );
        } // la valeur de l'input doit correspondre à la dernière suggestion sélectionné
        setError((prev) => ({ ...prev, departure_city: departureCityError }));
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
                        departure_city: departureCity, // properties.city
                        arrival_city: arrivalCity,
                        departure_address: "", // properties.label (moins la ville ?)
                        arrival_address: "",
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
        setShowSuggestions(false)
        setDepartureCity(address);
    };




    // console.info(data)
    console.info("Suggestion", suggestions)
    console.info("DepartureCity", departureCity)
    console.info("coordonées", departureCoords)
    console.info("Max passengers", maxPassenger)

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
                        onChange={(e) => validateDepartureCity(e.target.value)}
                        onKeyDown={() => setShowSuggestions(true)}
                        autoComplete="none"
                        maxLength={255}
                    />
                    {suggestions.length > 0 && showSuggestions && (
                        <ul className="absolute bg-white border mt-1 max-h-60 overflow-y-auto shadow-lg">
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

            {/* ArrivalCity */}

            <div className="flex flex-row justify-between">
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
                        onChange={(e) => setArrivalCity(e.target.value)}
                        autoComplete="none"
                        maxLength={255}
                    />
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
                    onClick={doSubmit}
                    variant="validation"
                    type="button"
                    label="Créer mon trajet"
                />
            </div>
        </form>
    )

}

export default CreateRide;