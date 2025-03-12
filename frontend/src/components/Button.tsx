import React from "react";
import { VariantType } from "../types/variantTypes";

type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: VariantType;
  icon?: React.ElementType;
  iconSize?: number;
  iconColor?: string;
  isFlexCol?: boolean; // ✅ nouvelle prop
  className?: string;
  onClick?: () => void;
};

const Button: React.FC<ButtonProps> = ({
  label,
  type = "button",
  variant = "primary",
  icon: Icon,
  iconSize = 18,
  iconColor = "text-current",
  isFlexCol = false,
  className = "",
  onClick,
}) => {
  const baseClass = isFlexCol ? "button-col" : "button-flex"; // ✅ ici
  const variantClass = `button-${variant}`;
  const finalButtonClass = `${baseClass} ${variantClass} ${
    label ? "py-2 px-4" : "p-2"
  } ${className}`.trim();

  return (
    <button type={type} onClick={onClick} className={finalButtonClass}>
      {Icon && <Icon size={iconSize} className={`${iconColor}`} />}
      {label}
    </button>
  );
};

export default Button;
