import React from "react";
import { VariantType } from "../types/variantTypes";

type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: VariantType;
  icon?: React.ElementType;
  iconSize?: number;
  iconColor?: string;
  iconRotate?: boolean;
  isFlexCol?: boolean;
  className?: string;
  isDisabled?: boolean;
  isHoverBgColor?: boolean;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant = "primary",
  icon: Icon,
  iconSize = 18,
  iconColor = "text-current",
  iconRotate = false,
  isFlexCol = false,
  className = "",
  isDisabled = false,
  isHoverBgColor = false,
  onClick,
}) => {
  const baseClass = isFlexCol ? "button-col" : "button-flex";
  const variantClass = `button-${variant}`;

  let hoverBgClass = "";
  if (isHoverBgColor) {
    switch (variant) {
      case "primary":
        hoverBgClass = "hover:bg-primaryHover";
        break;
      case "secondary":
        hoverBgClass = "hover:bg-secondaryHover";
        break;
      case "validation":
        hoverBgClass = "hover:bg-validationHover";
        break;
      case "pending":
        hoverBgClass = "hover:bg-pendingHover";
        break;
      case "error":
        hoverBgClass = "hover:bg-errorHover";
        break;
      case "cancel":
        hoverBgClass = "hover:bg-cancelHover";
        break;
      default:
        hoverBgClass = "";
    }
  }

  const iconClass = `${
    iconRotate ? "rotate-0 group-hover:-rotate-12 transition-200" : ""
  } `;
  const finalButtonClass =
    `group ${baseClass} ${hoverBgClass} ${variantClass} ${
      label ? "py-2 px-4" : "p-2"
    } ${className}`.trim();

  return (
    <button
      aria-label={label || "icon button"}
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={finalButtonClass}
    >
      <span className={iconClass}>
        {Icon && <Icon size={iconSize} className={`${iconColor}`} />}
      </span>
      {label}
    </button>
  );
};

export default Button;
