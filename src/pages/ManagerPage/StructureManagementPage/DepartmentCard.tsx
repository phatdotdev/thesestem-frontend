import { Edit, Layers, Trash2 } from "lucide-react";
import type { OrgUnit } from "../../../types/structure";
import Button from "../../../components/UI/Button";
import ConfirmDepartmentModal from "./Modals/ConfirmDepartmentModal";
import { useState } from "react";
import DepartmentFormModal from "./Modals/DepartmentFormModal";

export const DepartmentCard = ({ department }: { department: OrgUnit }) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [openEditingModal, setOpenEditingModal] = useState(false);

  return (
    <>
      <div className="flex items-start justify-between rounded-xl border border-gray-200 bg-white p-4 transition-all duration-200 hover:border-gray-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:hover:border-slate-600">
        <div className="flex gap-4">
          <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-gray-100 p-3 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Layers size={22} />
          </div>

          <div className="space-y-1">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {department.name}
            </p>

            <span className="inline-flex rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
              {department.code || "Chưa có mã"}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            icon={Edit}
            size="sm"
            variant="outline"
            onClick={() => setOpenEditingModal(true)}
          />

          <Button
            icon={Trash2}
            size="sm"
            variant="outline-danger"
            onClick={() => setOpenConfirmModal(true)}
          />
        </div>
      </div>

      <ConfirmDepartmentModal
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
        departmentId={department.id}
        departmentName={department.name}
      />

      <DepartmentFormModal
        open={openEditingModal}
        onClose={() => setOpenEditingModal(false)}
        department={department}
      />
    </>
  );
};
