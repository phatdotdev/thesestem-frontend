import { Play, Edit, Trash2, CalendarRange } from "lucide-react";
import Button from "../../../components/UI/Button";
import { formatDateVN } from "../../../utils/formatters";

type SemesterRowProps = {
  semester: {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    status: string;
  };
  onEdit: (semester: any) => void;
  onDelete: (id: string) => void;
  onActivate: (id: string, status: string) => void;
};

/* ── Status config ── */
const statusConfig: Record<
  string,
  { label: string; bar: string; badge: string; badgeDark?: string }
> = {
  ACTIVE: {
    label: "Đang hoạt động",
    bar: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-600 border-emerald-200",
    badgeDark: "bg-emerald-900 text-emerald-400 border-emerald-700",
  },
  INACTIVE: {
    label: "Chưa kích hoạt",
    bar: "bg-gray-300",
    badge: "bg-gray-100 text-gray-500 border-gray-200",
    badgeDark: "bg-gray-800 text-gray-300 border-gray-700",
  },
  CLOSED: {
    label: "Đã đóng",
    bar: "bg-red-400",
    badge: "bg-red-50 text-red-500 border-red-200",
    badgeDark: "bg-red-900 text-red-400 border-red-700",
  },
};

const SemesterRow = ({
  semester,
  onEdit,
  onDelete,
  onActivate,
}: SemesterRowProps) => {
  const s = statusConfig[semester.status] ?? statusConfig["INACTIVE"];

  return (
    <div className="group relative rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-150">
      {/* top status bar */}
      <div className={`h-0.5 w-full ${s.bar}`} />

      <div className="flex items-center justify-between gap-4 px-4 py-3">
        {/* LEFT */}
        <div className="flex items-start gap-3 min-w-0">
          {/* icon */}
          <div className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-gray-400 dark:text-gray-300">
            <CalendarRange size={15} />
          </div>

          {/* info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                {semester.name}
              </span>
              <span
                className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${
                  s.badge
                } dark:${s.badgeDark}`}
              >
                {s.label}
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-300 mt-0.5">
              {formatDateVN(semester.startDate)} →{" "}
              {formatDateVN(semester.endDate)}
            </p>
          </div>
        </div>

        {/* RIGHT: actions — hidden until hover */}
        <div className="flex items-center gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <Button
            icon={Play}
            size="xs"
            variant="soft-success"
            onClick={() => onActivate(semester.id, "ACTIVE")}
          />
          <Button
            icon={Edit}
            size="xs"
            variant="ghost"
            onClick={() => onEdit(semester)}
          />
          <Button
            icon={Trash2}
            size="xs"
            variant="soft-danger"
            onClick={() => onDelete(semester.id)}
          />
        </div>
      </div>
    </div>
  );
};

export default SemesterRow;
