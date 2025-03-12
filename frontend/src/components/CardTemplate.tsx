import { CircleUserRound, TicketPlus } from "lucide-react";
import { VariantType } from "../types/variantTypes";
import Button from "./Button";

type CardTemplateProps = {
  variant: VariantType;
};

const CardTemplate: React.FC<CardTemplateProps> = ({ variant = "primary" }) => {
  let cardTextVariant: string;
  let cardBackgroundVariant: string;
  switch (variant) {
    case "primary":
      cardTextVariant = "text-primary";
      cardBackgroundVariant = "bg-primary";
      break;
    case "secondary":
      cardTextVariant = "text-secondary";
      cardBackgroundVariant = "fill-secondary";
      break;
    case "validation":
      cardTextVariant = "text-validation";
      cardBackgroundVariant = "fill-validation";
      break;
    case "pending":
      cardTextVariant = "text-pending";
      cardBackgroundVariant = "fill-pending";
      break;
    case "error":
      cardTextVariant = "text-error";
      cardBackgroundVariant = "fill-error";
      break;
    case "cancel":
      cardTextVariant = "text-cancel";
      cardBackgroundVariant = "fill-cancel";
      break;
    default:
      cardTextVariant = "text-primary";
      cardBackgroundVariant = "fill-primary";
  }
  return (
    <div className="w-full max-w-lg p-4">
      <div className="flex flex-col items-center justify-center bg-textLight border border-primary rounded-t-lg rounded-br-xl shadow-lg">
        {/* Row Top */}
        <div className="grid grid-cols-3 w-full p-4">
          {/* Time departure/arrival */}
          <div
            className={`flex flex-col justify-between ${cardTextVariant} text-lg font-bold`}
          >
            <p>16:10</p>
            <p>17:40</p>
          </div>
          {/* City departure/arrival + Travel Time */}
          <div className={`flex flex-col justify-between ${cardTextVariant}`}>
            <p className=" text-lg font-bold">Chambéry</p>
            <p>1h30</p>
            <p className=" text-lg font-bold">Lyon</p>
          </div>
          {/* Driver + Price */}
          <div
            className={`flex flex-col justify-between items-end ${cardTextVariant}`}
          >
            <div className="flex flex-col items-end">
              <CircleUserRound size={30} />
              <p>François-Xavier</p>
            </div>
            <p className="text-2xl font-bold">12,99€</p>
          </div>
        </div>
      </div>
      {/* Row Bottom */}

      <div className="relative  flex justify-between items-start">
        <div
          className={` absolute flex w-full left-0 pr-20 justify-between z-10 p-4 text-textLight `}
        >
          <p>2 places restantes</p>
          <p>30 septembre 2025</p>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 750.9 127.8"
          className="w-full h-14 -translate-y-[1px] text-textDark z-0"
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
          icon={TicketPlus}
          variant={variant}
          iconSize={32}
          className="!rounded-full shadow-lg -ml-6 my-2"
        />
      </div>
    </div>
  );
};

export default CardTemplate;
