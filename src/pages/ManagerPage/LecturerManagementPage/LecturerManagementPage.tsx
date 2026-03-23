import { useState } from "react";
import { FaFileExcel, FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Plus, User, Users, UserSearch } from "lucide-react";

import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Select from "../../../components/UI/Select";

import { useSearchLecturersQuery } from "../../../services/userApi";
import LecturerFormModal from "./LecturerFormModal";
import LecturerRow from "./LecturerRow";
import type { LecturerResponse } from "../../../types/lecturer";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import Badge from "../../../components/UI/Badge";
import {
  useGetCollegesQuery,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
} from "../../../services/orgApi";

const LecturerManagementPage = () => {
  const size = 5;

  const [form, setForm] = useState({
    name: "",
    code: "",
    email: "",
    collegeId: "",
    facultyId: "",
    departmentId: "",
  });

  const [page, setPage] = useState(0);

  const { data: lecturerResponse, isLoading } = useSearchLecturersQuery({
    ...form,
    page,
    size,
  });

  const lecturers = lecturerResponse?.data.content || [];
  const totalPages = lecturerResponse?.data.totalPages || 0;

  const [lecturer, setLecturer] = useState<null | LecturerResponse>(null);

  const [openModal, setOpenModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setPage(0);
  };

  const { data: collegesResponse } = useGetCollegesQuery();
  const { data: facultiesResponse } = useGetFacultiesQuery();
  const { data: departmentsResponse } = useGetDeparmentsQuery();

  const colleges = (collegesResponse?.data || []).map((college: any) => ({
    value: college.id,
    label: college.name,
  }));

  const faculties = (facultiesResponse?.data || []).map((faculty: any) => ({
    value: faculty.id,
    label: faculty.name,
  }));

  const departments = (departmentsResponse?.data || []).map(
    (department: any) => ({
      value: department.id,
      label: department.name,
    }),
  );

  const handleReset = () => {
    setForm({
      name: "",
      code: "",
      email: "",
      departmentId: "",
      facultyId: "",
      collegeId: "",
    });
    setPage(0);
  };

  return (
    <div className="space-y-4 bg-white dark:bg-gray-900 px-6 py-4 rounded-lg border border-gray-300 dark:border-gray-700 shadow">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
            <User size={26} />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý giảng viên
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý thông tin cán bộ thuộc tổ chức
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            label="Nhập Excel"
            icon={FaFileExcel}
            variant="outline"
            size="sm"
          />

          <Button
            onClick={() => {
              setLecturer(null);
              setOpenModal(true);
            }}
            label="Thêm giảng viên"
            icon={Plus}
            size="sm"
          />
        </div>
      </div>

      {/* SEARCH */}
      <div className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 mb-3">
          <UserSearch size={20} />
          <p className="text-lg font-semibold">Tìm kiếm giảng viên</p>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Input
            label="Mã giảng viên"
            size="sm"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <Input
            label="Họ tên"
            size="sm"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            label="Email"
            size="sm"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Select
            label="Trường"
            options={[{ label: "Chọn trường", value: "" }, ...colleges]}
            size="sm"
            value={form.collegeId}
            onChange={(e) => handleChange("collegeId", e.target.value)}
          />

          <Select
            label="Khoa"
            options={[{ label: "Chọn khoa", value: "" }, ...faculties]}
            size="sm"
            value={form.facultyId}
            onChange={(e) => handleChange("facultyId", e.target.value)}
          />

          <Select
            label="Bộ môn"
            options={[{ label: "Chọn bộ môn", value: "" }, ...departments]}
            size="sm"
            value={form.departmentId}
            onChange={(e) => handleChange("departmentId", e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3 mt-4">
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

      {/* TITLE */}
      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 px-2">
        <Users size={20} />
        <p className="text-lg font-semibold">Danh sách giảng viên</p>
      </div>

      {/* TABLE */}
      <div className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg overflow-hidden">
        {/* HEADER */}
        <div className="grid grid-cols-9 gap-4 border-b border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-300">
          <div className="col-span-2 text-center">Cán bộ</div>
          <div className="text-center">Mã CB</div>
          <div className="col-span-2 text-center">Đơn vị</div>
          <div className="text-center">Ngày sinh</div>
          <div className="text-center">Giới tính</div>
          <div className="text-center">Số điện thoại</div>
          <div className="text-center">Hành động</div>
        </div>

        {/* ROWS */}
        {isLoading ? (
          <div className="h-40 flex items-center justify-center text-gray-500 dark:text-gray-400">
            Đang tải dữ liệu...
          </div>
        ) : lecturers.length > 0 ? (
          lecturers.map((lecturer: LecturerResponse) => (
            <LecturerRow
              key={lecturer.id}
              lecturer={lecturer}
              onEdit={() => {
                setLecturer(lecturer);
                setOpenModal(true);
              }}
              onDelete={() => {
                setLecturer(lecturer);
                setOpenDeleteModal(true);
              }}
            />
          ))
        ) : (
          <div className="h-40 flex items-center justify-center">
            <Badge label="Chưa thêm giảng viên nào" variant="ghost" />
          </div>
        )}
      </div>

      {/* PAGINATION */}
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

      {/* MODALS */}
      <LecturerFormModal
        lecturer={lecturer}
        open={openModal}
        onClose={() => setOpenModal(false)}
      />

      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        lecturer={lecturer}
      />
    </div>
  );
};

export default LecturerManagementPage;
