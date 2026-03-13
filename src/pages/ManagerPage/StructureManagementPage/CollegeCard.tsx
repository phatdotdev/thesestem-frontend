import { ChevronDown, ChevronUp, Edit, Plus, Trash2 } from "lucide-react";
import type { OrgUnit } from "../../../types/structure";
import Button from "../../../components/UI/Button";
import { useDeleteCollegeMutation } from "../../../services/orgApi";
import FacultyForm from "./FacultyForm";
import { useState } from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import CollegeForm from "./CollegeForm";

export const CollegeCard = ({
  college,
  setOpen,
  open,
}: {
  college: OrgUnit;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [deleteCollege, { isLoading: isDeleting }] = useDeleteCollegeMutation();
  const deleteCollegeById = async () => {
    await deleteCollege(college.id).unwrap();
  };
  const [openAddFacultyForm, setOpenAddFacultyForm] = useState(false);
  const [openUpdateCollegeForm, setOpenUpdateCollegeForm] = useState(false);
  return (
    <div className="flex items-center justify-between bg-white px-4 rounded-xl border border-gray-300">
      <div className="flex gap-4 items-center py-5">
        <div className="bg-blue-100 p-4 rounded-lg">
          <HiOutlineOfficeBuilding size={28} color="blue" />
        </div>
        <div className="space-y-1">
          <h2 className="font-semibold text-gray-900 text-lg">
            {college.name}
          </h2>
          <p className="text-md text-gray-500 font-bold">{college.code}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          icon={Plus}
          size="sm"
          variant="outline"
          onClick={() => setOpenAddFacultyForm(true)}
        />
        <Button
          icon={Edit}
          size="sm"
          variant="outline"
          onClick={() => setOpenUpdateCollegeForm(true)}
        />
        <Button
          icon={Trash2}
          size="sm"
          variant="outline"
          loading={isDeleting}
          onClick={deleteCollegeById}
        />
        <Button
          icon={!open ? ChevronDown : ChevronUp}
          variant="outline"
          size="sm"
          onClick={() => setOpen(!open)}
        />
      </div>
      <CollegeForm
        collegeId={college.id}
        open={openUpdateCollegeForm}
        initialData={college}
        onClose={() => setOpenUpdateCollegeForm(false)}
      />
      <FacultyForm
        collegeId={college.id}
        initialData={null}
        open={openAddFacultyForm}
        onClose={() => setOpenAddFacultyForm(false)}
      />
    </div>
  );
};
