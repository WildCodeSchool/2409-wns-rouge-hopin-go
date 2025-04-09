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
    <div className={`p-4 rounded-xl shadow-md border h-3/4 ${textColor}`}>
      <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
        Détails du trajet
      </h2>
      <ul className="text-sm space-y-1">
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
