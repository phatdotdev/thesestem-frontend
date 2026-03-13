import * as React from "react";
import clsx from "clsx";
import type { LucideIcon } from "lucide-react";

type TextareaVariant = "default" | "outline" | "filled" | "ghost";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  variant?: TextareaVariant;
  containerClassName?: string;
}

const baseWrapper = "relative flex rounded-md transition focus-within:ring-2";

const variantWrapper: Record<TextareaVariant, string> = {
  default:
    "border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900",
  outline:
    "border-2 border-gray-300 bg-white focus-within:border-blue-600 focus-within:ring-blue-500 dark:border-gray-600 dark:bg-gray-900",
  filled:
    "border border-transparent bg-gray-100 focus-within:bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:bg-gray-800 dark:focus-within:bg-gray-900",
  ghost:
    "border border-transparent bg-transparent hover:bg-gray-100 focus-within:bg-white focus-within:ring-blue-500 dark:hover:bg-gray-800 dark:focus-within:bg-gray-900",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      label,
      error,
      iconLeft: IconLeft,
      iconRight: IconRight,
      variant = "default",
      className,
      containerClassName,
      ...props
    },
    ref,
  ) => {
    const isError = Boolean(error);

    return (
      <div className={clsx("w-full space-y-1", containerClassName)}>
        {/* Label */}
        {label && (
          <label
            className={clsx(
              "text-sm font-medium",
              isError
                ? "text-red-600 dark:text-red-400"
                : "text-gray-700 dark:text-gray-200",
            )}
          >
            {label}
          </label>
        )}

        {/* Wrapper */}
        <div
          className={clsx(
            baseWrapper,
            variantWrapper[variant],
            isError &&
              "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
          )}
        >
          {/* Left icon */}
          {IconLeft && (
            <span className="px-3 pt-2 text-gray-400 dark:text-gray-500">
              <IconLeft size={18} />
            </span>
          )}

          {/* Textarea */}
          <textarea
            ref={ref}
            className={clsx(
              "w-full bg-transparent py-2 text-sm resize-none",
              "text-gray-900 dark:text-gray-100",
              "placeholder:text-gray-400 dark:placeholder:text-gray-500",
              "focus:outline-none",
              !IconLeft && "pl-2",
              !IconRight && "pr-2",
              className,
            )}
            {...props}
          />

          {/* Right icon */}
          {IconRight && (
            <span className="px-3 pt-2 text-gray-400 dark:text-gray-500">
              <IconRight size={18} />
            </span>
          )}
        </div>

        {/* Error */}
        {error && <p className="text-xs font-medium text-red-500">{error}</p>}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
export default Textarea;
