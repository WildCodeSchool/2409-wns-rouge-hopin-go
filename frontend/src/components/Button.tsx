import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { NavLink } from "react-router-dom";
import { VariantType } from "../types/variantTypes";
import { variantConfigMap } from "../constants/variantConfig";

type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: VariantType;
  icon?: React.ElementType;
  iconSize?: number;
  iconColor?: string;
  hoverIconColor?: string;
  iconRotate?: boolean;
  isFlexCol?: boolean;
  className?: string;
  isDisabled?: boolean;
  isHoverBgColor?: boolean;
  isBgTransparent?: boolean;
  onClick?: () => void;
  isLink?: boolean;
  to?: string;
  ref?: React.RefObject<HTMLButtonElement>;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const Button = forwardRef<
  HTMLButtonElement,
  ButtonProps
>(({
  label,
  type = "button",
  variant = "primary",
  icon: Icon,
  iconSize = 18,
  iconColor = "text-current",
  hoverIconColor = "text-current",
  iconRotate = false,
  isFlexCol = false,
  className = "",
  isDisabled = false,
  isHoverBgColor = false,
  isBgTransparent = false,
  onClick,
  isLink = false,
  to = "/",
  ...rest
}, ref) => {
  const config = variantConfigMap[variant];

  const baseClass = isFlexCol ? "button-col" : "button-flex";
  const iconClass = iconRotate
    ? "rotate-0 group-hover:-rotate-12 transition-200"
    : "";
  const hoverBgClass = isHoverBgColor && config.hoverBg ? config.hoverBg : "";

  const finalButtonClass = [
    "group",
    baseClass,
    `button-${variant}`,
    isBgTransparent && "!bg-transparent",
    isDisabled ? "" : "cursor-pointer",
    hoverBgClass,
    label ? "py-2 px-4" : "p-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const content = (
    <>
      {Icon && (
        <span className={iconClass}>
          <Icon
            size={iconSize}
            className={`${iconColor} group-hover:${hoverIconColor}`}
          />
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
          `${finalButtonClass} ${isPending ? "opacity-50" : isActive ? "underline" : ""
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
      ref={ref}
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={finalButtonClass}
      aria-label={label || "icon button"}
      {...rest}
    >
      {content}
    </button>
  );
}
);

export default Button;
