import * as React from "react";
import clsx from "clsx";
import { type LucideIcon, Eye, EyeOff } from "lucide-react";
import type { IconType } from "react-icons";

type InputVariant = "default" | "outline" | "filled" | "ghost";
type LabelMode = "default" | "floating";
type InputSize = "xs" | "sm" | "md" | "lg";

interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> {
  label?: string;
  error?: string;
  iconLeft?: LucideIcon | IconType;
  iconRight?: LucideIcon | IconType;
  variant?: InputVariant;
  labelMode?: LabelMode;
  size?: InputSize;
  containerClassName?: string;
}

const baseWrapper =
  "relative flex items-center rounded-md transition focus-within:ring-2";

const variantWrapper: Record<InputVariant, string> = {
  default:
    "border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900",
  outline:
    "border-2 border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-900",
  filled:
    "border border-transparent bg-gray-100 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:bg-gray-800 dark:focus-within:bg-gray-900",
  ghost:
    "border border-transparent bg-transparent hover:bg-gray-100 focus-within:bg-white focus-within:ring-blue-500 dark:hover:bg-gray-800 dark:focus-within:bg-gray-900",
};

/* ===== SIZE CONFIG ===== */

const sizeText: Record<InputSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

const sizePadding: Record<InputSize, string> = {
  xs: "py-1",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
};

const iconSize: Record<InputSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
};

const labelSize: Record<InputSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      iconLeft: IconLeft,
      iconRight: IconRight,
      variant = "default",
      labelMode = "default",
      size = "md",
      className,
      containerClassName,
      value,
      onChange,
      type = "text",
      ...rest
    },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const finalType = isPassword ? (showPassword ? "text" : "password") : type;

    const isError = Boolean(error);

    const safeValue = value !== undefined && value !== null ? value : "";

    const autoReadOnly = value !== undefined && !onChange;

    const hasValue = safeValue !== "";

    return (
      <div className={clsx("relative w-full space-y-1", containerClassName)}>
        {/* ===== Default Label ===== */}
        {label && labelMode === "default" && (
          <label
            className={clsx(
              "font-medium",
              labelSize[size],
              isError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-200",
            )}
          >
            {label}
          </label>
        )}

        {/* ===== Wrapper ===== */}
        <div
          className={clsx(
            baseWrapper,
            variantWrapper[variant],
            labelMode === "floating" && "pt-5",
            isError &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
          )}
        >
          {/* ===== Floating Label ===== */}
          {label && labelMode === "floating" && (
            <label
              className={clsx(
                "absolute left-3 px-1 transition-all duration-200 pointer-events-none bg-white dark:bg-gray-900",
                hasValue
                  ? "top-1 text-xs text-blue-600 font-bold"
                  : "top-1/2 -translate-y-1/2 text-sm text-gray-400",
              )}
            >
              {label}
            </label>
          )}

          {/* ===== Left Icon ===== */}
          {IconLeft && (
            <span className="px-3 text-gray-400 dark:text-gray-500">
              <IconLeft size={iconSize[size]} />
            </span>
          )}

          {/* ===== Input ===== */}
          <input
            ref={ref}
            type={finalType}
            value={safeValue}
            onChange={onChange}
            readOnly={autoReadOnly}
            className={clsx(
              "w-full bg-transparent",
              sizePadding[size],
              sizeText[size],
              "text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:outline-none",
              !IconLeft && "pl-3",
              !IconRight && !isPassword && "pr-3",
              className,
            )}
            {...rest}
          />

          {/* ===== Right Area ===== */}
          {isPassword ? (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="px-3 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeOff size={iconSize[size]} />
              ) : (
                <Eye size={iconSize[size]} />
              )}
            </button>
          ) : (
            IconRight && (
              <span className="px-3 text-gray-400 dark:text-gray-500">
                <IconRight size={iconSize[size]} />
              </span>
            )
          )}
        </div>

        {/* ===== Error ===== */}
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Input.displayName = "Input";
export default Input;
