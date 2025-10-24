import { VariantType } from "../types/variantTypes";
import { variantConfigMap } from "../constants/variantConfig";
import useBreakpoints from "../utils/useWindowSize";
import { formatDate, formatTime } from "../utils/formatDate";
import { SearchRidesQuery } from "../gql/graphql";
import SearchRide from "./SearchRide";
import Button from "./Button";
import { Search } from "lucide-react";
import RegisterButton from "./RegisterButton";
import { useState } from "react";
import { formatTravelDuration } from "../utils/formatTravelDuration";
import { queryWhoAmI } from "../api/WhoAmI";
import { useQuery } from "@apollo/client";
import { useModal } from "../hooks/useModal";
import DynamicMapModal from "./DynamicMapModal";
import Modal from "./Modal";
import MapStatic from "./MapStatic";

type SearchRide = SearchRidesQuery["searchRide"][number];

type CardRideDetailsProps = {
  variant: VariantType;
  data: SearchRide;
};

const CardRideDetails: React.FC<CardRideDetailsProps> = ({ variant, data }) => {
  const { textColor, bgFill } = variantConfigMap[variant];
  const { isMd, isLg, isXl } = useBreakpoints();
  const { isOpen, isVisible, toggleModal, closeModal } = useModal();

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  const departureDate = new Date(data.departure_at);
  const arrivalDate = new Date(data.arrival_at);
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const dateStr = formatDate(departureDate);

  // ---------------------Map---------------------

  const departureCity = data.departure_city;
  const departureLongitude = data.departure_location.coordinates[0]; // lon
  const departureLatitude = data.departure_location.coordinates[1]; // lat
  const arrivalCity = data.arrival_city;
  const arrivalLongitude = data.arrival_location.coordinates[0]; // lon
  const arrivalLatitude = data.arrival_location.coordinates[1];
  const routePolyline5 = data.route_polyline5;
  const distanceKm = data.distance_km ?? 0;
  const durationMin = data.duration_min ?? 0;
  const pricePerPassenger = data.price_per_passenger ?? 0;
  const availableSeats = data.available_seats ?? 0;
  // ---------------------End Map---------------------

  const [travelDuration, setTravelDuration] = useState<string>(formatTravelDuration(durationMin));
  const [travelDistance, setTravelDistance] = useState<string>(`${distanceKm} km`);

  const driverName = data.driver?.firstName ?? `Conducteur #${data.driver?.id ?? "?"}`;

  return (
    <div className="relative z-0 flex w-full justify-center">
      <div className="absolute top-[88px] hidden w-full max-w-[648px] md:flex">
        <div className="bg-primary w-[85%] rounded-t-3xl px-6 pb-6 pt-2 shadow-md">
          <SearchRide variant="searchBarRide" />
        </div>
        <div className="mb-4 flex w-[15%] items-center justify-center">
          <div className="flex w-full justify-center">
            <Button
              variant="primary"
              className="my-2 -ml-2 !rounded-full shadow-lg sm:-ml-6"
              type="submit"
              icon={Search}
              iconSize={isXl ? 30 : isLg ? 28 : isMd ? 26 : 24}
              form="search-ride-form"
            />
          </div>
        </div>
      </div>
      <div
        className={`shadow-custom border-primary relative z-10 mb-40 mr-8 mt-40 hidden h-fit space-y-5 rounded-3xl border-4 p-8 md:block md:w-full ${textColor} bg-gray-100`}
      >
        
        <h2 className={`text-2xl font-bold ${textColor}`}>{driverName}</h2>
        <h2 className={`mb-2 text-xl font-bold ${textColor}`}>Détails du trajet</h2>
        <div className="flex w-full justify-start gap-10">
          <div>
            <p className="text-sm md:text-base">{dateStr}</p>
            <p className="text-xl font-semibold md:text-4xl">
              {pricePerPassenger}
              <span className="text-sm md:text-2xl"> €</span>
            </p>

            <div className="flex flex-col gap-2">
              <p>
                {variant === "cancel" || variant === "full"
                  ? "Non disponible"
                  : `${availableSeats} ${
                      availableSeats > 1 ? "places restantes" : "place restante"
                    }`}
              </p>
            </div>
          </div>
          <div className="flex h-40 justify-start">
            <div className={`flex w-28 flex-col justify-between ${textColor}`}>
              <p className="text-base font-semibold md:text-2xl">{departureTime}</p>
              <p className="text-sm">{travelDuration}</p>
              <p className="text-base font-semibold md:text-2xl">{arrivalTime}</p>
            </div>

            <div className={`relative ml-4 flex flex-col justify-between ${textColor}`}>
              <div
                className={`dot absolute h-3 w-3 rounded-full ${bgFill} left-0 top-2 -translate-x-7`}
              />
              <div
                className={`trait absolute h-5/6 w-[3px] rounded-sm ${bgFill} left-0 top-2 -translate-x-[23.5px]`}
              />
              <div
                className={`dot absolute h-3 w-3 rounded-full ${bgFill} bottom-2 left-0 -translate-x-7`}
              />
            </div>
            <div className="ml-2 flex h-full flex-col justify-between text-left md:w-24 lg:w-48">
              <p className="truncate text-lg sm:font-bold md:text-xl" title={departureCity}>
                {departureCity}
              </p>
              <p className="text-sm">{travelDistance}</p>
              <p className="truncate text-lg sm:font-bold md:text-xl" title={arrivalCity}>
                {arrivalCity}
              </p>
            </div>
          </div>
        </div>
        {me?.id === data.driver.id ? (
          <div>Votre trajet</div>
        ) : (
          <RegisterButton variant={variant} rideId={data.id} size="large" />
        )}

        <button
          onClick={() => toggleModal("DynamicMapModal")}
          className="w-full"
          title="Cliquer pour voir la carte"
        >
          <MapStatic
            mapId={`map-${data.id}`}
            departureLatitude={departureLatitude}
            departureLongitude={departureLongitude}
            departureCity={departureCity}
            arrivalLatitude={arrivalLatitude}
            arrivalLongitude={arrivalLongitude}
            arrivalCity={arrivalCity}
            routePolyline5={routePolyline5} // ✅ évite Directions
            distanceKm={distanceKm} // ✅ meta backend
            durationMin={durationMin}
            fitPaddingPct={0.24}
            onRouteData={({ distanceKm, durationMin }) => {
              setTravelDuration(formatTravelDuration(durationMin ?? 0));
              setTravelDistance(`${(distanceKm ?? 0).toFixed(1)} km`);
            }}
          />
        </button>
        <Modal
          id="DynamicMapModal"
          isOpen={isOpen("DynamicMapModal")}
          isVisible={isVisible("DynamicMapModal")}
          onClose={() => closeModal("DynamicMapModal")}
        >
          <DynamicMapModal
            toggleModal={() => closeModal("DynamicMapModal")}
            dataId={data.id}
            departureCity={departureCity}
            departureLongitude={departureLongitude}
            departureLatitude={departureLatitude}
            arrivalCity={arrivalCity}
            arrivalLongitude={arrivalLongitude}
            arrivalLatitude={arrivalLatitude}
            routePolyline5={routePolyline5} // ✅ évite Directions
            distanceKm={distanceKm} // ✅ meta backend
            durationMin={durationMin}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CardRideDetails;
