import {
  CircleUserRound,
  History,
  TicketCheck,
  TicketPlus,
  TicketX,
  UsersRound,
} from "lucide-react";
import { VariantType } from "../types/variantTypes";
import Button from "./Button";
import useWindowSize from "../utils/useWindowSize";

type CardTemplateProps = {
  variant: VariantType;
};

const CardTemplate: React.FC<CardTemplateProps> = ({ variant = "primary" }) => {
  let cardTextVariant: string;
  let cardBackgroundVariant: string;
  let cardStatusVariant: string;
  let cardButtonIcon: React.ElementType;

  const windowSize = useWindowSize();

  switch (variant) {
    case "primary":
      cardTextVariant = "text-primary";
      cardBackgroundVariant = "fill-primary bg-primary";
      cardStatusVariant = "";
      cardButtonIcon = TicketPlus;
      break;
    case "secondary":
      cardTextVariant = "text-textDark";
      cardBackgroundVariant = "fill-textDark bg-textDark";
      cardStatusVariant = "";
      cardButtonIcon = TicketPlus;
      break;
    case "validation":
      cardTextVariant = "text-validation";
      cardBackgroundVariant = "fill-validation bg-validation";
      cardStatusVariant = "Validé";
      cardButtonIcon = TicketCheck;
      break;
    case "pending":
      cardTextVariant = "text-pending";
      cardBackgroundVariant = "fill-pending bg-pending";
      cardStatusVariant = "En attente";
      cardButtonIcon = History;
      break;
    case "error":
      cardTextVariant = "text-error";
      cardBackgroundVariant = "fill-error bg-error";
      cardStatusVariant = "Complet";
      cardButtonIcon = TicketX;
      break;
    case "cancel":
      cardTextVariant = "text-cancel";
      cardBackgroundVariant = "fill-cancel bg-cancel";
      cardStatusVariant = "Annulé";
      cardButtonIcon = TicketX;
      break;
    default:
      cardTextVariant = "text-primary";
      cardBackgroundVariant = "fill-primary bg-primary";
      cardStatusVariant = "";
      cardButtonIcon = TicketPlus;
  }

  console.log(cardBackgroundVariant.split(" ")[1]);

  return (
    <div className="w-full max-w-lg p-4">
      <div className="flex flex-col items-center justify-center bg-textLight border border-primary rounded-t-2xl rounded-br-2xl shadow-lg">
        {/* Row Top */}
        <div className="grid grid-cols-3 w-full p-4 h-40">
          {/* Time departure/arrival */}
          <div
            className={`flex flex-col justify-between ${cardTextVariant} text-lg sm:text-2xl font-semibold`}
          >
            <p>16:10</p>
            <p>17:40</p>
          </div>
          {/* City departure/arrival + Travel Time */}
          <div
            className={`relative flex flex-col justify-between ${cardTextVariant}`}
          >
            {/* Vertical bar */}
            <div
              className={`dot absolute h-3 w-3 rounded-full ${cardBackgroundVariant} top-2 left-0 -translate-x-7`}
            ></div>
            <div
              className={`trait absolute h-5/6 w-[3px] rounded-sm ${cardBackgroundVariant} top-2 left-0 -translate-x-[23.5px]`}
            ></div>
            <div
              className={`dot absolute h-3 w-3 rounded-full ${cardBackgroundVariant} bottom-2 left-0 -translate-x-7`}
            ></div>
            {/* End Vertical bar */}
            <p className=" text-lg sm:text-2xl  sm:font-bold">Chambéry</p>
            <p className=" font-semibold">1h30</p>
            <p className=" text-lg sm:text-2xl  sm:font-bold">Lyon</p>
          </div>
          {/* Driver + Price */}
          <div
            className={`flex flex-col justify-between items-end ${cardTextVariant}`}
          >
            <div className="flex flex-col items-end gap-2 text-right">
              <CircleUserRound size={30} />
              <p className="font-semibold">François-Xavier</p>
            </div>
            <p className=" text-xl sm:text-4xl font-semibold">12,99€</p>
          </div>
        </div>
      </div>
      {/* Row Bottom */}

      <div className="relative w-full flex justify-between">
        <p
          className={`absolute left-0 flex gap-2 items-center z-10 p-4 text-sm md:text-base text-textLight`}
        >
          {cardStatusVariant === "" ? (
            <>
              2 {windowSize > 640 && "places restantes"}
              {windowSize < 640 &&
                (variant === "primary" || variant === "secondary") && (
                  <UsersRound size={16} />
                )}
            </>
          ) : (
            cardStatusVariant
          )}
        </p>

        <p
          className={`absolute right-0 pr-[70px] sm:pr-[70px] justify-between z-10 p-4 text-sm md:text-base text-textLight `}
        >
          30 septembre 2025
        </p>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 750.9 127"
          className="w-full h-12 sm:h-14 -translate-y-[1px] text-textDark z-0"
          preserveAspectRatio="none"
        >
          <g>
            <path
              className={`${cardBackgroundVariant}`}
              d="M1,1.5l-.5,92.98c0,17.68,14.34,32.02,32.02,32.02h630.96c17.68,0,32.02-14.34,32.02-32.02v-38.58c0-30.59,24.8-55.4,55.4-55.4L1,1.5Z"
              fill="" // Laisse vide car la class Tailwind gère le fill
              stroke="currentColor"
              strokeMiterlimit="10"
              strokeWidth={1.5}
            />
          </g>
        </svg>

        <Button
          isDisabled={variant !== "primary" && variant !== "secondary"}
          icon={cardButtonIcon}
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
