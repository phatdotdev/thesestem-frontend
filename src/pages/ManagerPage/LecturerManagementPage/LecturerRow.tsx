import type { LecturerResponse } from "../../../types/lecturer";
import Button from "../../../components/UI/Button";
import { Edit, Trash, Phone, User, Calendar } from "lucide-react";
import { formatDateVN, formatGender } from "../../../utils/formatters";

interface Props {
  lecturer: LecturerResponse;
  onEdit: () => void;
  onDelete: () => void;
}

const LecturerRow = ({ lecturer, onEdit, onDelete }: Props) => {
  const gender = formatGender(lecturer.gender);

  const unit =
    lecturer.department?.name ||
    lecturer.faculty?.name ||
    lecturer.college?.name ||
    "";

  return (
    <div
      className="
      grid grid-cols-9 items-center gap-4
      px-4 py-3
      text-sm
      border-b border-gray-200
      hover:bg-blue-50
      transition
      dark:border-gray-800 dark:hover:bg-gray-800
      "
    >
      {/* Lecturer Info */}
      <div className="col-span-2 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
          <User size={18} />
        </div>

        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {lecturer.fullName}
          </span>

          <span className="text-xs text-gray-500">{lecturer.email}</span>
        </div>
      </div>

      {/* Lecturer Code */}
      <div className="flex justify-center">
        <span className="rounded-md bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 dark:bg-gray-700 dark:text-gray-200">
          {lecturer.lecturerCode}
        </span>
      </div>

      {/* Unit */}
      <div className="col-span-2 flex items-center justify-center gap-1 text-gray-600">
        <span className="text-sm text-blue-500 font-semibold">{unit}</span>
      </div>

      {/* Date of Birth */}
      <div className="flex p-1 rounded-lg bg-gray-100 justify-center items-center gap-2 text-gray-900 font-semibold">
        <Calendar size={14} />
        {formatDateVN(lecturer.dob)}
      </div>

      {/* Gender */}
      <div className="flex justify-center">
        <span
          className={`
          rounded-md px-3 py-1 text-xs font-semibold
          bg-gray-100
         `}
        >
          {gender}
        </span>
      </div>

      {/* Phone */}
      <div className="flex p-1 rounded-lg bg-gray-100 justify-center items-center gap-2 text-gray-900 font-semibold">
        <Phone size={14} />
        {lecturer.phone}
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

export default LecturerRow;
