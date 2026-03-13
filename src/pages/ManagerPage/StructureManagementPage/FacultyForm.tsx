import { useState } from "react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import type { Faculty } from "../../../types/structure";
import Textarea from "../../../components/UI/TextArea";
import { useAddFacultyToCollegeMutation } from "../../../services/orgApi";

const FacultyForm = ({
  collegeId,
  open,
  initialData,
  onClose,
}: {
  collegeId: string;
  open: boolean;
  initialData: Faculty | null;
  onClose: () => void;
}) => {
  const [addFacultyToCollege] = useAddFacultyToCollegeMutation();
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
      await addFacultyToCollege({ id: collegeId, data: form }).unwrap();
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
            {isEdit ? "Cập nhật khoa" : "Thêm khoa"}
          </h2>
          <p className="text-sm text-gray-500">Nhập thông tin khoa</p>
        </div>

        {/* FORM */}
        <div className="space-y-3">
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

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button label="Hủy" variant="ghost" onClick={onClose} />
          <Button
            label={isEdit ? "Lưu thay đổi" : "Thêm khoa"}
            onClick={onSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FacultyForm;
