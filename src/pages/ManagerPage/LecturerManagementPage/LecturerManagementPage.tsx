import { useState } from "react";
import { FaFileExcel, FaSearch } from "react-icons/fa";
import { GrPowerReset } from "react-icons/gr";
import { Plus, User } from "lucide-react";

import Button from "../../../components/UI/Button";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Input from "../../../components/UI/Input";
import OrganizationUnitSelecter from "../../../components/common/UnitSelecter";

import {
  useDeleteLecturerMutation,
  useSearchLecturersQuery,
} from "../../../services/userApi";
import LecturerFormModal from "./LecturerFormModal";
import LecturerRow from "./LecturerRow";
import type { LecturerResponse } from "../../../types/lecturer";
import Badge from "../../../components/UI/Badge";
import ExcelImportLecturerModal from "./ExcelImportLecturerModal";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type UnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

const LecturerManagementPage = () => {
  const size = 5;

  const [form, setForm] = useState({
    name: "",
    code: "",
    collegeId: "",
    facultyId: "",
    departmentId: "",
  });
  const [selectedUnit, setSelectedUnit] = useState<{
    type: UnitType;
    id: string | null;
    name?: string;
  } | null>(null);

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
  const [openExcel, setOpenExcel] = useState(false);
  const [deleteLecturer, { isLoading: isDeletingLecturer }] =
    useDeleteLecturerMutation();

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    setPage(0);
  };

  const dispatch = useAppDispatch();

  const handleUnitChange = (type: UnitType, unitId: string | null) => {
    setSelectedUnit({ type, id: unitId });

    setForm((prev) => ({
      ...prev,
      collegeId: type === "COLLEGE" ? (unitId ?? "") : "",
      facultyId: type === "FACULTY" ? (unitId ?? "") : "",
      departmentId: type === "DEPARTMENT" ? (unitId ?? "") : "",
    }));
  };

  const handleReset = () => {
    setForm({
      name: "",
      code: "",
      departmentId: "",
      facultyId: "",
      collegeId: "",
    });
    setSelectedUnit(null);
    setPage(0);
  };

  const handleDeleteLecturer = async () => {
    if (!lecturer) return;

    try {
      await deleteLecturer(lecturer.id).unwrap();
      setOpenDeleteModal(false);
      setLecturer(null);
      dispatch(
        addToast({
          id: "",
          type: "success",
          message: "Xóa giảng viên thành công",
        }),
      );
    } catch (error) {
      dispatch(addToast({ id: "", type: "error", message: "Khoong" }));
    }
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
            onClick={() => setOpenExcel(true)}
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
      <div className="rounded-xl border border-gray-200 dark:border-gray-700/60 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-200 dark:border-gray-700/60 text-gray-700 dark:text-gray-300">
          <User size={16} />
          <p className="text-xs font-semibold uppercase tracking-wider">
            Tìm kiếm giảng viên
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-4 p-4 items-end">
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

          <OrganizationUnitSelecter
            size="sm"
            value={selectedUnit}
            onChange={handleUnitChange}
            showAllOption
            width="100%"
          />

          <div className="flex justify-end gap-3">
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
      </div>

      {/* TITLE */}
      <div className="flex items-center gap-2 text-gray-800 dark:text-gray-200 px-2">
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

      <ConfirmModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={handleDeleteLecturer}
        title={`Bạn có chắc chắn muốn xóa cán bộ ${lecturer?.fullName}?`}
        description="Hành động này không thể hoàn tác!"
        confirmText="Xóa"
        type="danger"
        loading={isDeletingLecturer}
      />

      <ExcelImportLecturerModal
        open={openExcel}
        onClose={() => setOpenExcel(false)}
      />
    </div>
  );
};

export default LecturerManagementPage;
