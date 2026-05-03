import { ChevronDown, ChevronUp, Edit, Plus, Trash2 } from "lucide-react";
import type { OrgUnit } from "../../../types/structure";
import Button from "../../../components/UI/Button";
import { useDeleteCollegeMutation } from "../../../services/orgApi";
import FacultyForm from "./FacultyForm";
import { useState } from "react";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import CollegeForm from "./CollegeForm";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";
import ConfirmModal from "../../../components/UI/ConfirmModal";

export const CollegeCard = ({
  college,
  setOpen,
  open,
}: {
  college: OrgUnit;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [deleteCollege, { isLoading: isDeleting }] = useDeleteCollegeMutation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteCollegeById = async () => {
    try {
      await deleteCollege(college.id).unwrap();
      setOpenDeleteModal(false);
      dispatch(addToast({ type: "success", message: "Xóa trường thành công" }));
    } catch (error) {
      console.log(error);
      dispatch(addToast({ type: "error", message: "Không thể xóa trường" }));
    }
  };

  const [openAddFacultyForm, setOpenAddFacultyForm] = useState(false);
  const [openUpdateCollegeForm, setOpenUpdateCollegeForm] = useState(false);

  return (
    <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="flex items-center gap-4 py-5">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-800">
          <HiOutlineOfficeBuilding
            size={28}
            className="text-gray-600 dark:text-gray-300"
          />
        </div>

        <div className="space-y-1">
          <h2 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
            {college.name}
          </h2>

          <div className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {college.code || "Chưa có mã"}
          </div>
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
          variant="outline-danger"
          loading={isDeleting}
          onClick={() => setOpenDeleteModal(true)}
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

      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={deleteCollegeById}
        title="Xóa trường?"
        description={`Bạn có chắc muốn xóa trường ${college.name}? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        type="danger"
        loading={isDeleting}
      />
    </div>
  );
};
