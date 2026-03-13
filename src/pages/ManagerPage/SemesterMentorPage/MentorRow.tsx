import type { LecturerResponse } from "../../../types/lecturer";
import Button from "../../../components/UI/Button";
import { Plus, Trash, User } from "lucide-react";
import Badge from "../../../components/UI/Badge";

interface Props {
  added?: boolean;
  lecturer: LecturerResponse;
  onAdd?: () => void;
  onDelete?: () => void;
}

const MentorRow = ({ lecturer, onAdd, added, onDelete }: Props) => {
  const gender =
    lecturer.gender === "MALE"
      ? "Nam"
      : lecturer.gender === "FEMALE"
        ? "Nữ"
        : "-";

  const dob = lecturer.dob
    ? new Date(lecturer.dob).toLocaleDateString("vi-VN")
    : "-";
  const unit =
    lecturer.department?.name ||
    lecturer.faculty?.name ||
    lecturer.college?.name ||
    "";
  return (
    <div
      className="
      grid grid-cols-9 gap-4
      px-4 py-3
      text-sm
      border-b border-gray-200
      hover:bg-gray-50
      transition
    "
    >
      {/* Giảng viên */}
      <div className="col-span-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={16} />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{lecturer.fullName}</span>

          <span className="text-xs text-gray-500 truncate">
            {lecturer.email}
          </span>
        </div>
      </div>

      {/* Mã CB */}
      <div className="flex items-center font-medium text-gray-700">
        {lecturer.lecturerCode || "-"}
      </div>

      {/* Đơn vị   */}
      <div className="flex col-span-2 text-gray-600">
        <span className="text-sm text-blue-500 font-semibold">{unit}</span>
      </div>

      {/* Ngày sinh */}
      <div className="flex items-center text-gray-600">{dob}</div>

      {/* Giới tính */}
      <div className="flex items-center text-gray-600">{gender}</div>

      {/* SĐT */}
      <div className="flex items-center text-gray-600">
        {lecturer.phone || "-"}
      </div>

      {/* Action */}
      <div className="flex items-center justify-center gap-2">
        {onAdd && !added && (
          <Button
            icon={Plus}
            variant="outline"
            size="sm"
            className="hover:bg-green-50 hover:border-green-300"
            onClick={onAdd}
          />
        )}

        {onDelete && (
          <Button
            icon={Trash}
            variant="outline"
            size="sm"
            className="hover:bg-red-50 hover:border-red-300"
            onClick={onDelete}
          />
        )}
        {added && <Badge label="Đã thêm" />}
      </div>
    </div>
  );
};

export default MentorRow;
