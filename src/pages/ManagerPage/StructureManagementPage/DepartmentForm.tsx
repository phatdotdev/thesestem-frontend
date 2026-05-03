import { useState } from "react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import type { Faculty } from "../../../types/structure";
import Textarea from "../../../components/UI/TextArea";
import { useAddDepartmentToFacultyMutation } from "../../../services/orgApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

const DepartmentForm = ({
  facultyId,
  open,
  initialData,
  onClose,
}: {
  facultyId: string;
  open: boolean;
  initialData: Faculty | null;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [addDepartmentToFaculty] = useAddDepartmentToFacultyMutation();
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });
  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const onSubmit = async () => {
    if (!form.name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên bộ môn" }),
      );
      return;
    }

    if (initialData) {
    } else {
      try {
        await addDepartmentToFaculty({ id: facultyId, data: form }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm bộ môn thành công" }),
        );
      } catch (error) {
        console.log(error);
        dispatch(addToast({ type: "error", message: "Không thể thêm bộ môn" }));
        return;
      }
    }
    setForm({
      name: "",
      code: "",
      description: "",
    });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
            {isEdit ? "Cập nhật bộ môn" : "Thêm bộ môn"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nhập thông tin đơn vị cấp Bộ môn.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <Input
            name="name"
            label="Tên bộ môn"
            value={form.name || ""}
            onChange={onChange}
            placeholder="Bộ môn công nghệ phần mềm"
          />
          <Input
            name="code"
            label="Mã bộ môn"
            value={form.code || ""}
            onChange={onChange}
            placeholder="se"
          />
          <Textarea
            name="description"
            label="Mô tả"
            value={form.description || ""}
            onChange={onChange}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button label="Hủy" variant="ghost" size="sm" onClick={onClose} />
          <Button
            label={isEdit ? "Lưu thay đổi" : "Thêm bộ môn"}
            size="sm"
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentForm;
