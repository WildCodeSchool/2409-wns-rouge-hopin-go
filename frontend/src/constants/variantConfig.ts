import { TicketCheck, TicketPlus, History, TicketX } from "lucide-react";
import { VariantType } from "../types/variantTypes";

export type VariantConfig = {
  textColor: string;
  bgFill: string;
  statusLabel: string;
  icon: React.ElementType;
  hoverBg?: string;
};

export const variantConfigMap: Record<VariantType, VariantConfig> = {
  primary: {
    textColor: "text-primary",
    bgFill: "fill-primary bg-primary",
    statusLabel: "",
    icon: TicketPlus,
    hoverBg: "hover:bg-primaryHover",
  },
  secondary: {
    textColor: "text-textDark",
    bgFill: "fill-textDark bg-textDark",
    statusLabel: "",
    icon: TicketPlus,
    hoverBg: "hover:bg-secondaryHover",
  },
  validation: {
    textColor: "text-validation",
    bgFill: "fill-validation bg-validation",
    statusLabel: "Validé",
    icon: TicketCheck,
    hoverBg: "hover:bg-validationHover",
  },
  pending: {
    textColor: "text-pending",
    bgFill: "fill-pending bg-pending",
    statusLabel: "En attente",
    icon: History,
    hoverBg: "hover:bg-pendingHover",
  },
  full: {
    textColor: "text-error",
    bgFill: "fill-error bg-full",
    statusLabel: "Complet",
    icon: TicketX,
    hoverBg: "hover:bg-fullHover",
  },
  cancel: {
    textColor: "text-cancel",
    bgFill: "fill-cancel bg-cancel",
    statusLabel: "Annulé",
    icon: TicketX,
    hoverBg: "hover:bg-cancelHover",
  },
  refused: {
    textColor: "text-refused",
    bgFill: "fill-refused bg-refused",
    statusLabel: "Refusé",
    icon: TicketX,
    hoverBg: "hover:bg-refusedHover",
  },
};
