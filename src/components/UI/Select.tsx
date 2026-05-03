import * as React from "react";
import clsx from "clsx";
import { type LucideIcon, ChevronDown } from "lucide-react";

type SelectVariant = "default" | "outline" | "filled" | "ghost";
type SelectSize = "xs" | "sm" | "md" | "lg";

interface Option {
  label: string;
  value: string | number;
}

interface SelectProps extends Omit<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  "size"
> {
  label?: string;
  error?: string;
  iconLeft?: LucideIcon;
  options: Option[];
  variant?: SelectVariant;
  size?: SelectSize;
  containerClassName?: string;
}

const baseWrapper =
  "relative flex items-center rounded-md transition focus-within:ring-2";

const variantWrapper: Record<SelectVariant, string> = {
  default:
    "border border-gray-300 bg-white hover:border-gray-400 focus-within:border-blue-500 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:hover:border-gray-500",

  outline:
    "border-2 border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-900",

  filled:
    "border border-transparent bg-gray-100 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:bg-gray-800 dark:focus-within:bg-gray-900",

  ghost:
    "border border-transparent bg-transparent hover:bg-gray-100 focus-within:bg-white focus-within:ring-blue-500 dark:hover:bg-gray-800 dark:focus-within:bg-gray-900",
};

const sizeWrapper: Record<SelectSize, string> = {
  xs: "text-xs",
  sm: "text-sm",
  md: "text-sm",
  lg: "text-base",
};

const sizePadding: Record<SelectSize, string> = {
  xs: "py-1",
  sm: "py-1.5",
  md: "py-2",
  lg: "py-2.5",
};

const iconSize: Record<SelectSize, number> = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      label,
      error,
      iconLeft: IconLeft,
      options,
      variant = "default",
      size = "md",
      className,
      containerClassName,
      disabled,
      ...props
    },
    ref,
  ) => {
    const isError = Boolean(error);

    return (
      <div className={clsx("w-full space-y-1", containerClassName)}>
        {/* LABEL */}
        {label && (
          <label
            className={clsx(
              "font-medium",
              sizeWrapper[size],
              isError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-200",
            )}
          >
            {label}
          </label>
        )}

        {/* WRAPPER */}
        <div
          className={clsx(
            baseWrapper,
            variantWrapper[variant],
            disabled &&
              "opacity-60 cursor-not-allowed bg-gray-100 dark:bg-gray-800",
            isError &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
          )}
        >
          {/* LEFT ICON */}
          {IconLeft && (
            <span className="px-3 text-gray-400 dark:text-gray-500">
              <IconLeft size={iconSize[size]} />
            </span>
          )}

          {/* SELECT */}
          <select
            ref={ref}
            disabled={disabled}
            className={clsx(
              "w-full appearance-none bg-transparent",
              sizePadding[size],
              sizeWrapper[size],
              "text-gray-900 dark:text-gray-100",
              "focus:outline-none",
              "disabled:cursor-not-allowed",
              !IconLeft && "pl-3",
              "pr-8",
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100"
              >
                {opt.label}
              </option>
            ))}
          </select>

          {/* ARROW */}
          <div className="absolute right-2 pointer-events-none text-gray-400 dark:text-gray-500">
            <ChevronDown size={16} />
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  },
);

Select.displayName = "Select";

export default Select;
