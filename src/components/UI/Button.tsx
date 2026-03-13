import { forwardRef, type ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import clsx from "clsx";

/* ================= TYPES ================= */

type Variant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "success"
  | "warning"
  | "info";

type Size = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: LucideIcon | IconType;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  iconOnly?: boolean;
  fullWidth?: boolean;
}

/* ================= STYLES ================= */

const variantStyles: Record<Variant, string> = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
  danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  warning: "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400",
  info: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500",
  secondary: "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400",
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
  ghost: "text-gray-700 hover:bg-gray-100 focus:ring-gray-400",
};

const sizeStyles: Record<Size, string> = {
  xs: "px-2 py-1 text-xs",
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-5 py-3 text-lg",
};

const iconSize: Record<Size, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
};

/* ================= SPINNER ================= */

const Spinner = ({ size }: { size: Size }) => (
  <svg
    className="animate-spin"
    width={iconSize[size]}
    height={iconSize[size]}
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

/* ================= COMPONENT ================= */

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      label,
      icon: Icon,
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      iconOnly = false,
      fullWidth = false,
      className,
      ...props
    },
    ref,
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={clsx(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition",
          "focus:outline-none focus:ring-2",
          variantStyles[variant],
          sizeStyles[size],
          isDisabled && "opacity-50 cursor-not-allowed",
          fullWidth && "w-full",
          iconOnly && "px-2",
          className,
        )}
        {...props}
      >
        {loading ? (
          <Spinner size={size} />
        ) : (
          Icon && <Icon size={iconSize[size]} />
        )}

        {label && !iconOnly && (
          <span className={`${Icon ? "hidden" : ""} lg:inline`}>{label}</span>
        )}
      </button>
    );
  },
);

Button.displayName = "Button";

export default Button;
