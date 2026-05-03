import { useEffect, useRef, useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import {
  useGetCurrentSemesterQuery,
  useGetSemestersQuery,
} from "../../services/semApi";

interface Props {
  value?: string | null;
  size?: "sm" | "md";
  onChange?: (semesterId: string | null) => void;
  showAllOption?: boolean;
  width?: number | string;
  height?: number | string;
}

const SemesterSelecter = ({
  value,
  size = "md",
  onChange,
  showAllOption = false,
  width,
  height,
}: Props) => {
  const { data: semestersResponse, isLoading } = useGetSemestersQuery();
  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();

  const semesters = semestersResponse?.data || [];
  const currentSemester = currentSemesterResponse?.data;

  const [selected, setSelected] = useState<string | null>(value ?? null);
  const [open, setOpen] = useState(false);
  const triggerHeightClass = size === "sm" ? "h-9" : "h-11";

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Giữ hành vi cũ: chỉ auto-select khi không truyền value từ bên ngoài.
    if (value === undefined && !selected && currentSemester && !showAllOption) {
      setSelected(currentSemester.id);
    }
  }, [currentSemester, showAllOption, selected, value]);

  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  // click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (semesterId: string | null) => {
    setSelected(semesterId);
    onChange?.(semesterId);
    setOpen(false);
  };

  const selectedSemester = semesters.find((s: any) => s.id === selected);

  if (isLoading) {
    return (
      <div
        className={`rounded-xl border border-gray-100 bg-gray-100 dark:border-gray-800 dark:bg-gray-800 animate-pulse ${height ? "" : triggerHeightClass}`}
        style={{ width: width ?? "20rem", height }}
      />
    );
  }

  return (
    <div ref={ref} className="relative" style={{ width: width ?? "20rem" }}>
      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        style={{ height }}
        className={`
          flex items-center justify-between gap-2
          ${size === "sm" ? "px-3" : "px-4"}
          ${height ? "py-0" : size === "sm" ? "py-1.5" : "py-2.5"}
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-sm
          cursor-pointer
          hover:border-blue-400
          transition
        `}
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 min-w-0">
          <Calendar size={size === "sm" ? 16 : 20} className="shrink-0" />

          <span className="text-sm mt-0.5 font-medium truncate min-w-0">
            {selectedSemester
              ? `${selectedSemester.name} - ${selectedSemester.year.name}`
              : showAllOption && selected === null
                ? "Tất cả học kỳ"
                : "Chọn học kỳ"}
          </span>
        </div>

        <ChevronDown
          size={size === "sm" ? 16 : 20}
          className={`text-gray-400 transition ${open ? "rotate-180" : ""}`}
        />
      </div>

      {/* DROPDOWN */}
      {open && (
        <div
          className="
          absolute z-20 mt-2 w-full
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          shadow-lg
          overflow-hidden
          "
        >
          {showAllOption && (
            <div
              onClick={() => handleChange(null)}
              className={`
                flex items-center justify-between
                px-4 py-2.5
                text-sm
                cursor-pointer
                transition
                border-b border-gray-100 dark:border-gray-800
                ${
                  selected === null
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              <span className="font-medium">Tất cả học kỳ</span>
            </div>
          )}
          {semesters.map((s: any) => {
            const isCurrent = currentSemester?.id === s.id;

            return (
              <div
                key={s.id}
                onClick={() => handleChange(s.id)}
                className={`
                  flex items-center justify-between
                  px-4 py-2.5
                  text-sm
                  cursor-pointer
                  transition
                  ${
                    selected === s.id
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }
                `}
              >
                <span>
                  {s.name} - {s.year.name}
                </span>

                {isCurrent && (
                  <span
                    className={`text-xs
                    rounded-full
                    bg-emerald-50 text-emerald-600
                    dark:bg-emerald-950/40 dark:text-emerald-300`}
                  >
                    Hiện tại
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SemesterSelecter;
