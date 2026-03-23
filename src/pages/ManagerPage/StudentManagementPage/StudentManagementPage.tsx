import { useState } from "react";
import { FaFileExcel, FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Plus, User, Users, UserSearch } from "lucide-react";

import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";
import Badge from "../../../components/UI/Badge";

import { useSearchStudentsQuery } from "../../../services/userApi";

import StudentFormModal from "./StudentFormModal";
import ExcelImportModal from "./ExcelImportModal";
import StudentRow from "./StudentRow";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

import type { StudentResponse } from "../../../types/student";

const StudentManagementPage = () => {
  const size = 5;

  const [form, setForm] = useState({
    name: "",
    code: "",
    programId: "",
    courseId: "",
  });

  const [tempForm, setTempForm] = useState({
    name: "",
    code: "",
    programId: "",
    courseId: "",
  });

  const [page, setPage] = useState(0);

  const { data: studentResponse, isLoading } = useSearchStudentsQuery({
    ...form,
    page,
    size,
  });

  const students = studentResponse?.data.content || [];
  const totalPages = studentResponse?.data.totalPages || 0;

  const [student, setStudent] = useState<StudentResponse | null>(null);

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openExcel, setOpenExcel] = useState(false);

  const handleChange = (field: string, value: string) => {
    setTempForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setForm(tempForm);
    setPage(0);
  };

  const handleReset = () => {
    setTempForm({
      name: "",
      code: "",
      programId: "",
      courseId: "",
    });

    setForm({
      name: "",
      code: "",
      programId: "",
      courseId: "",
    });

    setPage(0);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <User size={26} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý sinh viên
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý thông tin sinh viên thuộc tổ chức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            label="Nhập Excel"
            icon={FaFileExcel}
            variant="outline"
            size="sm"
            onClick={() => setOpenExcel(true)}
          />

          <Button
            onClick={() => {
              setStudent(null);
              setOpenModal(true);
            }}
            label="Thêm sinh viên"
            icon={Plus}
            size="sm"
          />
        </div>
      </div>

      {/* Search */}
      <div className="rounded border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 mb-2">
          <UserSearch size={22} />
          <p className="text-lg font-semibold">Tìm kiếm sinh viên</p>
        </div>

        <div className="grid grid-cols-1 gap-x-4 gap-y-2 lg:grid-cols-4 mb-2">
          <Input
            label="Mã sinh viên"
            size="sm"
            value={tempForm.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <Input
            label="Họ tên"
            size="sm"
            value={tempForm.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Select
            label="Chương trình"
            options={[{ label: "Chọn chương trình", value: "" }]}
            size="sm"
            value={tempForm.programId}
            onChange={(e) => handleChange("programId", e.target.value)}
          />

          <Select
            label="Khóa"
            options={[{ label: "Chọn khóa", value: "" }]}
            size="sm"
            value={tempForm.courseId}
            onChange={(e) => handleChange("courseId", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            icon={GrPowerReset}
            label="Xóa lọc"
            size="sm"
            variant="ghost"
            className="border border-gray-300 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
            onClick={handleReset}
          />

          <Button
            icon={FaSearch}
            label="Tìm kiếm"
            size="sm"
            onClick={handleSearch}
          />
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 mb-2 px-2">
        <Users size={20} />
        <p className="text-lg font-semibold">Danh sách sinh viên</p>
      </div>

      {/* Table */}
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* Header */}
        <div
          className="
          grid grid-cols-9 gap-4
          border-b border-gray-300 dark:border-gray-700
          bg-gray-50 dark:bg-gray-800
          px-4 py-3
          text-xs font-semibold uppercase
          tracking-wide text-gray-600 dark:text-gray-300
        "
        >
          <div className="col-span-2 text-center">Sinh viên</div>
          <div className="text-center">Mã SV</div>
          <div className="text-center">Ngành</div>
          <div className="text-center">Khóa</div>
          <div className="text-center">Ngày sinh</div>
          <div className="text-center">Giới tính</div>
          <div className="text-center">SĐT</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : students.length > 0 ? (
          students.map((student: StudentResponse) => (
            <StudentRow
              key={student.id}
              student={student}
              onEdit={() => {
                setStudent(student);
                setOpenModal(true);
              }}
              onDelete={() => {
                setStudent(student);
                setOpenDeleteModal(true);
              }}
            />
          ))
        ) : (
          <div className="h-40 flex items-center justify-center">
            <Badge label="Chưa có sinh viên nào" variant="ghost" />
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <Button
            label="Trước"
            size="sm"
            variant="outline"
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
          />

          {[...Array(totalPages)].map((_, index) => (
            <Button
              key={index}
              label={(index + 1).toString()}
              size="sm"
              variant={page === index ? "info" : "outline"}
              onClick={() => setPage(index)}
            />
          ))}

          <Button
            label="Sau"
            size="sm"
            variant="outline"
            disabled={page === totalPages - 1}
            onClick={() => setPage((prev) => prev + 1)}
          />
        </div>
      )}

      {/* Modals */}
      <StudentFormModal
        student={student}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        student={student}
      />

      {openExcel && (
        <ExcelImportModal
          onImport={() => {}}
          onClose={() => setOpenExcel(false)}
        />
      )}
    </div>
  );
};

export default StudentManagementPage;
