import { Edit, LibraryBig, Plus, Trash2 } from "lucide-react";
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
  useAddFacultyMutation,
  useDeleteFacultyMutation,
  useGetCollegesQuery,
  useGetFacultiesQuery,
  useUpdateFacultyMutation,
} from "../../../services/orgApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type CollegeItem = {
  id: string;
  code: string;
  name: string;
};

type FacultyItem = {
  id: string;
  code: string;
  name: string;
  description?: string;
  collegeId?: string | null;
  college?: {
    id: string;
    name: string;
    code?: string;
  } | null;
};

type FacultyFormState = {
  code: string;
  name: string;
  description: string;
  collegeId: string;
};

const emptyForm: FacultyFormState = {
  code: "",
  name: "",
  description: "",
  collegeId: "",
};

const FacultyManagementPage = () => {
  const dispatch = useAppDispatch();

  const { data: collegesData, isLoading: collegesLoading } =
    useGetCollegesQuery();
  const { data: facultiesData, isLoading: facultiesLoading } =
    useGetFacultiesQuery();

  const colleges = useMemo<CollegeItem[]>(
    () => collegesData?.data || [],
    [collegesData],
  );
  const faculties = useMemo<FacultyItem[]>(
    () => facultiesData?.data || [],
    [facultiesData],
  );

  const [addFaculty, { isLoading: adding }] = useAddFacultyMutation();
  const [updateFaculty, { isLoading: updating }] = useUpdateFacultyMutation();
  const [deleteFaculty, { isLoading: deleting }] = useDeleteFacultyMutation();

  const [openForm, setOpenForm] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyItem | null>(
    null,
  );
  const [deletingFaculty, setDeletingFaculty] = useState<FacultyItem | null>(
    null,
  );
  const [form, setForm] = useState<FacultyFormState>(emptyForm);

  const submitting = adding || updating;
  const loading = collegesLoading || facultiesLoading;

  const findCollegeById = (collegeId?: string | null) =>
    colleges.find((item) => item.id === collegeId);

  const getFacultyCollege = (faculty: FacultyItem) => {
    if (faculty.college?.name) {
      return {
        name: faculty.college.name,
        code: faculty.college.code || "",
      };
    }

    const collegeId = faculty.collegeId || faculty.college?.id;
    const byId = findCollegeById(collegeId);
    if (byId) {
      return {
        name: byId.name,
        code: byId.code || "",
      };
    }

    return {
      name: "Không thuộc trường",
      code: "",
    };
  };

  const openCreate = () => {
    setEditingFaculty(null);
    setForm(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (faculty: FacultyItem) => {
    setEditingFaculty(faculty);

    const collegeId =
      faculty.college?.id ||
      faculty.collegeId ||
      findCollegeById(faculty.collegeId)?.id ||
      "";

    setForm({
      code: faculty.code || "",
      name: faculty.name || "",
      description: faculty.description || "",
      collegeId,
    });

    setOpenForm(true);
  };

  const validate = () => {
    if (!form.name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên khoa" }),
      );
      return false;
    }

    if (!form.code.trim()) {
      dispatch(addToast({ type: "warning", message: "Vui lòng nhập mã khoa" }));
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
      collegeId: form.collegeId || null,
    };

    try {
      if (editingFaculty) {
        await updateFaculty({ id: editingFaculty.id, data: payload }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Cập nhật khoa thành công" }),
        );
      } else {
        await addFaculty(payload).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm khoa thành công" }),
        );
      }

      setOpenForm(false);
      setEditingFaculty(null);
      setForm(emptyForm);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: editingFaculty
            ? "Không thể cập nhật khoa"
            : "Không thể thêm khoa",
        }),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingFaculty) return;

    try {
      await deleteFaculty(deletingFaculty.id).unwrap();
      dispatch(addToast({ type: "success", message: "Xóa khoa thành công" }));
      setDeletingFaculty(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Không thể xóa khoa. Có thể đang được sử dụng.",
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
            <LibraryBig />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý khoa
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị, thêm, sửa, xóa danh sách khoa theo từng trường
            </p>
          </div>
        </div>

        <Button icon={Plus} label="Thêm khoa" size="sm" onClick={openCreate} />
      </div>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Danh sách khoa
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {faculties.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã khoa</th>
                <th className="px-6 py-3 text-left font-medium">Tên khoa</th>
                <th className="px-6 py-3 text-left font-medium">
                  Thuộc trường
                </th>
                <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {faculties.map((faculty) => {
                const college = getFacultyCollege(faculty);

                return (
                  <tr
                    key={faculty.id}
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                      {faculty.code}
                    </td>
                    <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                      {faculty.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-200">
                      <div className="font-medium">{college.name}</div>
                      {college.code ? (
                        <div className="text-xs text-gray-500 font-mono">
                          {college.code}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                      {faculty.description || "-"}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        icon={Edit}
                        onClick={() => openEdit(faculty)}
                      />
                      <Button
                        size="sm"
                        variant="danger"
                        icon={Trash2}
                        onClick={() => setDeletingFaculty(faculty)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có khoa nào" variant="outline" />
          </div>
        )}
      </div>

      <Modal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingFaculty(null);
        }}
        width="max-w-xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingFaculty ? "Cập nhật khoa" : "Thêm khoa"}
          </h2>

          <Input
            label="Mã khoa"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="VD: CNTT"
          />

          <Input
            label="Tên khoa"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập tên khoa"
          />

          <Select
            label="Trường quản lý"
            value={form.collegeId}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                collegeId: String(e.target.value),
              }))
            }
            options={[
              { value: "", label: "Không thuộc trường cụ thể" },
              ...colleges.map((college) => ({
                value: college.id,
                label: `${college.name} (${college.code})`,
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
                setEditingFaculty(null);
              }}
            />
            <Button
              label={editingFaculty ? "Cập nhật" : "Tạo mới"}
              size="sm"
              onClick={handleSave}
              loading={submitting}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingFaculty)}
        onClose={() => setDeletingFaculty(null)}
        onConfirm={handleDelete}
        type="danger"
        loading={deleting}
        title="Xác nhận xóa khoa"
        description={`Bạn có chắc muốn xóa ${deletingFaculty?.name || "khoa này"}?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default FacultyManagementPage;
