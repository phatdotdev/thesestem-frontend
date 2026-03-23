import { Mail, BookOpen, MessageSquare } from "lucide-react";
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

const RegisterCard = ({
  register,
  onAccept,
  onReject,
  onAdd,
  added,
}: RegisterCardProps) => {
  const { student, message, status } = register;

  const statusConfig: Record<
    string,
    { label: string; variant: "warning" | "success" | "danger" | "secondary" }
  > = {
    PENDING: { label: "Chờ duyệt", variant: "warning" },
    ACCEPTED: { label: "Đã chấp nhận", variant: "success" },
    REJECTED: { label: "Đã từ chối", variant: "danger" },
    CANCELLED: { label: "Đã hủy", variant: "secondary" },
  };

  const statusInfo = statusConfig[status] || statusConfig.PENDING;

  return (
    <div className="group bg-white border border-gray-200 rounded-3xl p-4 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* HEADER */}
      <div className="flex items-start justify-between pb-3 border-b border-gray-300">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-10 w-10 rounded-2xl bg-blue-100 flex items-center justify-center font-semibold text-blue-600 overflow-hidden">
            {student.avatarUrl ? (
              <img
                src={student.avatarUrl}
                alt={student.fullName}
                className="h-full w-full object-cover"
              />
            ) : (
              student.fullName?.charAt(0)
            )}
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
              {student.fullName}
            </h3>

            <p className="text-sm text-gray-500">{student.studentCode}</p>
          </div>
        </div>

        <Badge
          label={statusInfo.label}
          variant={statusInfo.variant}
          size="sm"
          dot
        />
      </div>

      {/* INFO */}
      <div className="mt-3 space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <span>{student.email}</span>
        </div>

        <div className="flex items-center gap-2">
          <BookOpen size={14} />
          <span>
            {student.program?.name} • {student.course?.name}
          </span>
        </div>

        {message && (
          <div className="flex items-start gap-2">
            <MessageSquare size={14} className="mt-0.5" />
            <p className="italic text-gray-500 line-clamp-3">{message}</p>
          </div>
        )}
      </div>

      {/* ACTION */}
      <div className="mt-4 flex gap-3 justify-end">
        {status === "PENDING" && (
          <>
            <Button
              label="Từ chối"
              variant="outline"
              size="sm"
              className="flex-1 border-red-200 text-red-500 hover:bg-red-50"
              onClick={() => onReject?.(register)}
            />

            <Button
              label="Chấp nhận"
              variant="success"
              size="sm"
              className="flex-1"
              onClick={() => onAccept?.(register)}
            />
          </>
        )}
        {status === "CANCELLED" && (
          <Badge label="Đã hủy yêu cầu" variant="danger" />
        )}
        {status === "ACCEPTED" &&
          (added ? (
            <Badge label="Đã thêm vào nhóm" variant="success" />
          ) : (
            <Button
              label="Thêm vào nhóm"
              size="sm"
              onClick={() => onAdd?.(register)}
            />
          ))}
      </div>
    </div>
  );
};

export default RegisterCard;
