import React from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "validation"
  | "pending"
  | "error"
  | "cancel";

type ButtonProps = {
  label?: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
  icon?: React.ElementType;
  iconSize?: number;
  iconColor?: string;
  isFlexCol?: boolean;
  className?: string;
  isDisabled?: boolean;
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
  isDisabled = false,
  onClick,
}) => {
  const baseClass = isFlexCol ? "button-col" : "button-flex"; // ✅ ici
  const variantClass = `button-${variant}`;
  const finalButtonClass = `${baseClass} ${variantClass} ${
    label ? "py-2 px-4" : "p-2"
  } ${className}`.trim();

  return (
    <button
      disabled={isDisabled}
      type={type}
      onClick={onClick}
      className={finalButtonClass}
    >
      {Icon && <Icon size={iconSize} className={`${iconColor}`} />}
      {label}
    </button>
  );
};

export default Button;
