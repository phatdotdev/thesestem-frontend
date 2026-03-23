import { Users, FileText } from "lucide-react";
import type { GroupResponse } from "../../../types/group";

interface GroupCardProps {
  group: GroupResponse;
  onView: (group: GroupResponse) => void;
  onEdit: (group: GroupResponse) => void;
  onDelete: (group: GroupResponse) => void;
}

const GroupCard = ({ group, onView }: GroupCardProps) => {
  return (
    <div
      className="
      group
      bg-white dark:bg-gray-900
      border border-gray-200 dark:border-gray-700
      rounded-2xl overflow-hidden
      shadow-sm hover:shadow-lg
      transition-all duration-300
      hover:-translate-y-0.5
      "
    >
      {/* HEADER */}
      <div
        className="
        bg-gradient-to-r 
        from-slate-100 to-gray-50
        dark:from-gray-800 dark:to-gray-900
        px-5 py-4 flex justify-between items-start
        "
      >
        <div className="flex gap-3 items-start">
          <div
            className="
            h-9 w-9 rounded-lg 
            bg-white dark:bg-gray-800
            border border-gray-200 dark:border-gray-700
            flex items-center justify-center
            text-gray-600 dark:text-gray-300
            "
          >
            <Users size={16} />
          </div>

          <div>
            <h2
              className="
              font-semibold 
              text-gray-800 dark:text-gray-100
              hover:text-blue-600 dark:hover:text-blue-400
              cursor-pointer transition
              "
              onClick={() => onView(group)}
            >
              {group.name}
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {group?.mentor?.fullName || "Chưa có giảng viên"}
            </p>
          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="px-5 py-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {group.description || "Không có mô tả"}
        </p>
      </div>

      {/* FOOTER */}
      <div
        className="
        px-5 py-3 
        border-t border-gray-100 dark:border-gray-800
        flex items-center justify-between
        text-xs text-gray-500 dark:text-gray-400
        "
      >
        <div className="flex items-center gap-1">
          <FileText size={14} />
          <span>{group.id.slice(0, 8)}</span>
        </div>

        <div className="flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Users size={14} />
          <span>{group.students?.length || 0}</span>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
