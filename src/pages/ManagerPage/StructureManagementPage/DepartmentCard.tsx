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
      <div className="flex justify-between items-start bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200">
        {/* LEFT */}
        <div className="flex gap-4">
          {/* Icon */}
          <div className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-3 rounded-lg flex items-center justify-center border border-gray-200 dark:border-gray-600">
            <Layers size={22} />
          </div>

          {/* Info */}
          <div className="space-y-1">
            <p className="font-semibold text-gray-800 dark:text-gray-100">
              {department.name}
            </p>

            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              {department.code}
            </p>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-2">
          <Button
            icon={Edit}
            size="sm"
            variant="outline"
            className="hover:bg-blue-50 dark:hover:bg-blue-900/30 dark:hover:text-blue-400"
            onClick={() => setOpenEditingModal(true)}
          />

          <Button
            icon={Trash2}
            size="sm"
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400"
            onClick={() => setOpenConfirmModal(true)}
          />
        </div>
      </div>

      {/* MODALS */}
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
