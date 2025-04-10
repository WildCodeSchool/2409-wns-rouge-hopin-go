import { VariantType } from "../types/variantTypes";
import { CardData } from "./CardTemplate";
import { variantConfigMap } from "../constants/variantConfig";

type CardRideDetailsProps = {
  variant: VariantType;
  data: CardData;
};

const CardRideDetails: React.FC<CardRideDetailsProps> = ({ variant, data }) => {
  const { textColor } = variantConfigMap[variant];

  return (
    <div
      className={`p-4 relative rounded-xl shadow-md py-20 w-full border-2 border-primary ${textColor}`}
    >
      <div className="pointer-events-none absolute -left-full translate-x-[1px]  top-1/2 -translate-y-1/2 w-full flex justify-center">
        <svg
          id="overlay"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 648.14 311.1"
          className=" scale-[1] scale-x-[1] "
        >
          <g id="Calque_1-2" data-name="Calque 1">
            <path
              style={{ fill: "none", stroke: "#8e387c", strokeWidth: 2 }}
              className="overlay"
              d="M645.72,311.1c0-16.57-13.43-30-30-30H28c-14.36,0-26-11.64-26-26V56.1c0-14.36,11.64-26,26-26h588.14c16.6,0,30.05-13.49,30-30.09"
            />
          </g>
        </svg>
      </div>
      <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
        Détails du trajet
      </h2>
      <ul className="text-sm space-y-2">
        <li>
          Départ : {data.departureCity} à {data.departureTime}
        </li>
        <li>
          Arrivée : {data.arrivalCity} à {data.arrivalTime}
        </li>
        <li>Durée : {data.travelDuration}</li>
        <li>Conducteur : {data.driverName}</li>
        <li>Prix : {data.price.toFixed(2)}€</li>
        <li>Date : {data.date}</li>
        <li>Places disponibles : {data.availableSeats}</li>
      </ul>
    </div>
  );
};

export default CardRideDetails;
