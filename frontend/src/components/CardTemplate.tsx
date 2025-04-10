import { CircleUserRound, UsersRound } from "lucide-react";
import { VariantType } from "../types/variantTypes";
import { variantConfigMap } from "../constants/variantConfig";
import Button from "./Button";
import useWindowSize from "../utils/useWindowSize";

export type CardData = {
  departureTime: string;
  arrivalTime: string;
  departureCity: string;
  arrivalCity: string;
  travelDuration: string;
  driverName: string;
  price: number;
  date: string;
  availableSeats: number;
  is_canceled?: boolean;
};

type CardTemplateProps = {
  variant: VariantType;
  data: CardData;
  onClick?: () => void;
  isSelected?: boolean;
};

const CardTemplate: React.FC<CardTemplateProps> = ({
  variant,
  data,
  onClick,
  isSelected = false,
}) => {
  const { isSm, isMd, isLg, isXl, windowWidth } = useWindowSize();
  const {
    textColor,
    bgFill,
    statusLabel,
    icon: CardIcon,
  } = variantConfigMap[variant];

  return (
    <div
      className={` select-none transition-200 w-full sm:min-w-[32rem] sm:max-w-lg md:min-w-[23rem] md:max-w-[23rem] lg:min-w-[28rem] lg:max-w-[28rem] xl:min-w-[32rem] xl:max-w-lg p-4 ${
        isSelected && isLg ? "scale-110" : isSelected && isMd ? "scale-105" : ""
      } transition-transform ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col items-center justify-center bg-textLight border border-primary rounded-t-2xl rounded-br-2xl shadow-lg z-30">
        <div className="grid grid-cols-3 w-full p-4 h-32 sm:h-40 md:h-36 lg:h-40 z-30">
          <div
            className={`flex flex-col  justify-between ${textColor} text-base sm:text-2xl md:text-base lg:text-2xl font-semibold`}
          >
            <p>{data.departureTime}</p>
            <p>{data.arrivalTime}</p>
          </div>

          <div
            className={`relative flex flex-col justify-between ${
              windowWidth > 450 ? "col-span-1" : "col-span-2 "
            }  ${textColor}`}
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
            <p
              className="text-sm sm:text-xl lg:text-xl sm:font-bold md:font-normal lg:font-bold truncate"
              title={data.departureCity}
            >
              {data.departureCity}
            </p>
            <p className="font-semibold">{data.travelDuration}</p>
            <p
              className="text-sm sm:text-xl lg:text-xl sm:font-bold md:font-normal lg:font-bold truncate"
              title={data.arrivalCity}
            >
              {data.arrivalCity}
            </p>
          </div>
          {windowWidth > 450 && (
            <div
              className={`flex flex-col justify-between items-end ${textColor}`}
            >
              <div className="flex flex-col items-end gap-2">
                <CircleUserRound size={isXl ? 40 : isMd ? 34 : 40} />
                <p
                  className="font-semibold truncate sm:max-w-[8rem]"
                  title={data.driverName}
                >
                  {data.driverName}
                </p>
              </div>

              <p className="text-xl lg:text-4xl font-semibold">
                {data.price.toFixed(2)}{" "}
                <span className="text-sm lg:text-2xl">€</span>
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="relative w-full flex justify-between z-30">
        <p className="absolute left-0 flex gap-2 items-center z-10 p-4 text-sm lg:text-base text-textLight">
          {statusLabel === "" ? (
            <>
              {data.availableSeats}{" "}
              {isSm &&
                `${
                  data.availableSeats > 1
                    ? "places restantes"
                    : "place restante"
                }`}
              {!isSm && (variant === "primary" || variant === "secondary") && (
                <UsersRound size={16} />
              )}
            </>
          ) : (
            statusLabel
          )}
        </p>

        <p className="absolute right-0 pr-[70px] sm:pr-[70px] md:pr-[75px] lg:pr-[70px] z-10 p-4 text-sm lg:text-base text-textLight">
          {data.date}
        </p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 750.9 127"
          className="w-full h-12 sm:h-14  md:scale-x-[0.95] lg:scale-100 md:-translate-x-[8.5px] lg:-translate-x-0 -translate-y-[1px] text-textDark z-0"
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

        <Button
          isDisabled={variant !== "primary" && variant !== "secondary"}
          icon={CardIcon}
          iconRotate={variant === "primary" || variant === "secondary"}
          variant={variant}
          iconSize={isMd ? 32 : isSm ? 32 : 24}
          isHoverBgColor={variant === "primary" || variant === "secondary"}
          className="!rounded-full shadow-lg -ml-2 sm:-ml-6 my-2 z-10"
        />
      </div>
    </div>
  );
};

export default CardTemplate;
