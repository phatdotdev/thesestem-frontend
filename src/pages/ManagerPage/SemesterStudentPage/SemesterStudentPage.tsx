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
      className="space-y-6 bg-white rounded-xl shadow p-6"
      style={{ fontFamily: "Inter" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center p-4 bg-blue-100 text-blue-500 rounded-lg">
            <GraduationCap />
          </div>

          <div>
            <h1 className="text-2xl font-semibold">Quản lý sinh viên</h1>
            <p className="text-sm text-gray-500">
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
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* TABLE HEADER */}
        <div
          className="
          grid grid-cols-9 gap-4
          border-b border-gray-200
          bg-gray-50
          px-4 py-3
          text-xs font-semibold uppercase tracking-wide
          text-gray-600
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
          <div className="p-6 text-center text-gray-500">
            Đang tải dữ liệu...
          </div>
        ) : students.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
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
