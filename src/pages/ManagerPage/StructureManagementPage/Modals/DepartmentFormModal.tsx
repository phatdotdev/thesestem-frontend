import { useEffect, useState } from "react";
import Modal from "../../../../components/UI/Modal";
import Textarea from "../../../../components/UI/TextArea";
import type { OrgUnit } from "../../../../types/structure";
import Input from "../../../../components/UI/Input";
import { useUpdateDepartmentMutation } from "../../../../services/orgApi";
import Button from "../../../../components/UI/Button";

const DepartmentFormModal = ({
  open,
  onClose,
  department,
}: {
  open: boolean;
  onClose: () => void;
  department: OrgUnit;
}) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();

  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setCode(department.code || "");
      setDescription(department.description || "");
    }
  }, [department]);

  const handleSubmit = async () => {
    try {
      await updateDepartment({
        id: department.id,
        data: { name, code, description },
      }).unwrap();

      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[520px] max-w-full bg-white rounded-xl p-2 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            Cập nhật đơn vị
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Chỉnh sửa thông tin của bộ môn
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Tên đơn vị"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên đơn vị"
          />

          <Input
            label="Mã đơn vị"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="VD: CNTT"
          />
        </div>

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Mô tả"
          placeholder="Mô tả đơn vị của bạn"
          rows={4}
        />

        {/* Footer */}
        <div className="flex justify-end gap-3 pt-2">
          <Button onClick={onClose} variant="outline" label="Hủy" />

          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentFormModal;
