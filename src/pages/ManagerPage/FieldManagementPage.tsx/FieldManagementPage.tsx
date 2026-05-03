import { BookMarked, Edit, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import ConfirmModal from "../../../components/UI/ConfirmModal";
import Loader from "../../../components/UI/Loader";
import Badge from "../../../components/UI/Badge";
import {
  useCreateFieldMutation,
  useDeleteFieldMutation,
  useGetFieldsQuery,
  useUpdateFieldMutation,
} from "../../../services/resourceApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

type FieldItem = {
  id: string;
  code?: string;
  name: string;
  description?: string;
};

type FieldFormState = {
  code: string;
  name: string;
  description: string;
};

const emptyForm: FieldFormState = {
  code: "",
  name: "",
  description: "",
};

const FieldManagementPage = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading } = useGetFieldsQuery();

  const fields = useMemo<FieldItem[]>(() => data?.data || [], [data]);

  const [createField, { isLoading: creating }] = useCreateFieldMutation();
  const [updateField, { isLoading: updating }] = useUpdateFieldMutation();
  const [deleteField, { isLoading: deleting }] = useDeleteFieldMutation();

  const [openForm, setOpenForm] = useState(false);
  const [editingField, setEditingField] = useState<FieldItem | null>(null);
  const [deletingField, setDeletingField] = useState<FieldItem | null>(null);
  const [form, setForm] = useState<FieldFormState>(emptyForm);

  const submitting = creating || updating;

  const openCreate = () => {
    setEditingField(null);
    setForm(emptyForm);
    setOpenForm(true);
  };

  const openEdit = (field: FieldItem) => {
    setEditingField(field);
    setForm({
      code: field.code || "",
      name: field.name || "",
      description: field.description || "",
    });
    setOpenForm(true);
  };

  const validate = () => {
    if (!form.name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên lĩnh vực" }),
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
      if (editingField) {
        await updateField({ fieldId: editingField.id, ...payload }).unwrap();
        dispatch(
          addToast({
            type: "success",
            message: "Cập nhật lĩnh vực thành công",
          }),
        );
      } else {
        await createField(payload).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm lĩnh vực thành công" }),
        );
      }

      setOpenForm(false);
      setEditingField(null);
      setForm(emptyForm);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: editingField
            ? "Không thể cập nhật lĩnh vực"
            : "Không thể thêm lĩnh vực",
        }),
      );
    }
  };

  const handleDelete = async () => {
    if (!deletingField) return;

    try {
      await deleteField({ fieldId: deletingField.id }).unwrap();
      dispatch(
        addToast({ type: "success", message: "Xóa lĩnh vực thành công" }),
      );
      setDeletingField(null);
    } catch {
      dispatch(
        addToast({
          type: "error",
          message: "Không thể xóa lĩnh vực. Có thể đang được sử dụng.",
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
            <BookMarked />
          </div>

          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Quản lý lĩnh vực
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Hiển thị, thêm, sửa, xóa danh sách lĩnh vực nghiên cứu
            </p>
          </div>
        </div>

        <Button
          icon={Plus}
          label="Thêm lĩnh vực"
          size="sm"
          onClick={openCreate}
        />
      </div>

      <p className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        Danh sách lĩnh vực
      </p>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        {fields.length > 0 ? (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-b border-gray-300 dark:border-gray-700">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Mã lĩnh vực</th>
                <th className="px-6 py-3 text-left font-medium">
                  Tên lĩnh vực
                </th>
                <th className="px-6 py-3 text-left font-medium">Mô tả</th>
                <th className="px-6 py-3 text-center font-medium">Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {fields.map((field) => (
                <tr
                  key={field.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">
                    {field.code || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-800 dark:text-gray-200">
                    {field.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                    {field.description || "-"}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      icon={Edit}
                      onClick={() => openEdit(field)}
                    />
                    <Button
                      size="sm"
                      variant="danger"
                      icon={Trash2}
                      onClick={() => setDeletingField(field)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="flex items-center justify-center h-40">
            <Badge label="Chưa có lĩnh vực nào" variant="outline" />
          </div>
        )}
      </div>

      <Modal
        open={openForm}
        onClose={() => {
          setOpenForm(false);
          setEditingField(null);
        }}
        width="max-w-xl"
      >
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {editingField ? "Cập nhật lĩnh vực" : "Thêm lĩnh vực"}
          </h2>

          <Input
            label="Mã lĩnh vực"
            value={form.code}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, code: e.target.value }))
            }
            placeholder="VD: AI"
          />

          <Input
            label="Tên lĩnh vực"
            value={form.name}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Nhập tên lĩnh vực"
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
                setEditingField(null);
              }}
            />
            <Button
              label={editingField ? "Cập nhật" : "Tạo mới"}
              size="sm"
              onClick={handleSave}
              loading={submitting}
            />
          </div>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(deletingField)}
        onClose={() => setDeletingField(null)}
        onConfirm={handleDelete}
        type="danger"
        loading={deleting}
        title="Xác nhận xóa lĩnh vực"
        description={`Bạn có chắc muốn xóa ${deletingField?.name || "lĩnh vực này"}?`}
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </div>
  );
};

export default FieldManagementPage;
