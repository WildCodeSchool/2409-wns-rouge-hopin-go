import { CircleUserRound } from "lucide-react";
import { VariantType } from "../types/variantTypes";
import { variantConfigMap } from "../constants/variantConfig";
import { formatDate, formatTime } from "../utils/formatDate";
import RegisterButton from "./RegisterButton";
import { useQuery } from "@apollo/client";
import { queryWhoAmI } from "../api/WhoAmI";
import useRide from "../context/Rides/useRide";
import { formatTravelDuration } from "../utils/formatTravelDuration";
import useBreakpoints from "../utils/useWindowSize";
import DetailsButtonWithModal from "./DetailsButtonWithModal";

type CardTemplateProps = {
  variant: VariantType;
  onClick?: () => void;
  onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
  isSelected?: boolean;
  additionalClassName?: string;
  driverUpcomingRides?: boolean;
  isModal?: boolean;
};

const CardTemplate: React.FC<CardTemplateProps> = ({
  variant,
  onClick,
  onScroll,
  isModal = false,
  isSelected = false,
  additionalClassName = "",
}) => {
  const ride = useRide();
  const { isMd, isXl, is2xl, windowWidth } = useBreakpoints();
  const { textColor, bgFill, statusLabel, icon: CardIcon } = variantConfigMap[variant];

  const { data: whoAmIData } = useQuery(queryWhoAmI);
  const me = whoAmIData?.whoami;

  const departureDate = new Date(ride.departure_at);
  const arrivalDate = new Date(ride.arrival_at);
  const departureTime = formatTime(departureDate);
  const arrivalTime = formatTime(arrivalDate);
  const dateStr = formatDate(departureDate);
  const driver = ride.driver?.id ?? "?";
  const pricePerPassenger = ride.price_per_passenger;
  const totalPriceRide = ride.total_route_price;

  const travelDuration = ride.duration_min ?? 0;

  const driverName = ride.driver?.firstName ?? `Conducteur #${ride.driver?.id ?? "?"}`;

  return (
    <div
      className={`${
        isSelected && additionalClassName
      } transition-200 w-full max-w-[500px] select-none p-4 transition-transform ${
        onClick ? "cursor-pointer" : ""
      }`}
      onClick={onClick}
      onScroll={onScroll}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div
        className={`bg-textLight border-primary flex flex-col items-center justify-center rounded-t-2xl border ${
          me?.id !== driver ? "rounded-br-2xl" : ""
        } z-30 shadow-lg`}
      >
        <div className="z-30 grid h-40 w-full grid-cols-3 p-4">
          <div
            className={`flex flex-col justify-between ${textColor} text-base font-semibold sm:text-2xl md:text-base lg:text-2xl`}
          >
            <p>{departureTime}</p>
            <p>{arrivalTime}</p>
          </div>

          <div
            className={`relative flex flex-col justify-between ${
              windowWidth > 450 ? "col-span-1" : "col-span-2"
            } ${textColor}`}
          >
            <div
              className={`dot absolute h-3 w-3 rounded-full ${bgFill} left-0 top-2 -translate-x-7`}
            />
            <div
              className={`trait absolute h-5/6 w-[3px] rounded-sm ${bgFill} left-0 top-2 -translate-x-[23.5px]`}
            />
            <div
              className={`dot absolute h-3 w-3 rounded-full ${bgFill} bottom-2 left-0 -translate-x-7`}
            />
            <p
              className="truncate text-sm sm:text-xl sm:font-bold md:font-normal lg:text-xl lg:font-bold"
              title={ride.departure_city}
            >
              {ride.departure_city}
            </p>
            <p>{formatTravelDuration(travelDuration)}</p>
            <p
              className="truncate text-sm sm:text-xl sm:font-bold md:font-normal lg:text-xl lg:font-bold"
              title={ride.arrival_city}
            >
              {ride.arrival_city}
            </p>
          </div>

          {windowWidth > 450 && (
            <div className={`flex flex-col items-end justify-between ${textColor}`}>
              <div className="flex flex-col items-end gap-2">
                <CircleUserRound size={isXl ? 40 : isMd ? 34 : 40} />
                <p className="truncate font-semibold sm:max-w-[8rem]" title={driverName}>
                  {driverName}
                </p>
              </div>
              <p className="text-xl font-semibold lg:text-4xl">
                {(pricePerPassenger ?? 0).toFixed(2)}
                <span className="font-sans text-sm">€/pp</span>
              </p>
              <p className="text-nowrap font-semibold">
                <span className="text-nowrap font-sans text-sm">Total trajet </span>
                {(totalPriceRide ?? 0).toFixed(2)}
                <span className="text-nowrap font-sans text-sm">€</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative z-30 flex w-full justify-between">
        <p
          className={`text-textLight absolute left-0 z-10 flex items-center gap-2 p-4 text-sm lg:text-base ${
            me?.id === driver ? "ml-3" : ""
          }`}
        >
          {statusLabel === "" ? (
            <>
              {ride.available_seats}
              {is2xl && `${ride.available_seats > 1 ? " places restantes" : " place restante"}`}
              {!is2xl && (variant === "primary" || variant === "secondary") && (
                <svg
                  fill="none"
                  height="20"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipRule="evenodd" fill="currentColor" fillRule="evenodd">
                    <path d="m5.25 22c0-.4142.33579-.75.75-.75h12c.4142 0 .75.3358.75.75s-.3358.75-.75.75h-12c-.41421 0-.75-.3358-.75-.75z" />
                    <path d="m4.25 16.5c0-1.5188 1.23122-2.75 2.75-2.75h10c1.5188 0 2.75 1.2312 2.75 2.75v3c0 .4142-.3358.75-.75.75h-14c-.41421 0-.75-.3358-.75-.75zm2.75-1.25c-.69036 0-1.25.5596-1.25 1.25v2.25h12.5v-2.25c0-.6904-.5596-1.25-1.25-1.25z" />
                    <path d="m6.75 4c0-1.51878 1.23122-2.75 2.75-2.75h5c1.5188 0 2.75 1.23122 2.75 2.75v.5c0 .41421-.3358.75-.75.75s-.75-.33579-.75-.75v-.5c0-.69036-.5596-1.25-1.25-1.25h-5c-.69036 0-1.25.55964-1.25 1.25v9.75h7.5v-5.25c0-.41421.3358-.75.75-.75s.75.33579.75.75v6c0 .4142-.3358.75-.75.75h-9c-.41421 0-.75-.3358-.75-.75z" />
                    <path d="m3.75 10.5c0-1.24264 1.00736-2.25 2.25-2.25s2.25 1.00736 2.25 2.25v1.5c0 .4142-.33579.75-.75.75h-3c-.41421 0-.75-.3358-.75-.75zm2.25-.75c-.41421 0-.75.3358-.75.75v.75h1.5v-.75c0-.4142-.33579-.75-.75-.75z" />
                    <path d="m15.75 10.5c0-1.24264 1.0074-2.25 2.25-2.25s2.25 1.00736 2.25 2.25v1.5c0 .4142-.3358.75-.75.75h-3c-.4142 0-.75-.3358-.75-.75zm2.25-.75c-.4142 0-.75.3358-.75.75v.75h1.5v-.75c0-.4142-.3358-.75-.75-.75z" />
                  </g>
                </svg>
              )}
            </>
          ) : (
            statusLabel
          )}
        </p>
        {!(variant === "cancel" || variant === "secondary") && (
          <DetailsButtonWithModal variant={variant} isModal={isModal} />
        )}
        <p
          className={`absolute ${
            me?.id === driver ? "right-0" : "right-16"
          } text-textLight z-10 p-4 text-sm lg:text-base`}
        >
          {dateStr}
        </p>

        {me?.id !== driver ? (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 750.9 127"
              className="text-textDark z-0 h-12 w-full -translate-y-[1px] sm:h-14 md:-translate-x-[8.5px] md:scale-x-[0.95] lg:-translate-x-0 lg:scale-100"
              preserveAspectRatio="none"
            >
              <path
                className={bgFill}
                d="M1,1.5l-.5,92.98c0,17.68,14.34,32.02,32.02,32.02h630.96c17.68,0,32.02-14.34,32.02-32.02v-38.58c0-30.59,24.8-55.4,55.4-55.4L1,1.5Z"
                stroke="currentColor"
                strokeMiterlimit="10"
                strokeWidth={1.5}
              />
            </svg>
            <RegisterButton rideId={ride.id} size="small" variant={variant} icon={CardIcon} />
          </>
        ) : (
          <div className={`${bgFill} h-14 w-[100%] rounded-b-3xl px-6 pl-2 pt-2 shadow-md`}></div>
        )}
      </div>
    </div>
  );
};

export default CardTemplate;
