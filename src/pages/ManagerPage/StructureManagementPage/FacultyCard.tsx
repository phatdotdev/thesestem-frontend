import {
  ChevronDown,
  ChevronUp,
  Edit,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import type { OrgUnit } from "../../../types/structure";
import Button from "../../../components/UI/Button";
import { useState } from "react";
import DepartmentForm from "./DepartmentForm";
import { useDeleteFacultyMutation } from "../../../services/orgApi";

export const FacultyCard = ({
  faculty,
  open,
  setOpen,
}: {
  faculty: OrgUnit;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [showForm, setShowForm] = useState(false);
  const [deleteFaculty] = useDeleteFacultyMutation();

  const deleteFacultyById = async () => {
    if (confirm("Xác nhận xóa?")) {
      await deleteFaculty(faculty.id).unwrap();
    }
  };

  return (
    <div className="flex justify-between bg-white dark:bg-gray-800 px-4 rounded-lg border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200">
      {/* LEFT */}
      <div className="flex gap-4 items-center py-5">
        <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200">
          <Users size={26} />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {faculty.name}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {faculty.code}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2 items-center">
        <Button
          icon={Plus}
          size="sm"
          variant="outline"
          className="hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:text-green-400"
          onClick={() => setShowForm(true)}
        />

        <Button
          icon={Edit}
          size="sm"
          variant="outline"
          className="hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
        />

        <Button
          icon={Trash2}
          size="sm"
          variant="outline"
          className="hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          onClick={deleteFacultyById}
        />

        <Button
          icon={!open ? ChevronDown : ChevronUp}
          variant="outline"
          size="sm"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* MODAL */}
      <DepartmentForm
        initialData={null}
        open={showForm}
        onClose={() => setShowForm(false)}
        facultyId={faculty.id}
      />
    </div>
  );
};
