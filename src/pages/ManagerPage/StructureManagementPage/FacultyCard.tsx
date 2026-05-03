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
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import FacultyForm from "./FacultyForm";

export const FacultyCard = ({
  faculty,
  open,
  setOpen,
}: {
  faculty: OrgUnit;
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [openAddDepartmentForm, setOpenAddDepartmentForm] = useState(false);
  const [openUpdateFacultyForm, setOpenUpdateFacultyForm] = useState(false);
  const dispatch = useAppDispatch();
  const [deleteFaculty, { isLoading: isDeleting }] = useDeleteFacultyMutation();
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const deleteFacultyById = async () => {
    try {
      await deleteFaculty(faculty.id).unwrap();
      setOpenDeleteModal(false);
      dispatch(addToast({ type: "success", message: "Xóa khoa thành công" }));
    } catch (error) {
      console.log(error);
      dispatch(addToast({ type: "error", message: "Không thể xóa khoa" }));
    }
  };

  return (
    <div className="flex justify-between rounded-lg border border-gray-200 bg-white px-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
      <div className="flex items-center gap-4 py-4">
        <div className="rounded-lg border border-gray-200 bg-gray-100 p-2 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
          <Users size={26} />
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">
            {faculty.name}
          </h3>
          <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {faculty.code || "Chưa có mã"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Button
          icon={Plus}
          size="sm"
          variant="outline"
          onClick={() => setOpenAddDepartmentForm(true)}
        />

        <Button
          icon={Edit}
          size="sm"
          variant="outline"
          onClick={() => setOpenUpdateFacultyForm(true)}
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

      {/* MODAL */}
      <DepartmentForm
        initialData={null}
        open={openAddDepartmentForm}
        onClose={() => setOpenAddDepartmentForm(false)}
        facultyId={faculty.id}
      />

      <FacultyForm
        collegeId=""
        initialData={faculty}
        open={openUpdateFacultyForm}
        onClose={() => setOpenUpdateFacultyForm(false)}
      />

      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={deleteFacultyById}
        title="Xóa khoa?"
        description={`Bạn có chắc muốn xóa khoa ${faculty.name}? Hành động này không thể hoàn tác.`}
        confirmText="Xác nhận xóa"
        type="danger"
        loading={isDeleting}
      />
    </div>
  );
};
