import { MdSchool } from "react-icons/md";
import type { ProgramResponse } from "../../../types/organization";
import Button from "../../../components/UI/Button";
import { Edit, Trash } from "lucide-react";

const degreeMap: Record<string, string> = {
  BACHELOR: "Cử nhân",
  ENGINEERING: "Kỹ sư",
};

const ProgramTable = ({
  programs,
  onSelectEditing,
  onSelectDeleting,
}: {
  programs: ProgramResponse[];
  onSelectEditing: (program: ProgramResponse) => void;
  onSelectDeleting: (program: ProgramResponse) => void;
}) => {
  const getManager = (program: ProgramResponse) => {
    if (program.college) return program.college.name;
    if (program.faculty) return program.faculty.name;
    if (program.department) return program.department.name;
    return "Chưa cập nhật";
  };

  return (
    <div className="space-y-3 p-4">
      {programs.map((program) => (
        <div
          key={program.id}
          className="
          flex items-center justify-between
          rounded-xl
          border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-900
          px-5 py-4
          shadow-sm
          hover:shadow-md
          hover:border-blue-300 dark:hover:border-blue-500
          transition
          "
        >
          <div className="flex items-center gap-4">
            <div
              className="
              flex h-11 w-11 items-center justify-center
              rounded-lg
              bg-blue-50 dark:bg-blue-900/40
              text-blue-600 dark:text-blue-400
              "
            >
              <MdSchool size={22} />
            </div>

            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                {program.name}
              </h3>

              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">{program.code}</span>

                <span className="text-gray-400">•</span>

                <span className="px-2 py-0.5 rounded-md bg-gray-100 dark:bg-gray-800 text-xs">
                  {degreeMap[program.degree] || program.degree}
                </span>
              </div>

              <div className="text-xs text-gray-500 dark:text-gray-400">
                Quản lý bởi
                <span className="ml-2 font-medium text-gray-700 dark:text-gray-200">
                  {getManager(program)}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              icon={Edit}
              size="sm"
              variant="outline"
              onClick={() => onSelectEditing(program)}
            />

            <Button
              icon={Trash}
              size="sm"
              variant="outline"
              onClick={() => onSelectDeleting(program)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgramTable;
