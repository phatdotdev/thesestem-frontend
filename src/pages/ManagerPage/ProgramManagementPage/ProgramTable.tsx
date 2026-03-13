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
    <div className="space-y-3">
      {programs.map((program) => (
        <div
          key={program.id}
          className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex items-center gap-4">
            {/* Icon */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MdSchool size={22} />
            </div>

            {/* Info */}
            <div className="space-y-1">
              <h3 className="font-semibold text-gray-900">{program.name}</h3>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="font-medium">{program.code}</span>

                <span className="text-gray-400">•</span>

                <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700 text-xs font-medium">
                  {degreeMap[program.degree]}
                </span>
              </div>

              <div className="text-xs text-gray-500">
                Quản lý bởi
                <span className="ml-2 font-medium text-gray-700">
                  {getManager(program)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
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
