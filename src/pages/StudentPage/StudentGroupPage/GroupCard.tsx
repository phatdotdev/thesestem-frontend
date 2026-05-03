import { Users, FileText } from "lucide-react";
import type { GroupResponse } from "../../../types/group";

interface GroupCardProps {
  group: GroupResponse;
  onView: (group: GroupResponse) => void;
  onEdit: (group: GroupResponse) => void;
  onDelete: (group: GroupResponse) => void;
}

const GroupCard = ({ group, onView }: GroupCardProps) => {
  const studentCount = group.students?.length || 0;

  return (
    <div
      className="
      group
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-3xl overflow-hidden
      shadow-sm hover:shadow-xl
      transition-all duration-300
      hover:-translate-y-1
      "
    >
      {/* HEADER */}
      <div
        className="
        bg-gradient-to-br 
        from-slate-50 via-white to-gray-50
        dark:from-gray-800 dark:via-gray-900 dark:to-gray-900
        px-5 py-4 flex justify-between items-start gap-3
        "
      >
        <div className="flex gap-3 items-start min-w-0">
          <div
            className="
            h-11 w-11 rounded-2xl 
            bg-sky-50 dark:bg-sky-950/30
            border border-sky-100 dark:border-sky-900/50
            flex items-center justify-center
            text-sky-600 dark:text-sky-300
            "
          >
            <Users size={18} />
          </div>

          <div className="min-w-0">
            <h2
              className="
              text-base font-semibold leading-6
              text-gray-900 dark:text-gray-100
              hover:text-blue-600 dark:hover:text-blue-300
              cursor-pointer transition truncate
              "
              onClick={() => onView(group)}
            >
              {group.name}
            </h2>

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {group?.mentor?.fullName || "Chưa có giảng viên"}
            </p>
          </div>
        </div>

        <span className="inline-flex shrink-0 items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 px-2.5 py-1 text-[11px] font-medium">
          {studentCount} thành viên
        </span>
      </div>

      {/* BODY */}
      <div className="px-5 py-4 space-y-3">
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
          {group.description || "Không có mô tả"}
        </p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2.5 py-1 text-xs font-medium">
            Mã nhóm: {group.id.slice(0, 8)}
          </span>
          <span className="inline-flex items-center rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300 px-2.5 py-1 text-xs font-medium">
            {group.mentor?.fullName || "Chưa gán giảng viên"}
          </span>
        </div>
      </div>

      {/* FOOTER */}
      <div
        className="
        px-5 py-3 
        border-t border-gray-100 dark:border-gray-800
        flex items-center justify-between
        bg-gray-50/70 dark:bg-gray-800/40
        "
      >
        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
          <FileText size={14} />
          <span>Nhóm đang hoạt động</span>
        </div>

        <button
          onClick={() => onView(group)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/80 dark:hover:bg-blue-950/30 transition-colors"
        >
          <Users size={13} />
          Xem nhóm
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
