import { CalendarClock, CheckCircle, AlertCircle } from "lucide-react";
import clsx from "clsx";

interface Props {
  assignment: {
    title: string;
    subject: string;
    deadline: string;
    status: "pending" | "submitted" | "late";
  };
}

const statusConfig = {
  pending: {
    label: "Chưa nộp",
    color: "text-yellow-600",
    icon: AlertCircle,
  },
  submitted: {
    label: "Đã nộp",
    color: "text-green-600",
    icon: CheckCircle,
  },
  late: {
    label: "Quá hạn",
    color: "text-red-600",
    icon: AlertCircle,
  },
};

const AssignmentCard = ({ assignment }: Props) => {
  const status = statusConfig[assignment.status];
  const StatusIcon = status.icon;

  return (
    <div
      className="
        flex items-center justify-between
        rounded-xl border bg-white p-4
        shadow-sm hover:shadow-md transition
        dark:border-gray-800 dark:bg-gray-900
      "
    >
      <div>
        <h3 className="font-semibold">{assignment.title}</h3>
        <p className="text-sm text-gray-500">{assignment.subject}</p>

        <div className="mt-2 flex items-center gap-2 text-sm text-gray-600">
          <CalendarClock className="h-4 w-4" />
          Deadline: {assignment.deadline}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={clsx(
            "flex items-center gap-1 text-sm font-medium",
            status.color,
          )}
        >
          <StatusIcon className="h-4 w-4" />
          {status.label}
        </span>

        <button
          className="
            rounded-lg border px-3 py-1 text-sm
            hover:bg-gray-100 dark:hover:bg-gray-800
          "
        >
          Xem
        </button>
      </div>
    </div>
  );
};

export default AssignmentCard;
