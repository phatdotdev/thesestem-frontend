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
    <div className="flex items-center justify-between bg-white dark:bg-gray-800 px-4 rounded-xl border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-sm transition-all duration-200">
      {/* LEFT */}
      <div className="flex gap-4 items-center py-5">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <HiOutlineOfficeBuilding
            size={28}
            className="text-blue-600 dark:text-blue-400"
          />
        </div>

        <div className="space-y-1">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            {college.name}
          </h2>

          <p className="text-md text-gray-500 dark:text-gray-400 font-bold">
            {college.code}
          </p>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <Button
          icon={Plus}
          size="sm"
          variant="outline"
          className="hover:bg-green-50 dark:hover:bg-green-900/30 dark:hover:text-green-400"
          onClick={() => setOpenAddFacultyForm(true)}
        />

        <Button
          icon={Edit}
          size="sm"
          variant="outline"
          className="hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
          onClick={() => setOpenUpdateCollegeForm(true)}
        />

        <Button
          icon={Trash2}
          size="sm"
          variant="outline"
          loading={isDeleting}
          className="hover:bg-red-50 dark:hover:bg-red-900/30 dark:hover:text-red-400"
          onClick={deleteCollegeById}
        />

        <Button
          icon={!open ? ChevronDown : ChevronUp}
          variant="outline"
          size="sm"
          className="hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={() => setOpen(!open)}
        />
      </div>

      {/* MODALS */}
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
