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
      <div className="flex justify-between items-start bg-white p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200">
        {/* LEFT */}
        <div className="flex gap-4">
          {/* Icon */}
          <div className="bg-gray-100 text-gray-800 p-3 rounded-lg flex items-center justify-center">
            <Layers size={22} />
          </div>

          {/* Info */}
          <div className="space-y-1">
            <p className="font-semibold text-gray-800">{department.name}</p>

            <p className="text-xs text-gray-500 font-medium">
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
            className="hover:bg-blue-50"
            onClick={() => setOpenEditingModal(true)}
          />

          <Button
            icon={Trash2}
            size="sm"
            variant="outline"
            className="hover:bg-red-50 hover:text-red-600"
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
