import { VariantType } from "../types/variantTypes";
import { CardData } from "./CardTemplate";
import { variantConfigMap } from "../constants/variantConfig";
import useBreakpoints from "../utils/useWindowSize";

type CardRideDetailsProps = {
  variant: VariantType;
  data: CardData;
};

const CardRideDetails: React.FC<CardRideDetailsProps> = ({ variant, data }) => {
  const { textColor, bgFill } = variantConfigMap[variant];
  const { isMd, isLg, isXl } = useBreakpoints();

  return (
    <div
      className={`hidden md:block p-8 relative my-40 rounded-3xl space-y-5 shadow-custom py-20 md:w-full border-4 border-primary  ${textColor}`}
    >
      <div className="pointer-events-none absolute -left-full lg:translate-x-[3px] xl:translate-x-[1px] bg-gray-100  top-1/2 -translate-y-1/2 w-full flex justify-center">
        <svg
          id="overlay"
          className=" md:scale-y-[1.04] lg:scale-y-[1.01] lg:scale-x-[0.99] xl:scale-y-[1.005] xl:scale-x-[0.999] xl:skew-x-[0.04deg] "
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
      <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>
        {data.driverName}
      </h2>
      <h2 className={`text-xl font-bold mb-2 ${textColor}`}>
        Détails du trajet
      </h2>
      <p className="text-sm md:text-base">{data.date}</p>
      <p className="text-xl md:text-4xl font-semibold">
        {data.price.toFixed(2)}
        <span className="text-sm md:text-2xl"> €</span>
      </p>
      <div className="flex flex-col gap-2">
        <p>
          {variant === "cancel" || variant === "error"
            ? "Non disponible"
            : `${data.availableSeats} ${
                data.availableSeats > 1 ? "places restantes" : "place restante"
              } `}
        </p>
        <div className="flex justify-start h-40 ">
          <div
            className={`flex flex-col w-28 justify-between ${textColor} text-base md:text-2xl font-semibold`}
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
            <div className="flex flex-col ml-2 justify-between h-full text-left">
              <p
                className="text-lg md:text-xl sm:font-bold "
                title={data.departureCity}
              >
                {data.departureCity}
              </p>
              <p className="font-semibold">{data.travelDuration}</p>
              <p
                className="text-lg md:text-xl sm:font-bold "
                title={data.arrivalCity}
              >
                {data.arrivalCity}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardRideDetails;
