import { Plus, Trash, User } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { StudentResponse } from "../../../types/student";
import Badge from "../../../components/UI/Badge";

interface Props {
  student: StudentResponse;
  added?: boolean;
  onAdd?: () => void;
  onDelete?: () => void;
}

const StudentRow = ({ student, onAdd, onDelete, added }: Props) => {
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
      {/* Sinh viên */}
      <div className="col-span-2 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={16} />
        </div>

        <div className="flex flex-col">
          <span className="font-medium text-gray-900">{student.fullName}</span>
          <span className="text-xs text-gray-500">{student.email}</span>
        </div>
      </div>

      {/* Mã SV */}
      <div className="flex items-center text-gray-700 font-medium">
        {student.studentCode}
      </div>

      {/* DOB */}
      <div className="flex items-center text-gray-600">
        {student.dob || "-"}
      </div>

      {/* Gender */}
      <div className="flex items-center text-gray-600">
        {student.gender || "-"}
      </div>

      {/* Phone */}
      <div className="flex items-center text-gray-600">
        {student.phone || "-"}
      </div>

      {/* Program */}
      <div className="flex items-center truncate">
        {student.program?.name || "-"}
      </div>

      {/* Course */}
      <div className="flex items-center truncate">
        {student.course?.name || "-"}
      </div>

      {/* Actions */}
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

        {added && <Badge label="Đã thêm" variant="success" />}
      </div>
    </div>
  );
};

export default StudentRow;
