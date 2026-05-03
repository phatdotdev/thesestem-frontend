import { CalendarClock, Edit, Eye, Trash, ClipboardList } from "lucide-react";
import Badge from "../../../../components/UI/Badge";
import type { AssignmentResponse } from "../../../../types/group";
import Button from "../../../../components/UI/Button";
import { formatDateTimeVN } from "../../../../utils/formatters";

const AssignmentCard = ({
  assignment,
  onViewDetails,
  onEdit,
  onDelete,
}: {
  assignment: AssignmentResponse;
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const isOpen = assignment.status === "OPEN";
  const isOverdue = new Date(assignment.deadline) < new Date();

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50">
      {/* 1. HEADER: ICON + (TÊN & MÔ TẢ) */}
      <div className="flex items-start gap-3">
        {/* Icon đại diện nhiệm vụ */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <ClipboardList size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="font-bold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 transition-colors line-clamp-2 text-sm">
              {assignment.name}
            </h3>
            <Badge
              label={isOpen ? "Đang mở" : "Đã đóng"}
              variant={isOpen ? "success" : "danger"}
              size="sm"
              dot
            />
          </div>
          {assignment.description && (
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-gray-500 dark:text-gray-400">
              {assignment.description}
            </p>
          )}
        </div>
      </div>

      {/* 2. HẠN NỘP */}
      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          isOverdue && isOpen
            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        <CalendarClock size={16} />
        <span className="font-medium">
          Hạn nộp: {formatDateTimeVN(assignment.deadline)}
        </span>
      </div>

      {/* 3. ACTIONS: XEM, SỬA, XÓA */}
      <div className="mt-auto flex items-center justify-between gap-2 pt-2">
        {/* Nút xem chi tiết chính */}
        <Button
          icon={Eye}
          label="Xem chi tiết"
          size="sm"
          variant="primary"
          className="flex-1 rounded-xl shadow-sm"
          onClick={onViewDetails}
        />

        {/* Nhóm nút phụ */}
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            title="Sửa nhiệm vụ"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-all dark:hover:bg-amber-900/20"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={onDelete}
            title="Xóa nhiệm vụ"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all dark:hover:bg-red-900/20"
          >
            <Trash size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
