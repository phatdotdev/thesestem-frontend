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
    <div className="flex justify-between bg-white px-4 rounded-lg border border-gray-300">
      <div className="flex gap-4 items-center py-5">
        <div className="p-2 bg-gray-100 rounded-lg">
          <Users size={26} />
        </div>
        <div>
          <h3 className="font-semibold">{faculty.name}</h3>
          <span className="text-sm text-gray-500">{faculty.code}</span>
        </div>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          icon={Plus}
          size="sm"
          variant="outline"
          onClick={() => setShowForm(true)}
        />
        <Button icon={Edit} size="sm" variant="outline" />
        <Button
          icon={Trash2}
          size="sm"
          variant="outline"
          onClick={() => deleteFacultyById()}
        />
        <Button
          icon={!open ? ChevronDown : ChevronUp}
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
        />
      </div>
      <DepartmentForm
        initialData={null}
        open={showForm}
        onClose={() => setShowForm(false)}
        facultyId={faculty.id}
      />
    </div>
  );
};
