import { useEffect, useState } from "react";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import type { OrgUnit } from "../../../types/structure";
import Textarea from "../../../components/UI/TextArea";
import { useUpdateCollegeMutation } from "../../../services/orgApi";

const CollegeForm = ({
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
  const [updateCollege] = useUpdateCollegeMutation();
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
  }, [initialData]);
  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };
  const onSubmit = async () => {
    await updateCollege({ id: collegeId, data: form }).unwrap();
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
          <h2 className="text-xl font-semibold">Cập nhật trường</h2>
          <p className="text-sm text-gray-500">Nhập thông tin trường</p>
        </div>

        {/* FORM */}
        <div className="space-y-3">
          <Input
            name="name"
            label="Tên trường"
            value={form.name || ""}
            onChange={onChange}
            placeholder="Trường bách khoa"
          />
          <Input
            name="code"
            label="Mã trường"
            value={form.code || ""}
            onChange={onChange}
            placeholder="ut"
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
          <Button label="Lưu thay đổi" onClick={onSubmit} />
        </div>
      </div>
    </Modal>
  );
};

export default CollegeForm;
