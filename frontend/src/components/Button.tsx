import React from "react";
import { NavLink } from "react-router-dom";
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
  isLink?: boolean;
  to?: string;
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
  isLink = false,
  to = "/",
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

  const isDisabledClass = isDisabled ? "" : "cursor-pointer";
  const iconClass = iconRotate
    ? "rotate-0 group-hover:-rotate-12 transition-200"
    : "";

  const finalButtonClass =
    `group ${baseClass} ${hoverBgClass} ${variantClass} ${isDisabledClass} ${
      label ? "py-2 px-4" : "p-2"
    } ${className}`.trim();

  const content = (
    <>
      {Icon && (
        <span className={iconClass}>
          <Icon size={iconSize} className={iconColor} />
        </span>
      )}
      {label}
    </>
  );

  if (isLink) {
    return (
      <NavLink
        to={to}
        className={({ isActive, isPending }) =>
          `${finalButtonClass} ${
            isPending ? "opacity-50" : isActive ? "underline" : ""
          }`.trim()
        }
        aria-label={label || "link button"}
      >
        {content}
      </NavLink>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={finalButtonClass}
      aria-label={label || "icon button"}
    >
      {content}
    </button>
  );
};

export default Button;
