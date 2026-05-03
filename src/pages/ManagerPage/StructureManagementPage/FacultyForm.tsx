import { useEffect, useState } from "react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import type { OrgUnit } from "../../../types/structure";
import Textarea from "../../../components/UI/TextArea";
import {
  useAddFacultyToCollegeMutation,
  useUpdateFacultyMutation,
} from "../../../services/orgApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/toastSlice";

const FacultyForm = ({
  collegeId,
  open,
  initialData,
  onClose,
}: {
  collegeId: string;
  open: boolean;
  initialData: OrgUnit | null;
  onClose: () => void;
}) => {
  const dispatch = useAppDispatch();
  const [addFacultyToCollege] = useAddFacultyToCollegeMutation();
  const [updateFaculty] = useUpdateFacultyMutation();
  const isEdit = !!initialData;
  const [form, setForm] = useState({
    name: "",
    code: "",
    description: "",
  });

  useEffect(() => {
    setForm({
      name: initialData?.name || "",
      code: initialData?.code || "",
      description: initialData?.description || "",
    });
  }, [initialData, open]);

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
        addToast({ type: "warning", message: "Vui lòng nhập tên khoa" }),
      );
      return;
    }

    if (initialData) {
      try {
        await updateFaculty({ id: initialData.id, data: form }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Cập nhật khoa thành công" }),
        );
      } catch (error) {
        console.log(error);
        dispatch(
          addToast({ type: "error", message: "Không thể cập nhật khoa" }),
        );
        return;
      }
    } else {
      try {
        await addFacultyToCollege({ id: collegeId, data: form }).unwrap();
        dispatch(
          addToast({ type: "success", message: "Thêm khoa thành công" }),
        );
      } catch (error) {
        console.log(error);
        dispatch(addToast({ type: "error", message: "Không thể thêm khoa" }));
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
            {isEdit ? "Cập nhật khoa" : "Thêm khoa"}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Nhập thông tin đơn vị cấp Khoa.
          </p>
        </div>

        <div className="space-y-3 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <Input
            name="name"
            label="Tên khoa"
            value={form.name || ""}
            onChange={onChange}
            placeholder="Khoa Công nghệ Thông tin & Truyền thông"
          />
          <Input
            name="code"
            label="Mã khoa"
            value={form.code || ""}
            onChange={onChange}
            placeholder="cit"
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
            label={isEdit ? "Lưu thay đổi" : "Thêm khoa"}
            size="sm"
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FacultyForm;
