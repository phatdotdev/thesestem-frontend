import { useState } from "react";
import {
  useRemoveStudentFromCurrentSemesterMutation,
  useSearchThesisStudentsQuery,
} from "../../../services/semApi";
import type { StudentResponse } from "../../../types/student";
import StudentRow from "./StudentRow";
import Button from "../../../components/UI/Button";
import { GraduationCap, Plus } from "lucide-react";
import StudentListModal from "./StudentListModal";

const SemesterStudentPage = () => {
  const { data, isLoading, refetch } = useSearchThesisStudentsQuery({
    page: 0,
    size: 10,
  });

  const [removeStudent] = useRemoveStudentFromCurrentSemesterMutation();
  const [openList, setOpenList] = useState(false);

  const students: StudentResponse[] = data?.data.content || [];

  const onDelete = async (id: string) => {
    await removeStudent(id).unwrap();
    refetch();
  };

  return (
    <div
      className="space-y-6 bg-white dark:bg-gray-900 rounded-xl shadow p-6"
      style={{ fontFamily: "Inter" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-4 bg-blue-100 dark:bg-blue-950/40 text-blue-500 dark:text-blue-300 rounded-lg">
            <GraduationCap />
          </div>

          <div>
            <h1 className="text-2xl font-semibold dark:text-gray-100">
              Quản lý sinh viên
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý sinh viên tham gia thực hiện luận văn
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm sinh viên"
          size="sm"
          onClick={() => setOpenList(true)}
        />
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* TABLE HEADER */}
        <div
          className="
          grid grid-cols-9 gap-4
          border-b border-gray-200 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          px-4 py-3
          text-xs font-semibold uppercase tracking-wide
          text-gray-600 dark:text-gray-300
        "
        >
          <div className="col-span-2">Sinh viên</div>
          <div>Mã SV</div>
          <div>Ngày sinh</div>
          <div>Giới tính</div>
          <div>Số điện thoại</div>
          <div>Ngành</div>
          <div>Khóa</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* TABLE BODY */}
        {isLoading ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-gray-500 dark:text-gray-400">
            Chưa có sinh viên nào
          </div>
        ) : (
          students.map((student) => (
            <StudentRow
              key={student.id}
              student={student}
              onDelete={() => onDelete(student.id)}
            />
          ))
        )}
      </div>

      {/* MODAL */}
      <StudentListModal
        open={openList}
        onClose={() => {
          setOpenList(false);
          refetch();
        }}
      />
    </div>
  );
};

export default SemesterStudentPage;
