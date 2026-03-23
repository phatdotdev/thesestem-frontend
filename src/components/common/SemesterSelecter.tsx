import { useEffect, useRef, useState } from "react";
import { ChevronDown, Calendar } from "lucide-react";
import {
  useGetCurrentSemesterQuery,
  useGetSemestersQuery,
} from "../../services/semApi";

interface Props {
  value?: string;
  onChange?: (semesterId: string) => void;
}

const SemesterSelecter = ({ value, onChange }: Props) => {
  const { data: semestersResponse, isLoading } = useGetSemestersQuery();
  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();

  const semesters = semestersResponse?.data || [];
  const currentSemester = currentSemesterResponse?.data;

  const [selected, setSelected] = useState<string | undefined>(value);
  const [open, setOpen] = useState(false);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!selected && currentSemester) {
      setSelected(currentSemester.id);
    }
  }, [currentSemester]);

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

  const handleChange = (semesterId: string) => {
    setSelected(semesterId);
    onChange?.(semesterId);
    setOpen(false);
  };

  const selectedSemester = semesters.find((s: any) => s.id === selected);

  if (isLoading) {
    return (
      <div className="h-10 w-56 rounded-xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
    );
  }

  return (
    <div ref={ref} className="relative w-60">
      {/* SELECT BOX */}
      <div
        onClick={() => setOpen(!open)}
        className="
        flex items-center justify-center gap-2
        px-4 py-2.5
        rounded-xl
        border border-gray-200 dark:border-gray-700
        bg-white dark:bg-gray-900
        shadow-sm
        cursor-pointer
        hover:border-blue-400
        transition
        "
      >
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
          <Calendar size={16} />

          <span className="text-sm font-medium">
            {selectedSemester
              ? `${selectedSemester.name} - ${selectedSemester.year.name}`
              : "Chọn học kỳ"}
          </span>
        </div>

        <ChevronDown
          size={16}
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
                    className="
                    text-xs px-2 py-0.5
                    rounded-full
                    bg-emerald-50 text-emerald-600
                    dark:bg-emerald-950/40 dark:text-emerald-300
                    "
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
