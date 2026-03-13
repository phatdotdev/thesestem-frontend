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
      group bg-white border border-gray-200
      rounded-3xl p-6
      shadow-sm hover:shadow-xl
      hover:-translate-y-1
      transition-all duration-300
    "
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div
          className="
          h-10 w-10 rounded-full
          bg-gradient-to-br from-blue-100 to-indigo-100
          flex items-center justify-center
          text-blue-600 font-semibold
        "
        >
          {mentor.fullName?.charAt(0) || <User size={20} />}
        </div>

        <div>
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {mentor.fullName}
          </h3>

          <p className="text-sm text-gray-500">{mentor.email}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 border-t border-gray-100" />

      {/* Info */}
      <div className="space-y-1 text-sm text-gray-600">
        <p>Mã giảng viên: {mentor.lecturerCode}</p>
        {mentor.phone && (
          <p className="font-semibold text-blue-500">Đơn vị quản lý: {unit}</p>
        )}
      </div>

      {/* Action */}
      <div className="mt-5 flex justify-end">
        {isRegistered && <Badge label="Đang chờ phản hồi" variant="warning" />}

        {isAccepted && <Badge label="Đã chấp nhận" variant="success" />}

        {isRejected && <Badge label="Đã bị từ chối" variant="danger" />}

        {isCancelled && (
          <Badge label="Bạn đã hủy yêu cầu" variant="outline" />
          // <Button
          //   label="Đăng ký lại"
          //   size="sm"
          //   onClick={() => onRegister(mentor)}
          // />
        )}

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
