import { User, Building2, MessageSquare } from "lucide-react";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import type { RegisterResposne } from "../../../types/register";

interface RegisterCardProps {
  register: RegisterResposne;
  getStatusVariant: (status: string) => any;
  onView?: (register: RegisterResposne) => void;
  onCancel?: (register: RegisterResposne) => void;
}

const RegisterCard = ({
  register,
  getStatusVariant,
  onView,
  onCancel,
}: RegisterCardProps) => {
  const mentor = register.mentor;
  const { status, message, response } = register;
  const hasResponse = Boolean(response?.trim());

  const unit =
    mentor.department?.name ||
    mentor.faculty?.name ||
    mentor.college?.name ||
    "Chưa cập nhật";

  const statusConfig: Record<
    string,
    {
      label: string;
      variant: "warning" | "success" | "danger" | "secondary";
      borderClass: string;
      accentClass: string;
    }
  > = {
    PENDING: {
      label: "Chờ duyệt",
      variant: "warning",
      borderClass:
        "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
      accentClass: "bg-gray-300/40 dark:bg-gray-700/70",
    },
    ACCEPTED: {
      label: "Đã chấp nhận",
      variant: "success",
      borderClass:
        "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
      accentClass: "bg-gray-300/40 dark:bg-gray-700/70",
    },
    REJECTED: {
      label: "Đã từ chối",
      variant: "danger",
      borderClass:
        "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
      accentClass: "bg-gray-300/40 dark:bg-gray-700/70",
    },
    CANCELLED: {
      label: "Đã hủy",
      variant: "secondary",
      borderClass:
        "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
      accentClass: "bg-gray-300/40 dark:bg-gray-700/70",
    },
  };

  const statusInfo = statusConfig[status] ?? {
    label: status,
    variant: getStatusVariant(status) ?? "warning",
    borderClass:
      "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600",
    accentClass: "bg-gray-300/40 dark:bg-gray-700/70",
  };

  return (
    <div
      className={`
        relative rounded-2xl border bg-white dark:bg-gray-900
        p-4 transition-all duration-200
        hover:-translate-y-0.5 hover:shadow-md dark:hover:shadow-none
        ${statusInfo.borderClass}
      `}
    >
      {/* Status accent strip */}
      <div
        className={`
          pointer-events-none absolute inset-x-0 top-0 h-1
          rounded-t-2xl ${statusInfo.accentClass}
        `}
      />

      {/* Header: avatar + name + status badge */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="
              h-10 w-10 rounded-xl shrink-0 overflow-hidden
              bg-gray-100 dark:bg-gray-800
              border border-gray-200 dark:border-gray-700
              flex items-center justify-center
              text-gray-600 dark:text-gray-300
              text-sm font-semibold
            "
          >
            {mentor.avatarUrl ? (
              <img
                src={mentor.avatarUrl}
                alt={mentor.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              mentor.fullName?.charAt(0) || <User size={18} />
            )}
          </div>

          <div className="min-w-0 leading-tight">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
              {mentor.fullName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {mentor.email}
            </p>
          </div>
        </div>

        <Badge
          label={statusInfo.label}
          variant={statusInfo.variant}
          size="sm"
          dot
        />
      </div>

      {/* Info: mã GV + đơn vị */}
      <div className="mt-3 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Building2 size={13} className="shrink-0" />
        <span className="truncate">
          {mentor.lecturerCode} • {unit}
        </span>
      </div>

      {/* Lời nhắn sinh viên gửi */}
      {message && !hasResponse && (
        <div className="mt-3 flex items-start gap-2 rounded-lg bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700/60 px-3 py-2.5">
          <MessageSquare
            size={13}
            className="mt-0.5 shrink-0 text-gray-400 dark:text-gray-500"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 italic line-clamp-3">
            {message}
          </p>
        </div>
      )}

      {/* Phản hồi từ giảng viên — chỉ hiện khi có nội dung */}
      {hasResponse && (
        <div className="mt-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/70 px-3 py-2.5">
          <p className="text-[11px] font-medium text-gray-700 dark:text-gray-300">
            Phản hồi từ giảng viên
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
            {response}
          </p>
        </div>
      )}

      {/* Footer actions */}
      <div className="mt-4 flex items-center justify-between gap-2 border-t border-gray-100 dark:border-gray-800 pt-3">
        {/* Gợi ý theo trạng thái */}
        <div className="text-xs text-gray-400 dark:text-gray-500">
          {status === "REJECTED" && "Bạn có thể chọn giảng viên khác"}
          {status === "CANCELLED" && "Yêu cầu đã bị hủy"}
        </div>

        <div className="flex items-center gap-2">
          <Button
            label="Chi tiết"
            size="sm"
            variant="outline-primary"
            onClick={() => onView?.(register)}
          />

          {status === "PENDING" && (
            <Button
              label="Hủy yêu cầu"
              size="sm"
              variant="danger"
              onClick={() => onCancel?.(register)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterCard;
