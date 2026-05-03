import { useState } from "react";
import { Search, UserPlus, Info } from "lucide-react";
import type { GroupResponse } from "../../../../types/group";
import { useAppDispatch } from "../../../../app/hook";
import { useGetMentorRegistersQuery } from "../../../../services/semApi";
import {
  useAssignStudentToGroupMutation,
  useGetCurrentMentorGroupsQuery,
} from "../../../../services/groupApi";
import { addToast } from "../../../../features/notification/toastSlice";
import Button from "../../../../components/UI/Button";
import Loader from "../../../../components/UI/Loader";
import Modal from "../../../../components/UI/Modal";

interface RegisterModalProps {
  open: boolean;
  onClose: () => void;
  groupId: string;
}

const RegisterModal = ({ open, onClose, groupId }: RegisterModalProps) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const { data: currentSemester } = useGetCurrentMentorGroupsQuery(undefined, {
    skip: !open,
  });
  const allGroups: GroupResponse[] = currentSemester?.data || [];
  const { data: registerResponse, isLoading: isFetching } =
    useGetMentorRegistersQuery(undefined, {
      skip: !open,
    });

  const [addStudent, { isLoading: isSubmitting }] =
    useAssignStudentToGroupMutation();

  if (!open) return null;

  const registers = registerResponse?.data || [];

  const availableStudents = registers.filter((reg) => {
    const isAccepted = reg.status === "ACCEPTED";
    const hasNoGroup = !allGroups.some((group) =>
      group.students.some((s) => s.id === reg.student.id),
    );

    const matchesSearch =
      reg.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reg.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());

    return isAccepted && hasNoGroup && matchesSearch;
  });

  // Hàm xử lý thêm sinh viên
  const handleAdd = async (studentId: string) => {
    try {
      await addStudent({ groupId, studentId }).unwrap();
      dispatch(
        addToast({
          type: "success",
          message: "Đã thêm sinh viên vào nhóm thành công!",
        }),
      );
      // Bạn có thể chọn onClose() ở đây nếu muốn đóng modal ngay sau khi thêm
    } catch (error) {
      dispatch(
        addToast({
          type: "error",
          message: "Thêm sinh viên thất bại, vui lòng thử lại.",
        }),
      );
    }
  };

  return (
    <Modal onClose={onClose} open={open}>
      {/* Modal Content */}

      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
            Thêm thành viên
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Chọn sinh viên từ danh sách đã duyệt
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {/* Icon X của bạn */}
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          size={16}
        />
        <input
          type="text"
          className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          placeholder="Tìm theo tên hoặc MSSV..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* List Area */}
      <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1 custom-scrollbar">
        {isFetching ? (
          <div className="py-10">
            <Loader />
          </div>
        ) : availableStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 border border-dashed rounded-3xl border-gray-200 dark:border-gray-800">
            <Info size={32} className="mb-2 opacity-20" />
            <p className="text-sm">Không có sinh viên nào khả dụng</p>
          </div>
        ) : (
          availableStudents.map((reg) => (
            <div
              key={reg.id}
              className="group flex items-center justify-between p-3 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-black shadow-lg shadow-blue-500/20">
                  {reg.student.studentCode.slice(-2)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-200">
                    {reg.student.fullName}
                  </p>
                  <p className="text-[11px] text-gray-500">
                    {reg.student.studentCode} • Lớp {reg.student.course.name}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                icon={UserPlus}
                label="Thêm"
                loading={isSubmitting}
                onClick={() => handleAdd(reg.student.id)}
                className="rounded-xl border-gray-200 dark:border-gray-700 hover:bg-blue-600 hover:text-white hover:border-blue-600"
              />
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={onClose}
          className="px-5 py-2 text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          Hoàn tất
        </button>
      </div>
    </Modal>
  );
};

export default RegisterModal;
