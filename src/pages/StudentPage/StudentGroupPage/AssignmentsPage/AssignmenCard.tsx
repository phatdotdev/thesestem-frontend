import { CalendarClock, ChevronRight, ClipboardList, Eye } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import type { AssignmentResponse } from "../../../../types/group";
import { formatDateTimeVN } from "../../../../utils/formatters";

interface Props {
  assignment: AssignmentResponse;
}

const AssignmentCard = ({ assignment }: Props) => {
  const navigate = useNavigate();
  const { ["group-id"]: groupId } = useParams();
  const isOpen = assignment.status === "OPEN";
  const isOverdue = new Date(assignment.deadline) < new Date() && isOpen;

  return (
    <div className="group flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-blue-200 hover:shadow-md dark:border-gray-800 dark:bg-gray-900/50">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
          <ClipboardList size={20} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="line-clamp-2 text-sm font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-100">
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

      <div
        className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
          isOverdue
            ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
            : "bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
        }`}
      >
        <CalendarClock size={16} />
        <span className="font-medium">
          Hạn nộp: {formatDateTimeVN(assignment.deadline)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-end gap-2 pt-2">
        <Button
          icon={Eye}
          label="Xem chi tiết"
          size="sm"
          variant="primary"
          className="rounded-xl shadow-sm"
          onClick={() => {
            if (!groupId) return;
            navigate(`${assignment.id}`);
          }}
        />
        <Button
          icon={ChevronRight}
          size="sm"
          variant="ghost"
          onClick={() => {
            if (!groupId) return;
            navigate(`${assignment.id}`);
          }}
        />
      </div>
    </div>
  );
};

export default AssignmentCard;
