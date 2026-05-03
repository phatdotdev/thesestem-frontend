import {
  Mail,
  BookOpen,
  UserCheck,
  UserX,
  UserPlus,
  Info,
  XCircle,
} from "lucide-react";
import Badge from "../../../components/UI/Badge";
import Button from "../../../components/UI/Button";
import type { RegisterResposne } from "../../../types/register";

interface RegisterCardProps {
  register: RegisterResposne;
  onAccept?: (register: RegisterResposne) => void;
  onReject?: (register: RegisterResposne) => void;
  onAdd?: (register: RegisterResposne) => void;
  added?: boolean;
}

const statusConfig: Record<string, { label: string; variant: any }> = {
  PENDING: { label: "Đang chờ", variant: "warning" },
  ACCEPTED: { label: "Đã duyệt", variant: "success" },
  REJECTED: { label: "Từ chối", variant: "danger" },
  CANCELLED: { label: "Đã hủy", variant: "secondary" },
};

const avatarColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: "bg-blue-50 dark:bg-blue-900/30", text: "text-blue-500" },
  ACCEPTED: {
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
    text: "text-emerald-600",
  },
  REJECTED: { bg: "bg-red-50 dark:bg-red-900/20", text: "text-red-400" },
  CANCELLED: { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-400" },
};

const RegisterCard = ({
  register,
  onAccept,
  onReject,
  onAdd,
  added,
}: RegisterCardProps) => {
  const { student, message, status } = register;
  const info = statusConfig[status] ?? statusConfig.PENDING;
  const avatar = avatarColors[status] ?? avatarColors.PENDING;
  const isClosed = status === "REJECTED" || status === "CANCELLED";

  return (
    <div
      className={`flex flex-col rounded-2xl border border-gray-200 bg-white p-[18px] gap-3.5 dark:border-gray-800 dark:bg-gray-900 transition-opacity ${isClosed ? "opacity-60" : ""}`}
    >
      {/* Header: avatar + tên + badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-base font-medium ${avatar.bg} ${avatar.text}`}
          >
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt=""
                className="h-full w-full rounded-xl object-cover"
              />
            ) : (
              student.fullName?.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {student.fullName}
            </p>
            <p className="text-[11px] font-mono text-gray-400 dark:text-gray-500 mt-0.5">
              {student.studentCode}
            </p>
          </div>
        </div>
        <Badge label={info.label} variant={info.variant} size="sm" dot />
      </div>

      {/* Thông tin */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
          <Mail size={12} className="shrink-0 opacity-50" />
          <span className="truncate">{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-gray-500 dark:text-gray-400">
          <BookOpen size={12} className="shrink-0 opacity-50" />
          <span className="truncate">
            {student.program?.name}
            {student.course?.name && (
              <span className="text-gray-300 dark:text-gray-600 mx-1">·</span>
            )}
            {student.course?.name}
          </span>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="rounded-lg bg-gray-50 dark:bg-gray-800/60 border-l-2 border-gray-200 dark:border-gray-700 px-3 py-2">
          <p className="text-[12px] italic text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            "{message}"
          </p>
        </div>
      )}

      {/* Divider */}
      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* Actions */}
      <div className="flex items-center gap-2">
        {status === "PENDING" && (
          <>
            <Button
              label="Từ chối"
              variant="ghost"
              icon={UserX}
              size="sm"
              className="flex-1 text-red-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/30"
              onClick={() => onReject?.(register)}
            />
            <Button
              label="Chấp nhận"
              variant="primary"
              icon={UserCheck}
              size="sm"
              className="flex-1"
              onClick={() => onAccept?.(register)}
            />
          </>
        )}

        {status === "ACCEPTED" &&
          (added ? (
            <div className="flex w-full items-center justify-center gap-1.5 py-1 text-[12px] font-medium text-emerald-500">
              <UserCheck size={13} /> Đã vào nhóm
            </div>
          ) : (
            <Button
              label="Thêm vào nhóm"
              icon={UserPlus}
              size="sm"
              variant="primary"
              className="w-full"
              onClick={() => onAdd?.(register)}
            />
          ))}

        {status === "REJECTED" && (
          <div className="flex w-full items-center justify-center gap-1.5 py-1 text-[12px] text-gray-400">
            <XCircle size={13} /> Yêu cầu đã bị từ chối
          </div>
        )}

        {status === "CANCELLED" && (
          <div className="flex w-full items-center justify-center gap-1.5 py-1 text-[12px] text-gray-400">
            <Info size={13} /> Sinh viên đã rút yêu cầu
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterCard;
