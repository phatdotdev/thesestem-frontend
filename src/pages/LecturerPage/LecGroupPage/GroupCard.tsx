import { Users, Eye, Pencil, Trash } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { GroupResponse } from "../../../types/group";

interface GroupCardProps {
  group: GroupResponse;
  onView: (group: GroupResponse) => void;
  onEdit: (group: GroupResponse) => void;
  onDelete: (group: GroupResponse) => void;
}

const GroupCard = ({ group, onView, onEdit, onDelete }: GroupCardProps) => {
  const studentCount = group.students?.length ?? 0;

  return (
    <div className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-md dark:hover:shadow-blue-950/30 transition-all duration-200">
      {/* Top accent */}
      <div className="h-1 bg-gradient-to-r from-blue-400 to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />

      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          {/* Icon + Title */}
          <div className="flex items-start gap-3 min-w-0">
            <div className="shrink-0 h-10 w-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 dark:text-blue-400">
              <Users size={18} />
            </div>

            <div className="min-w-0">
              <h2
                onClick={() => onView(group)}
                className="font-semibold text-sm text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors cursor-pointer leading-snug truncate"
              >
                {group.name}
              </h2>

              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                {group.description || "Không có mô tả"}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 shrink-0">
            <Button
              icon={Pencil}
              variant="ghost"
              size="xs"
              onClick={() => onEdit(group)}
            />
            <Button
              icon={Trash}
              variant="soft-danger"
              size="xs"
              onClick={() => onDelete(group)}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-2">
          {/* Student count */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <Users size={13} />
            <span>{studentCount} sinh viên</span>
          </div>

          {/* View button */}
          <button
            onClick={() => onView(group)}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <Eye size={13} />
            Xem chi tiết
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupCard;
