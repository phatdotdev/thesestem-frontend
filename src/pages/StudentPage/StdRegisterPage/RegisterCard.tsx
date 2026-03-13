import { User } from "lucide-react";
import Button from "../../../components/UI/Button";
import Badge from "../../../components/UI/Badge";

interface RegisterCardProps {
  register: any;
  getStatusVariant: (status: string) => any;
  onView?: (register: any) => void;
  onCancel?: (register: any) => void;
}

const RegisterCard = ({
  register,
  getStatusVariant,
  onView,
  onCancel,
}: RegisterCardProps) => {
  const mentor = register.mentor;

  const unit =
    mentor.department?.name ||
    mentor.faculty?.name ||
    mentor.college?.name ||
    "Chưa cập nhật";

  return (
    <div
      className="
      group bg-white border border-gray-200
      rounded-2xl p-4
      shadow-sm hover:shadow-lg
      hover:-translate-y-0.5
      transition-all duration-300
    "
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="
          h-9 w-9 rounded-full
          bg-gray-200
          flex items-center justify-center
          text-gray-600 text-sm font-semibold
        "
        >
          {mentor.fullName?.charAt(0) || <User size={18} />}
        </div>

        <div className="leading-tight">
          <h3 className="font-semibold text-sm text-gray-800">
            {mentor.fullName}
          </h3>

          <p className="text-xs text-gray-500">{mentor.email}</p>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 text-xs text-gray-600">
        <p>
          {mentor.lecturerCode} • {unit}
        </p>
      </div>

      {/* Action */}
      <div className="mt-3 flex justify-end items-center gap-4">
        <Badge
          label={register.status}
          variant={getStatusVariant(register.status) || "warning"}
        />

        <Button
          label="Chi tiết"
          size="sm"
          variant="outline"
          onClick={() => onView?.(register)}
        />
        <Button
          label="Hủy yêu cầu"
          size="sm"
          variant="danger"
          onClick={() => onCancel?.(register)}
        />
      </div>
    </div>
  );
};

export default RegisterCard;
