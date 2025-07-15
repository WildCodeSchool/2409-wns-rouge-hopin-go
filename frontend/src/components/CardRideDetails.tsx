import { VariantType } from "../types/variantTypes";
import { variantConfigMap } from "../constants/variantConfig";
import useBreakpoints from "../utils/useWindowSize";
import { formatDate, formatTime } from "../utils/formatDate";
import { SearchRidesQuery } from "../gql/graphql";
import SearchRide from "./SearchRide";
import Button from "./Button";
import { Search } from "lucide-react";
import RegisterButton from "./RegisterButton";
import Map from "./Map";
import { useState } from "react";
import { formatTravelDuration } from "../utils/formatTravelDuration";

type SearchRide = SearchRidesQuery["searchRide"][number];

type CardRideDetailsProps = {
  variant: VariantType;
  data: SearchRide;
};

const CardRideDetails: React.FC<CardRideDetailsProps> = ({ variant, data }) => {
  const { textColor, bgFill } = variantConfigMap[variant];
  const { isMd, isLg, isXl } = useBreakpoints();

  const departureDate = new Date(data.departure_at);
  const arrivalDate = new Date(data.arrival_at);
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const dateStr = formatDate(departureDate);

  // ---------------------Map---------------------
  const departureCity = data.departure_city;
  const departureLatitude = data.departure_location.coordinates[0];
  const departureLongitude = data.departure_location.coordinates[1];
  const arrivalCity = data.arrival_city;
  const arrivalLatitude = data.arrival_location.coordinates[0];
  const arrivalLongitude = data.arrival_location.coordinates[1];
  // ---------------------End Map---------------------

  const [travelDuration, setTravelDuration] = useState<string>("");
  const [travelDistance, setTravelDistance] = useState<string>("");

  const availableSeats = data.max_passenger - (data.nb_passenger ?? 0);
  const driverName =
    data.driver_id?.firstName ?? `Conducteur #${data.driver_id?.id ?? "?"}`;
  const price = 10 + Math.random() * 15;

  return (
    <div className="relative z-0 flex justify-center w-full">
      <div className="absolute z-0 top-[88px] hidden md:flex w-full max-w-[648px] ">
        <div className="bg-primary px-6 pt-2 pb-6 rounded-t-3xl shadow-md w-[85%]">
          <SearchRide variant="searchBarRide" />
        </div>
        <div className="w-[15%] flex items-center justify-center mb-4 ">
          <div className="flex w-full justify-center">
            <Button
              variant="primary"
              className="!rounded-full shadow-lg -ml-2 sm:-ml-6 my-2"
              type="submit"
              icon={Search}
              iconSize={isXl ? 30 : isLg ? 28 : isMd ? 26 : 24}
              form="search-ride-form"
            />
          </div>
        </div>
      </div>
      <div
        className={`hidden relative z-10 md:block p-8 mt-40 mb-40 mr-8 rounded-3xl space-y-5 shadow-custom  md:w-full h-fit border-4 border-primary ${textColor} bg-gray-100`}
      >
        <div className="pointer-events-none absolute -left-full lg:translate-x-[3px] xl:translate-x-[1px] bg-gray-100 top-1/2 -translate-y-1/2 w-full flex justify-center">
          <svg
            id="overlay"
            className="md:scale-y-[1.04] lg:scale-y-[1.01] lg:scale-x-[0.99] xl:scale-y-[1.005] xl:scale-x-[0.999] xl:skew-x-[0.04deg]"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 648.14 389.63"
          >
            <path
              style={{
                fill: "#f3f4f6",
                stroke: "#8e387c",
                strokeWidth: `${isXl ? 4 : isLg ? 4.6 : isMd ? 6 : 1}px`,
              }}
              className="overlay"
              d="M645.72,389.63c0-20.75-13.43-37.57-30-37.57H28c-14.36,0-26-14.58-26-32.56V70.26c0-17.98,11.64-32.56,26-32.56h588.14c16.6,0,30.05-16.89,30-37.69"
            />
          </svg>
        </div>
        <h2 className={`text-2xl font-bold ${textColor}`}>{driverName}</h2>
        <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
          Détails du trajet
        </h2>
        <div className="flex w-full justify-start  gap-10">
          <div>
            <p className="text-sm md:text-base">{dateStr}</p>
            <p className="text-xl md:text-4xl font-semibold">
              {price.toFixed(2)}
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
          <div className="flex justify-start h-40">
            <div className={`flex flex-col w-28 justify-between ${textColor}`}>
              <p className="text-base md:text-2xl font-semibold">
                {departureTime}
              </p>
              <p className="text-sm">{travelDuration}</p>
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
                  title={data.departure_city}
                >
                  {data.departure_city}
                </p>
                <p className="text-sm">{travelDistance}</p>
                <p
                  className="text-lg md:text-xl sm:font-bold"
                  title={data.arrival_city}
                >
                  {data.arrival_city}
                </p>
              </div>
            </div>
          </div>
        </div>
        <RegisterButton variant={variant} rideId={data.id} size="large" />
        <Map
          mapId={`map-${data.id}`}
          departureLatitude={departureLatitude}
          departureLongitude={departureLongitude}
          departureCity={departureCity}
          arrivalLatitude={arrivalLatitude}
          arrivalLongitude={arrivalLongitude}
          arrivalCity={arrivalCity}
          onRouteData={({ distanceKm, durationMin }) => {
            setTravelDuration(`${formatTravelDuration(durationMin)}`);
            setTravelDistance(`${distanceKm.toFixed(1)} km`);
            console.log(`Distance : ${distanceKm} km`);
            console.log(`Durée : ${durationMin} min`);
          }}
        />
      </div>
    </div>
  );
};

export default CardRideDetails;
