import { TicketCheck, TicketPlus, History, TicketX } from "lucide-react";
import { VariantType } from "../types/variantTypes";

export type VariantConfig = {
  textColor: string;
  bgFill: string;
  statusLabel: string;
  icon: React.ElementType;
};

export const variantConfigMap: Record<VariantType, VariantConfig> = {
  primary: {
    textColor: "text-primary",
    bgFill: "fill-primary bg-primary",
    statusLabel: "",
    icon: TicketPlus,
  },
  secondary: {
    textColor: "text-textDark",
    bgFill: "fill-textDark bg-textDark",
    statusLabel: "",
    icon: TicketPlus,
  },
  validation: {
    textColor: "text-validation",
    bgFill: "fill-validation bg-validation",
    statusLabel: "Validé",
    icon: TicketCheck,
  },
  pending: {
    textColor: "text-pending",
    bgFill: "fill-pending bg-pending",
    statusLabel: "En attente",
    icon: History,
  },
  error: {
    textColor: "text-error",
    bgFill: "fill-error bg-error",
    statusLabel: "Complet",
    icon: TicketX,
  },
  cancel: {
    textColor: "text-cancel",
    bgFill: "fill-cancel bg-cancel",
    statusLabel: "Annulé",
    icon: TicketX,
  },
};
