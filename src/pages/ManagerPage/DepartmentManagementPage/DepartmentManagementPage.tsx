import { Edit, Library, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import Select from "../../../components/UI/Select";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Loader from "../../../components/UI/Loader";
import Badge from "../../../components/UI/Badge";
import {
  useAddDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDeparmentsQuery,
  useGetFacultiesQuery,
  useUpdateDepartmentMutation,
} from "../../../services/orgApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type FacultyItem = {
  id: string;
  code: string;
  name: string;
};

type DepartmentItem = {
  id: string;
  code: string;
  name: string;
  description?: string;
  facultyId?: string | null;
  faculty?: {
    id: string;
    name: string;
    code?: string;
  } | null;
};

type DepartmentFormState = {
  code: string;
  name: string;
  description: string;
  facultyId: string;
};

const emptyForm: DepartmentFormState = {
  code: "",
  name: "",
  description: "",
  facultyId: "",
};

const DepartmentManagementPage = () => {
  const dispatch = useAppDispatch();

  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();
  const { data: departmentsData, isLoading: departmentsLoading } =
    useGetDeparmentsQuery();

  const faculties = useMemo<FacultyItem[]>(
    () => facultiesData?.data || [],
    [facultiesData],
  );
  const departments = useMemo<DepartmentItem[]>(
    () => departmentsData?.data || [],
    [departmentsData],
  );

  const [addDepartment, { isLoading: adding }] = useAddDepartmentMutation();
  const [updateDepartment, { isLoading: updating }] =
    useUpdateDepartmentMutation();
  const [deleteDepartment, { isLoading: deleting }] =
    useDeleteDepartmentMutation();

  const [openForm, setOpenForm] = useState(false);
  const [editingDepartment, setEditingDepartment] =
    useState<DepartmentItem | null>(null);
  const [deletingDepartment, setDeletingDepartment] =
    useState<DepartmentItem | null>(null);
  const [form, setForm] = useState<DepartmentFormState>(emptyForm);

  const submitting = adding || updating;
  const loading = facultiesLoading || departmentsLoading;

  const findFacultyById = (facultyId?: string | null) =>
    faculties.find((item) => item.id === facultyId);

  const getDepartmentFaculty = (department: DepartmentItem) => {
    if (department.faculty?.name) {
      return {
        name: department.faculty.name,
        code: department.faculty.code || "",
      };
    }

    const facultyId = department.facultyId || department.faculty?.id;
    const byId = findFacultyById(facultyId);
    if (byId) {
      return {
        name: byId.name,
        code: byId.code || "",
      };
    }

    return {
      name: "Không thuộc khoa cụ thể",
      code: "",
    };
  };

  const openCreate = () => {
    setEditingDepartment(null);
    setForm(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (department: DepartmentItem) => {
    setEditingDepartment(department);

    const facultyId =
      department.faculty?.id ||
      department.facultyId ||
      findFacultyById(department.facultyId)?.id ||
      "";

    setForm({
      code: department.code || "",
      name: department.name || "",
      description: department.description || "",
      facultyId,
    });

    setOpenForm(true);
  };

  const validate = () => {
    if (!form.name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên bộ môn" }),
      );
      return false;
    }

    if (!form.code.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập mã bộ môn" }),
      );
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      code: form.code.trim(),
      name: form.name.trim(),
      description: form.description.trim(),
      facultyId: form.facultyId || null,
    };

    try {
      if (editingDepartment) {
        await updateDepartment({
          id: editingDepartment.id,
          data: payload,
        }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Cập nhật bộ môn thành công" }),
        );
      } else {
        await addDepartment(payload).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm bộ môn thành công" }),
        );
      }

      setOpenForm(false);
      setEditingDepartment(null);
      setForm(emptyForm);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: editingDepartment
            ? "Không thể cập nhật bộ môn"
            : "Không thể thêm bộ môn",
        }),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingDepartment) return;

    try {
      await deleteDepartment(deletingDepartment.id).unwrap();
      dispatch(addToast({ type: "success", message: "Xóa bộ môn thành công" }));
      setDeletingDepartment(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Không thể xóa bộ môn. Có thể đang được sử dụng.",
        }),
      );
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
            <Library />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý bộ môn
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị, thêm, sửa, xóa danh sách bộ môn theo từng khoa
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm bộ môn"
          size="sm"
          onClick={openCreate}
        />
      </div>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Danh sách bộ môn
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {departments.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã bộ môn</th>
                <th className="px-6 py-3 text-left font-medium">Tên bộ môn</th>
                <th className="px-6 py-3 text-left font-medium">Thuộc khoa</th>
                <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {departments.map((department) => {
                const faculty = getDepartmentFaculty(department);

                return (
                  <tr
                    key={department.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {department.code}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {department.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                      <div className="font-medium">{faculty.name}</div>
                      {faculty.code ? (
                        <div className="text-xs text-gray-500 font-mono">
                          {faculty.code}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {department.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Edit}
                        onClick={() => openEdit(department)}
                      />
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => setDeletingDepartment(department)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có bộ môn nào" variant="outline" />
          </div>
        )}
      </div>

      <Modal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingDepartment(null);
        }}
        width="max-w-xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingDepartment ? "Cập nhật bộ môn" : "Thêm bộ môn"}
          </h2>

          <Input
            label="Mã bộ môn"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="VD: CNPM"
          />

          <Input
            label="Tên bộ môn"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập tên bộ môn"
          />

          <Select
            label="Khoa quản lý"
            value={form.facultyId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                facultyId: String(e.target.value),
              }))
            }
            options={[
              { value: "", label: "Không thuộc khoa cụ thể" },
              ...faculties.map((faculty) => ({
                value: faculty.id,
                label: `${faculty.name} (${faculty.code})`,
              })),
            ]}
          />

          <Textarea
            label="Mô tả"
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Nhập mô tả"
          />

          <div className="flex justify-end gap-2 pt-2">
            <Button
              label="Hủy"
              variant="outline"
              size="sm"
              onClick={() => {
                setOpenForm(false);
                setEditingDepartment(null);
              }}
            />
            <Button
              label={editingDepartment ? "Cập nhật" : "Tạo mới"}
              size="sm"
              onClick={handleSave}
              loading={submitting}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingDepartment)}
        onClose={() => setDeletingDepartment(null)}
        onConfirm={handleDelete}
        type="danger"
        loading={deleting}
        title="Xác nhận xóa bộ môn"
        description={`Bạn có chắc muốn xóa ${deletingDepartment?.name || "bộ môn này"}?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default DepartmentManagementPage;
