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
      cardBackgroundVariant = "bg-secondary";
      break;
    case "validation":
      cardTextVariant = "text-validation";
      cardBackgroundVariant = "bg-validation";
      break;
    case "pending":
      cardTextVariant = "text-pending";
      cardBackgroundVariant = "bg-pending";
      break;
    case "error":
      cardTextVariant = "text-error";
      cardBackgroundVariant = "bg-error";
      break;
    case "cancel":
      cardTextVariant = "text-cancel";
      cardBackgroundVariant = "bg-cancel";
      break;
    default:
      cardTextVariant = "text-primary";
      cardBackgroundVariant = "bg-primary";
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
      <div className="relative z-10 flex justify-between items-center gap-4">
        <div
          className={`flex ${cardBackgroundVariant} border-b border-x border-textDark rounded-b-lg justify-between w-[88%] self-start p-4 text-textLight shadow-lg`}
        >
          <p>2 places restantes</p>
          <p>30 septembre 2025</p>
        </div>

        {/* Fausse encoche */}
        <div className="absolute right-0 bottom-0 z-0 w-[50px] h-[50px] -translate-x-[9px]  -translate-y-2  rounded-tl-2xl border-l border-t border-primary" />
        <span className="absolute right-0 bottom-0 z-10 ">
          <Button
            icon={TicketPlus}
            variant={variant}
            iconSize={32}
            className="!rounded-full shadow-lg"
          />
        </span>
      </div>
    </div>
  );
};

export default CardTemplate;
