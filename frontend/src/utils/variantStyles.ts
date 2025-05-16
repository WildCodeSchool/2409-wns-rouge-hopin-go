// variantUtils.ts
import { TicketCheck, TicketPlus, TicketX, History } from "lucide-react";
import { VariantType } from "../types/variantTypes";

export const getVariantDetails = (variant: VariantType) => {
  switch (variant) {
    case "primary":
      return {
        text: "text-primary",
        background: "fill-primary bg-primary",
        status: "",
        icon: TicketPlus,
      };
    case "secondary":
      return {
        text: "text-textDark",
        background: "fill-textDark bg-textDark",
        status: "",
        icon: TicketPlus,
      };
    case "validation":
      return {
        text: "text-validation",
        background: "fill-validation bg-validation",
        status: "Validé",
        icon: TicketCheck,
      };
    case "pending":
      return {
        text: "text-pending",
        background: "fill-pending bg-pending",
        status: "En attente",
        icon: History,
      };
    case "full":
      return {
        text: "text-full",
        background: "fill-full bg-full",
        status: "Complet",
        icon: TicketX,
      };
    case "cancel":
      return {
        text: "text-cancel",
        background: "fill-cancel bg-cancel",
        status: "Annulé",
        icon: TicketX,
      };
    case "refused":
      return {
        text: "text-refused",
        background: "fill-refused bg-refused",
        status: "Refusé",
        icon: TicketX,
      };
    default:
      return {
        text: "text-primary",
        background: "fill-primary bg-primary",
        status: "",
        icon: TicketPlus,
      };
  }
};
