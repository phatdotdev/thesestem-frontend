import { forwardRef } from "react";
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
  | "info"
  | "default"
  // Solid
  | "solid-primary"
  | "solid-danger"
  | "solid-success"
  | "solid-warning"
  | "solid-info"
  // Outline tinted
  | "outline-primary"
  | "outline-danger"
  | "outline-success"
  | "outline-warning"
  | "outline-info";

type Size = "sm" | "md" | "lg";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label?: string;
  icon?: LucideIcon | IconType;
  variant?: Variant;
  size?: Size;
  dot?: boolean;
  pill?: boolean;
}

/* ================= STYLES ================= */

const variantStyles: Record<Variant, string> = {
  // ── Soft (mặc định) ──────────────────────────────────────────────────────
  primary:
    "bg-blue-50    text-blue-700    ring-1 ring-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:ring-blue-900",
  success:
    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-900",
  danger:
    "bg-red-50     text-red-700     ring-1 ring-red-200 dark:bg-red-950/40 dark:text-red-300 dark:ring-red-900",
  warning:
    "bg-amber-50   text-amber-700   ring-1 ring-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-900",
  info: "bg-sky-50     text-sky-700     ring-1 ring-sky-200 dark:bg-sky-950/40 dark:text-sky-300 dark:ring-sky-900",
  secondary:
    "bg-gray-100   text-gray-600    ring-1 ring-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700",

  // ── Solid ────────────────────────────────────────────────────────────────
  "solid-primary": "bg-blue-600    text-white dark:bg-blue-500",
  "solid-danger": "bg-red-600     text-white dark:bg-red-500",
  "solid-success": "bg-emerald-600 text-white dark:bg-emerald-500",
  "solid-warning": "bg-amber-500   text-white dark:bg-amber-400",
  "solid-info": "bg-sky-600     text-white dark:bg-sky-500",

  // ── Outline tinted ───────────────────────────────────────────────────────
  "outline-primary":
    "border border-blue-300    text-blue-600    bg-transparent dark:border-blue-400 dark:text-blue-300",
  "outline-danger":
    "border border-red-300     text-red-600     bg-transparent dark:border-red-400 dark:text-red-300",
  "outline-success":
    "border border-emerald-300 text-emerald-600 bg-transparent dark:border-emerald-400 dark:text-emerald-300",
  "outline-warning":
    "border border-amber-300   text-amber-600   bg-transparent dark:border-amber-400 dark:text-amber-300",
  "outline-info":
    "border border-sky-300     text-sky-600     bg-transparent dark:border-sky-400 dark:text-sky-300",

  // ── Misc ─────────────────────────────────────────────────────────────────
  outline:
    "border border-gray-300 text-gray-600 bg-transparent dark:border-gray-600 dark:text-gray-300",
  ghost: "text-gray-500 dark:text-gray-400",
  default: "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-300",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-[11px] px-2    py-0.5 gap-1",
  md: "text-xs     px-2.5  py-1   gap-1.5",
  lg: "text-sm     px-3    py-1.5 gap-1.5",
};

const dotSize: Record<Size, string> = {
  sm: "w-1.5 h-1.5",
  md: "w-2   h-2",
  lg: "w-2.5 h-2.5",
};

const iconSize: Record<Size, number> = {
  sm: 11,
  md: 13,
  lg: 15,
};

/* ================= COMPONENT ================= */

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  (
    {
      label,
      icon: Icon,
      variant = "primary",
      size = "md",
      dot = false,
      pill = true,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <span
        ref={ref}
        className={clsx(
          "inline-flex items-center font-medium leading-none",
          variantStyles[variant],
          sizeStyles[size],
          pill ? "rounded-full" : "rounded-md",
          className,
        )}
        {...props}
      >
        {dot && (
          <span
            className={clsx(
              "rounded-full shrink-0 bg-current opacity-70",
              dotSize[size],
            )}
          />
        )}

        {Icon && <Icon size={iconSize[size]} className="shrink-0" />}

        {label && <span>{label}</span>}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
