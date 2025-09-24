import Button from "./Button";
import { X } from "lucide-react";
import { VariantType } from "../types/variantTypes";
import { PassengersByRideQuery } from "../gql/graphql";
import { variantConfigMap } from "../constants/variantConfig";
import useRide from "../context/Rides/useRide";
import { formatDate, formatTime } from "../utils/formatDate";
import RegisterButton from "./RegisterButton";
import MapInteractive from "./MapInteractive";
import { formatTravelDuration } from "../utils/formatTravelDuration";

type CardRideDetailsMobileModalProps = {
  toggleModal: () => void;
  variant: VariantType;
  waitingPassengers?: PassengersByRideQuery["passengersByRide"];
  acceptedPassengers?: PassengersByRideQuery["passengersByRide"];
};

const CardRideDetailsMobileModal = ({
  toggleModal,
  variant,
}: CardRideDetailsMobileModalProps) => {
  const { textColor, bgFill } = variantConfigMap[variant as VariantType];
  const ride = useRide();

  const departureDate = new Date(ride.departure_at);
  const arrivalDate = new Date(ride.arrival_at);
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const dateStr = formatDate(departureDate);

  // ---------------------Map---------------------
  const departureCity = ride.departure_city;
  const departureLongitude = ride.departure_location.coordinates[0]; // lon
  const departureLatitude = ride.departure_location.coordinates[1]; // lat
  const arrivalCity = ride.arrival_city;
  const arrivalLongitude = ride.arrival_location.coordinates[0]; // lon
  const arrivalLatitude = ride.arrival_location.coordinates[1];
  const routePolyline5 = ride.route_polyline5;
  const distanceKm = ride.distance_km;
  const durationMin = ride.duration_min ?? 0;
  const pricePerPassenger = ride.price_per_passenger ?? 0;
  const nbPassenger = ride.available_seats;
  // const totalPriceRoute = ride.total_route_price;
  // ---------------------End Map---------------------

  const driverName =
    ride.driver?.firstName ?? `Conducteur #${ride.driver?.id ?? "?"}`;

  return (
    <div className="relative z-0 flex flex-col  p-4 h-screen w-screen md:max-w-2xl md:h-fit md:rounded-2xl bg-gray-200">
      <header className="w-full flex justify-end">
        <Button
          icon={X}
          iconColor={`${textColor}`}
          hoverIconColor="!text-white"
          iconSize={26}
          type="button"
          variant="full"
          isBgTransparent
          onClick={toggleModal}
          className="group hover:!bg-primaryHover self-end"
        />
      </header>
      <main
        className={`relative h-full flex flex-col gap-4 justify-between ${textColor}`}
      >
        <h2 className={`text-2xl font-bold ${textColor}`}>{driverName}</h2>
        <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
          Détails du trajet
        </h2>
        <div className="flex flex-col w-full h-1/2 justify-start gap-10">
          <div>
            <p className="text-sm md:text-base">{dateStr}</p>
            <p className="text-xl md:text-4xl font-semibold">
              {pricePerPassenger}
              <span className="text-sm md:text-2xl"> €</span>
            </p>

            <div className="flex flex-col gap-2">
              <p>
                {variant === "cancel" || variant === "full"
                  ? "Non disponible"
                  : `${nbPassenger} ${
                      nbPassenger > 1 ? "places restantes" : "place restante"
                    }`}
              </p>
            </div>
          </div>
          <div className="flex justify-start h-40">
            <div className={`flex flex-col w-28 justify-between ${textColor}`}>
              <p className="text-base md:text-2xl font-semibold">
                {departureTime}
              </p>
              <p className="text-sm">{formatTravelDuration(durationMin)}</p>
              <p className="text-base md:text-2xl font-semibold">
                {arrivalTime}
              </p>
            </div>

            <div
              className={`relative flex flex-col justify-between ${textColor}`}
            >
              <div
                className={`dot absolute h-3 w-3 rounded-full ${bgFill} top-2 left-0 -translate-x-7`}
              />
              <div
                className={`trait absolute h-5/6 w-[3px] rounded-sm ${bgFill} top-2 left-0 -translate-x-[23.5px]`}
              />
              <div
                className={`dot absolute h-3 w-3 rounded-full ${bgFill} bottom-2 left-0 -translate-x-7`}
              />
              <div className="flex flex-col ml-2 justify-between h-full text-left">
                <p
                  className="text-lg md:text-xl sm:font-bold"
                  title={departureCity}
                >
                  {departureCity}
                </p>
                <p className="text-sm">{distanceKm?.toFixed(1)} km</p>
                <p
                  className="text-lg md:text-xl sm:font-bold"
                  title={arrivalCity}
                >
                  {arrivalCity}
                </p>
              </div>
            </div>
          </div>
        </div>
        <RegisterButton variant={variant} rideId={ride.id} size="large" />
        <div className="w-full h-1/2">
          <MapInteractive
            mapId={`dynamic-map-${ride.id}`}
            departureLatitude={departureLatitude}
            departureLongitude={departureLongitude}
            departureCity={departureCity}
            arrivalLatitude={arrivalLatitude}
            arrivalLongitude={arrivalLongitude}
            arrivalCity={arrivalCity}
            routePolyline5={routePolyline5 ?? undefined} // ✅ évite Directions
            distanceKm={distanceKm ?? undefined} // ✅ meta backend
            durationMin={durationMin ?? undefined}
          />
        </div>
      </main>
    </div>
  );
};

export default CardRideDetailsMobileModal;
