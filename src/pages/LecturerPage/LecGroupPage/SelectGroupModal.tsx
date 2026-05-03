import { Users, Check } from "lucide-react";
import { useState } from "react";

import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";

import type { GroupResponse } from "../../../types/group";
import type { StudentResponse } from "../../../types/student";

import { useAssignStudentToGroupMutation } from "../../../services/groupApi";
import { useAppDispatch } from "../../../app/hook";

interface SelectGroupModalProps {
  open: boolean;
  onClose: () => void;
  groups: GroupResponse[];
  student: StudentResponse | null;
}

const SelectGroupModal = ({
  open,
  onClose,
  groups,
  student,
}: SelectGroupModalProps) => {
  const [currentGroup, setCurrentGroup] = useState<GroupResponse | null>(null);
  const [addStudentToGroup, { isLoading }] = useAssignStudentToGroupMutation();

  const dispatch = useAppDispatch();

  const handleAddStudentToGroup = async () => {
    if (!currentGroup || !student) return;

    try {
      await addStudentToGroup({
        groupId: currentGroup.id,
        studentId: student.id,
      }).unwrap();

      onClose();
      setCurrentGroup(null);
    } catch (error) {
      dispatch({
        type: "error",
        message: "Thêm sinh viên vào nhóm thất bại",
      });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="
          w-[500px] max-w-full
          bg-white dark:bg-gray-900
          text-gray-800 dark:text-gray-100
          rounded-xl
          p-2
          space-y-6
        "
      >
        {/* HEADER */}
        <div>
          <h2 className="text-lg font-semibold">Chọn nhóm hướng dẫn</h2>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Chọn nhóm để thêm sinh viên{" "}
            <span className="font-medium">{student?.fullName}</span> vào nhóm.
          </p>
        </div>

        {/* GROUP LIST */}
        {groups.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            <Users className="mx-auto mb-2" size={28} />
            Chưa có nhóm nào
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {groups.map((group) => {
              const isSelected = currentGroup?.id === group.id;

              return (
                <div
                  key={group.id}
                  onClick={() => setCurrentGroup(group)}
                  className={`
                    p-4 border rounded-xl cursor-pointer transition
                    flex justify-between items-center

                    ${
                      isSelected
                        ? `
                          border-blue-500
                          bg-blue-50
                          dark:bg-blue-900/40
                        `
                        : `
                          border-gray-200
                          dark:border-gray-700
                          hover:border-blue-400
                          hover:bg-blue-50
                          dark:hover:bg-blue-900/30
                        `
                    }
                  `}
                >
                  <div>
                    <p className="font-medium">{group.name}</p>

                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                      {group.description || "Không có mô tả"}
                    </p>
                  </div>

                  {isSelected && (
                    <Check
                      size={18}
                      className="text-blue-600 dark:text-blue-400"
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            label="Đóng"
            variant="outline"
            onClick={() => {
              onClose();
              setCurrentGroup(null);
            }}
          />

          <Button
            label={isLoading ? "Đang thêm..." : "Xác nhận"}
            variant="primary"
            disabled={!currentGroup || isLoading}
            onClick={handleAddStudentToGroup}
          />
        </div>
      </div>
    </Modal>
  );
};

export default SelectGroupModal;
