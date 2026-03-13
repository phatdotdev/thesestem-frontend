import { useState } from "react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import type { Faculty } from "../../../types/structure";
import Textarea from "../../../components/UI/TextArea";
import { useAddDepartmentToFacultyMutation } from "../../../services/orgApi";

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
    if (initialData) {
    } else {
      await addDepartmentToFaculty({ id: facultyId, data: form }).unwrap();
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
      <div className="space-y-3">
        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">
            {isEdit ? "Cập nhật bộ môn" : "Thêm bộ môn"}
          </h2>
          <p className="text-sm text-gray-500">Nhập thông tin bộ môn</p>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          <Input
            name="name"
            label="Tên khoa"
            value={form.name || ""}
            onChange={onChange}
            placeholder="Bộ môn công nghệ phần mềm"
          />
          <Input
            name="code"
            label="Mã khoa"
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button label="Hủy" variant="ghost" onClick={onClose} />
          <Button
            label={isEdit ? "Lưu thay đổi" : "Thêm bộ môn"}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentForm;
