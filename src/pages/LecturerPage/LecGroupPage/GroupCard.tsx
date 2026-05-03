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
            bg-blue-50 dark:bg-blue-950/30
            border border-blue-100 dark:border-blue-900/50
            flex items-center justify-center
            text-blue-600 dark:text-blue-300
            shrink-0
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

            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {group.description ? "Có mô tả nhóm" : "Chưa có mô tả"}
            </p>
          </div>
        </div>

        <div className="flex gap-1.5 shrink-0">
          <Button
            icon={Pencil}
            variant="ghost"
            size="xs"
            onClick={() => onEdit(group)}
            title="Sửa nhóm"
            aria-label="Sửa nhóm"
          />
          <Button
            icon={Trash}
            variant="soft-danger"
            size="xs"
            onClick={() => onDelete(group)}
            title="Xóa nhóm"
            aria-label="Xóa nhóm"
          />
        </div>
      </div>

      {/* BODY */}
      <div className="px-5 py-2 space-y-3">
        <p className="text-sm leading-6 text-gray-600 dark:text-gray-300 line-clamp-3 min-h-[4.5rem]">
          {group.description || "Không có mô tả"}
        </p>
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
        <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 px-2.5 py-1 text-xs font-medium">
          {studentCount} sinh viên
        </span>

        <button
          onClick={() => onView(group)}
          className="inline-flex items-center gap-1.5 rounded-full bg-white dark:bg-gray-900 px-3 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-300 border border-blue-100 dark:border-blue-900/50 hover:border-blue-200 dark:hover:border-blue-800 hover:bg-blue-50/80 dark:hover:bg-blue-950/30 transition-colors"
        >
          <Eye size={13} />
          Xem chi tiết
        </button>
      </div>
    </div>
  );
};

export default GroupCard;
