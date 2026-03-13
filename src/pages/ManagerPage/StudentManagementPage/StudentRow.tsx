import { Edit, Trash, User, Phone, Calendar } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { StudentResponse } from "../../../types/student";
import { formatDateVN, formatGender } from "../../../utils/formatters";

interface Props {
  student: StudentResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const StudentRow = ({ student, onEdit, onDelete }: Props) => {
  const gender = formatGender(student.gender);

  return (
    <div
      className="
      grid grid-cols-6 lg:grid-cols-9 items-center gap-4
      px-4 py-3
      text-sm
      border-b border-gray-200
      hover:bg-blue-50
      transition
      dark:border-gray-800 dark:hover:bg-gray-800
      "
    >
      {/* Student Info */}
      <div className="col-span-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={18} />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {student.fullName}
          </span>

          <span className="text-xs text-gray-500">{student.program.name}</span>
        </div>
      </div>

      {/* Student Code */}
      <div className="flex justify-center">
        <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
          {student.studentCode}
        </span>
      </div>

      {/* Program */}
      <div className="flex justify-center text-blue-500 font-semibold">
        <span className="">{student.program.name}</span>
      </div>

      {/* Course */}
      <div className="flex justify-center">
        <span className="text-sm font-semibold text-blue-500">
          {student.course.name}
        </span>
      </div>

      {/* Date of Birth */}
      <div className="hidden lg:flex p-1 rounded-lg bg-gray-100 justify-center items-center gap-2 text-gray-900 font-semibold">
        <Calendar size={14} />
        {formatDateVN(student.dob)}
      </div>

      {/* Gender */}
      <div className="hidden lg:flex justify-center">
        <span
          className="
          rounded-md px-3 py-1 text-xs font-semibold
          bg-gray-100
        "
        >
          {gender}
        </span>
      </div>

      {/* Phone */}
      <div className="hidden lg:flex p-1 rounded-lg bg-gray-100 justify-center items-center gap-2 text-gray-900 font-semibold">
        <Phone size={14} />
        {student.phone}
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-2">
        <Button
          icon={Edit}
          variant="outline"
          size="xs"
          onClick={onEdit}
          className="hover:border-blue-500 hover:text-blue-600"
        />

        <Button
          icon={Trash}
          variant="outline"
          size="xs"
          onClick={onDelete}
          className="hover:border-red-500 hover:text-red-600"
        />
      </div>
    </div>
  );
};

export default StudentRow;
