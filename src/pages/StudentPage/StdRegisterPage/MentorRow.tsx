import { User } from "lucide-react";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";
import type { LecturerResponse } from "../../../types/lecturer";

interface MentorRowProps {
  mentor: LecturerResponse;
  isRegistered: boolean;
  isAccepted: boolean;
  isRejected: boolean;
  isCancelled: boolean;
  hasAccepted: boolean;
  onRegister: (mentor: LecturerResponse) => void;
}

const MentorRow = ({
  mentor,
  isRegistered,
  isAccepted,
  isRejected,
  isCancelled,
  hasAccepted,
  onRegister,
}: MentorRowProps) => {
  const unit =
    mentor.department?.name ||
    mentor.faculty?.name ||
    mentor.college?.name ||
    "Chưa cập nhật";

  return (
    <div
      className="
        flex items-center gap-3 px-4 py-3
        rounded-xl border border-gray-200 bg-white
        transition-colors duration-200
        hover:border-gray-300 hover:bg-gray-50
        dark:border-gray-700 dark:bg-gray-900
        dark:hover:border-gray-600 dark:hover:bg-gray-800/60
      "
    >
      {/* Avatar */}
      <div
        className="
          w-9 h-9 rounded-full shrink-0
          bg-blue-50 dark:bg-blue-900/30
          border border-blue-200/60 dark:border-blue-800/60
          flex items-center justify-center
          text-blue-600 dark:text-blue-400
          text-sm font-medium
        "
      >
        {mentor.fullName?.charAt(0) || (
          <User size={16} className="text-blue-500 dark:text-blue-400" />
        )}
      </div>

      {/* Tên + email */}
      <div className="flex-[2] min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {mentor.fullName}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {mentor.email}
        </p>
      </div>

      {/* Mã GV */}
      <div className="flex-1 min-w-0 hidden sm:block">
        <p className="text-[11px] text-gray-400 dark:text-gray-500">Mã GV</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {mentor.lecturerCode}
        </p>
      </div>

      {/* Đơn vị */}
      <div className="flex-[2] min-w-0 hidden md:block">
        <p className="text-[11px] text-gray-400 dark:text-gray-500">Đơn vị</p>
        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">
          {unit}
        </p>
      </div>

      {/* Action */}
      <div className="shrink-0 ml-auto min-w-40 flex justify-end">
        {isRegistered && <Badge label="Đang chờ phản hồi" variant="warning" />}
        {isAccepted && <Badge label="Đã chấp nhận" variant="success" />}
        {isRejected && <Badge label="Đã bị từ chối" variant="danger" />}
        {isCancelled && <Badge label="Bạn đã hủy yêu cầu" variant="outline" />}
        {!isRegistered &&
          !isAccepted &&
          !isRejected &&
          !isCancelled &&
          !hasAccepted && (
            <Button
              label="Đăng ký"
              size="sm"
              onClick={() => onRegister(mentor)}
            />
          )}
        {!isRegistered &&
          !isAccepted &&
          !isRejected &&
          !isCancelled &&
          hasAccepted && (
            <Badge label="Đã có GV hướng dẫn" variant="secondary" />
          )}
      </div>
    </div>
  );
};

export default MentorRow;
