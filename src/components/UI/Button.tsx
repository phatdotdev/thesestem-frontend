import { forwardRef, type ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import clsx from "clsx";

/* ================= TYPES ================= */

type Variant =
  // Solid
  | "primary"
  | "secondary"
  | "danger"
  | "success"
  | "warning"
  | "info"
  // Outline
  | "outline"
  | "outline-primary"
  | "outline-danger"
  | "outline-success"
  | "outline-warning"
  | "outline-info"
  // Soft (light tinted bg)
  | "soft-primary"
  | "soft-danger"
  | "soft-success"
  | "soft-warning"
  | "soft-info"
  // Misc
  | "ghost"
  | "dark"
  | "link";

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
  // ── Solid ──────────────────────────────────────────────────────────────────
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600",
  secondary:
    "bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-gray-400 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700",
  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600",
  success:
    "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600",
  warning:
    "bg-amber-500 text-white hover:bg-amber-600 focus:ring-amber-400 dark:bg-amber-400 dark:hover:bg-amber-500",
  info: "bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-500 dark:bg-sky-500 dark:hover:bg-sky-600",

  // ── Outline ────────────────────────────────────────────────────────────────
  outline:
    "border border-gray-300 text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800",
  "outline-primary":
    "border border-blue-500 text-blue-600 hover:bg-blue-50 focus:ring-blue-400 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-950/40",
  "outline-danger":
    "border border-red-400 text-red-600 hover:bg-red-50 focus:ring-red-400 dark:border-red-400 dark:text-red-300 dark:hover:bg-red-950/40",
  "outline-success":
    "border border-emerald-500 text-emerald-600 hover:bg-emerald-50 focus:ring-emerald-400 dark:border-emerald-400 dark:text-emerald-300 dark:hover:bg-emerald-950/40",
  "outline-warning":
    "border border-amber-400 text-amber-600 hover:bg-amber-50 focus:ring-amber-400 dark:border-amber-400 dark:text-amber-300 dark:hover:bg-amber-950/40",
  "outline-info":
    "border border-sky-400 text-sky-600 hover:bg-sky-50 focus:ring-sky-400 dark:border-sky-400 dark:text-sky-300 dark:hover:bg-sky-950/40",

  // ── Soft ───────────────────────────────────────────────────────────────────
  "soft-primary":
    "bg-blue-50 text-blue-700 hover:bg-blue-100 focus:ring-blue-300 dark:bg-blue-950/40 dark:text-blue-300 dark:hover:bg-blue-900/50",
  "soft-danger":
    "bg-red-50 text-red-700 hover:bg-red-100 focus:ring-red-300 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50",
  "soft-success":
    "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-900/50",
  "soft-warning":
    "bg-amber-50 text-amber-700 hover:bg-amber-100 focus:ring-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-900/50",
  "soft-info":
    "bg-sky-50 text-sky-700 hover:bg-sky-100 focus:ring-sky-300 dark:bg-sky-950/40 dark:text-sky-300 dark:hover:bg-sky-900/50",

  // ── Misc ───────────────────────────────────────────────────────────────────
  ghost:
    "text-gray-700 hover:bg-gray-100 focus:ring-gray-400 dark:text-gray-200 dark:hover:bg-gray-800",
  dark: "bg-gray-900 text-white hover:bg-gray-700 focus:ring-gray-600 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-200",
  link: "text-blue-600 underline-offset-4 hover:underline focus:ring-blue-400 px-0 dark:text-blue-400",
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
