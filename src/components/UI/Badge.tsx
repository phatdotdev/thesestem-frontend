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
  | "default";

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
  primary: "bg-blue-100 text-blue-700",
  success: "bg-emerald-100 text-emerald-700",
  danger: "bg-red-100 text-red-700",
  warning: "bg-amber-100 text-amber-700",
  info: "bg-sky-100 text-sky-700",
  secondary: "bg-gray-100 text-gray-700",
  outline: "border border-gray-300 text-gray-700",
  ghost: "text-gray-600",
  default: "text-gray-600",
};

const sizeStyles: Record<Size, string> = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-3 py-1",
  lg: "text-base px-4 py-1.5",
};

const iconSize: Record<Size, number> = {
  sm: 12,
  md: 14,
  lg: 16,
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
          "inline-flex items-center gap-1 font-medium",
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
              "rounded-full",
              size === "sm"
                ? "h-1.5 w-1.5"
                : size === "md"
                  ? "h-2 w-2"
                  : "h-2.5 w-2.5",
              "bg-current",
            )}
          />
        )}

        {Icon && <Icon size={iconSize[size]} />}

        {label}
      </span>
    );
  },
);

Badge.displayName = "Badge";

export default Badge;
