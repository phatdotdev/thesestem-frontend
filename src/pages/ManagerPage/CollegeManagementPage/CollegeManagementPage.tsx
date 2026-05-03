import { Building2, Edit, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Loader from "../../../components/UI/Loader";
import Badge from "../../../components/UI/Badge";
import {
  useAddCollegeMutation,
  useDeleteCollegeMutation,
  useGetCollegesQuery,
  useUpdateCollegeMutation,
} from "../../../services/orgApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type CollegeItem = {
  id: string;
  code: string;
  name: string;
  description?: string;
};

type CollegeFormState = {
  code: string;
  name: string;
  description: string;
};

const emptyForm: CollegeFormState = {
  code: "",
  name: "",
  description: "",
};

const CollegeManagementPage = () => {
  const dispatch = useAppDispatch();

  const { data, isLoading } = useGetCollegesQuery();
  const colleges = useMemo<CollegeItem[]>(() => data?.data || [], [data]);

  const [addCollege, { isLoading: adding }] = useAddCollegeMutation();
  const [updateCollege, { isLoading: updating }] = useUpdateCollegeMutation();
  const [deleteCollege, { isLoading: deleting }] = useDeleteCollegeMutation();

  const [openForm, setOpenForm] = useState(false);
  const [editingCollege, setEditingCollege] = useState<CollegeItem | null>(
    null,
  );
  const [deletingCollege, setDeletingCollege] = useState<CollegeItem | null>(
    null,
  );
  const [form, setForm] = useState<CollegeFormState>(emptyForm);

  const submitting = adding || updating;

  const openCreate = () => {
    setEditingCollege(null);
    setForm(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (college: CollegeItem) => {
    setEditingCollege(college);
    setForm({
      code: college.code || "",
      name: college.name || "",
      description: college.description || "",
    });
    setOpenForm(true);
  };

  const validate = () => {
    if (!form.name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên trường" }),
      );
      return false;
    }

    if (!form.code.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập mã trường" }),
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
    };

    try {
      if (editingCollege) {
        await updateCollege({ id: editingCollege.id, data: payload }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Cập nhật trường thành công" }),
        );
      } else {
        await addCollege(payload).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm trường thành công" }),
        );
      }

      setOpenForm(false);
      setEditingCollege(null);
      setForm(emptyForm);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: editingCollege
            ? "Không thể cập nhật trường"
            : "Không thể thêm trường",
        }),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingCollege) return;

    try {
      await deleteCollege(deletingCollege.id).unwrap();
      dispatch(addToast({ type: "success", message: "Xóa trường thành công" }));
      setDeletingCollege(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Không thể xóa trường. Có thể đang được sử dụng.",
        }),
      );
    }
  };

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300">
            <Building2 />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý trường
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị, thêm, sửa, xóa danh sách trường trong tổ chức
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm trường"
          size="sm"
          onClick={openCreate}
        />
      </div>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Danh sách trường
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {colleges.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã trường</th>
                <th className="px-6 py-3 text-left font-medium">Tên trường</th>
                <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {colleges.map((college) => (
                <tr
                  key={college.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {college.code}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {college.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {college.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Edit}
                      onClick={() => openEdit(college)}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => setDeletingCollege(college)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có trường nào" variant="outline" />
          </div>
        )}
      </div>

      <Modal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingCollege(null);
        }}
        width="max-w-xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingCollege ? "Cập nhật trường" : "Thêm trường"}
          </h2>

          <Input
            label="Mã trường"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="VD: DCT"
          />

          <Input
            label="Tên trường"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập tên trường"
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
                setEditingCollege(null);
              }}
            />
            <Button
              label={editingCollege ? "Cập nhật" : "Tạo mới"}
              size="sm"
              onClick={handleSave}
              loading={submitting}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingCollege)}
        onClose={() => setDeletingCollege(null)}
        onConfirm={handleDelete}
        type="danger"
        loading={deleting}
        title="Xác nhận xóa trường"
        description={`Bạn có chắc muốn xóa ${deletingCollege?.name || "trường này"}?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default CollegeManagementPage;
