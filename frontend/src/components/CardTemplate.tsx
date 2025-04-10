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
  const windowSize = useWindowSize();
  const {
    textColor,
    bgFill,
    statusLabel,
    icon: CardIcon,
  } = variantConfigMap[variant];

  return (
    <div
      className={`w-full select-none md:min-w-[32rem] max-w-lg p-4 ${
        isSelected ? "scale-105" : " scale-100"
      } transition-transform ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className="flex flex-col items-center justify-center bg-textLight border border-primary rounded-t-2xl rounded-br-2xl shadow-lg z-30">
        <div className="grid grid-cols-3 w-full p-4 h-40 z-30">
          <div
            className={`flex flex-col  justify-between ${textColor} text-base md:text-2xl font-semibold`}
          >
            <p>{data.departureTime}</p>
            <p>{data.arrivalTime}</p>
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
            <p
              className="text-lg md:text-xl sm:font-bold truncate"
              title={data.departureCity}
            >
              {data.departureCity}
            </p>
            <p className="font-semibold">{data.travelDuration}</p>
            <p
              className="text-lg md:text-xl sm:font-bold truncate"
              title={data.arrivalCity}
            >
              {data.arrivalCity}
            </p>
          </div>

          <div
            className={`flex flex-col justify-between items-end ${textColor}`}
          >
            <div className="flex flex-col items-end gap-2 text-right">
              <CircleUserRound size={30} />
              <p
                className="font-semibold truncate max-w-[8rem]"
                title={data.driverName}
              >
                {data.driverName}
              </p>
            </div>
            <p className="text-xl md:text-4xl font-semibold">
              {data.price.toFixed(2)}€
            </p>
          </div>
        </div>
      </div>

      <div className="relative w-full flex justify-between z-30">
        <p className="absolute left-0 flex gap-2 items-center z-10 p-4 text-sm md:text-base text-textLight">
          {statusLabel === "" ? (
            <>
              {data.availableSeats} {windowSize > 640 && "places restantes"}
              {windowSize < 640 &&
                (variant === "primary" || variant === "secondary") && (
                  <UsersRound size={16} />
                )}
            </>
          ) : (
            statusLabel
          )}
        </p>

        <p className="absolute right-0 pr-[70px] sm:pr-[70px] z-10 p-4 text-sm md:text-base text-textLight">
          {data.date}
        </p>

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 750.9 127"
          className="w-full h-12 sm:h-14 -translate-y-[1px] text-textDark z-0"
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
          iconSize={windowSize > 640 ? 32 : 24}
          isHoverBgColor={variant === "primary" || variant === "secondary"}
          className="!rounded-full shadow-lg -ml-2 sm:-ml-6 my-2 z-10"
        />
      </div>
    </div>
  );
};

export default CardTemplate;
