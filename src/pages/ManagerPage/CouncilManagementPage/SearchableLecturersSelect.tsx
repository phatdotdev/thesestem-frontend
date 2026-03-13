import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { type LucideIcon } from "lucide-react";
import { useGetLecturersQuery } from "../../../services/userApi";

type SelectVariant = "default" | "outline" | "filled" | "ghost";
type SelectSize = "xs" | "sm" | "md" | "lg";

interface Props {
  label?: string;
  value?: string;
  error?: string;
  iconLeft?: LucideIcon;
  variant?: SelectVariant;
  size?: SelectSize;
  containerClassName?: string;
  onChange: (id: string) => void;
}

const baseWrapper =
  "relative flex items-center rounded-md transition focus-within:ring-2";

const variantWrapper: Record<SelectVariant, string> = {
  default:
    "border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-blue-500 dark:border-gray-700 dark:bg-gray-900",
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

const SearchableLecturerSelect = ({
  label,
  value,
  error,
  iconLeft: IconLeft,
  variant = "default",
  size = "md",
  containerClassName,
  onChange,
}: Props) => {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const { data: lecturersResponse, isLoading } = useGetLecturersQuery({
    code: keyword,
  });

  const lecturers = lecturersResponse?.data || [];

  const selected = lecturers.find((l: any) => l.id === value);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!containerRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isError = Boolean(error);

  return (
    <div
      ref={containerRef}
      className={clsx("relative w-full space-y-1", containerClassName)}
    >
      {/* Label */}
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

      {/* Wrapper */}
      <div
        className={clsx(
          baseWrapper,
          variantWrapper[variant],
          isError &&
            "border-red-500 focus-within:border-red-500 focus-within:ring-red-500",
        )}
      >
        {/* Icon left */}
        {IconLeft && (
          <span className="px-3 text-gray-400 dark:text-gray-500">
            <IconLeft size={iconSize[size]} />
          </span>
        )}

        {/* Input */}
        <input
          className={clsx(
            "w-full bg-transparent focus:outline-none",
            sizePadding[size],
            sizeWrapper[size],
            "text-gray-900 dark:text-gray-100",
            !IconLeft && "pl-2",
            "pr-2",
          )}
          placeholder="Nhập mã giảng viên..."
          value={
            open
              ? keyword
              : selected
                ? `${selected.fullName} - ${selected.lecturerCode}`
                : ""
          }
          onChange={(e) => {
            setKeyword(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-52 overflow-auto shadow-lg dark:bg-gray-900 dark:border-gray-700">
          {isLoading && (
            <div className="p-2 text-sm text-gray-500">Đang tìm...</div>
          )}

          {!isLoading && lecturers.length === 0 && (
            <div className="p-2 text-sm text-gray-500">
              Không tìm thấy giảng viên
            </div>
          )}

          {lecturers.map((l: any) => (
            <div
              key={l.id}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => {
                onChange(l.id);
                setKeyword("");
                setOpen(false);
              }}
            >
              <div className="text-sm font-medium">{l.fullName}</div>
              <div className="text-xs text-gray-500">{l.lecturerCode}</div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableLecturerSelect;
