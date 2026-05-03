import { useEffect, useRef, useState } from "react";
import { ChevronDown, Briefcase } from "lucide-react"; // Thay icon Calendar bằng Briefcase cho Program
import { useGetProgramsQuery } from "../../services/orgApi";

interface Props {
  form?: { collegeId?: string; facultyId?: string; departmentId?: string };
  value?: string | null;
  size?: "sm" | "md";
  onChange?: (programId: string | null) => void;
  showAllOption?: boolean;
  width?: number | string;
  height?: number | string;
}

const ProgramSelecter = ({
  form,
  value,
  size = "md",
  onChange,
  showAllOption = false,
  width,
  height,
}: Props) => {
  const { data: programsResponse, isLoading } = useGetProgramsQuery(form);
  const programs = programsResponse?.data || [];

  const [selected, setSelected] = useState<string | null>(value ?? null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const triggerHeightClass = size === "sm" ? "h-9" : "h-11";

  useEffect(() => {
    setSelected(value ?? null);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (programId: string | null) => {
    setSelected(programId);
    onChange?.(programId);
    setOpen(false);
  };

  const selectedProgram = programs.find((p: any) => p.id === selected);

  // Skeleton Loading
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
          <Briefcase
            size={size === "sm" ? 16 : 20}
            className="text-gray-500 dark:text-gray-400"
          />

          <span className="text-sm mt-0.5 font-medium truncate min-w-0">
            {selectedProgram
              ? selectedProgram.name
              : showAllOption && selected === null
                ? "Tất cả chương trình"
                : "Chọn chương trình"}
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
          max-h-60 overflow-y-auto
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
              <span className="font-medium">Tất cả chương trình</span>
            </div>
          )}

          {programs.map((p: any) => (
            <div
              key={p.id}
              onClick={() => handleChange(p.id)}
              className={`
                flex items-center justify-between
                px-4 py-2.5
                text-sm
                cursor-pointer
                transition
                ${
                  selected === p.id
                    ? "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                }
              `}
            >
              <span className="truncate">{p.name}</span>

              {/* Bạn có thể thêm badge hiển thị mã chương trình nếu cần */}
              {p.code && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 ml-2">
                  {p.code}
                </span>
              )}
            </div>
          ))}

          {programs.length === 0 && !showAllOption && (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              Không có dữ liệu
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgramSelecter;
