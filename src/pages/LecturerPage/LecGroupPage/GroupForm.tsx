import { useEffect, useState } from "react";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";
import Textarea from "../../../components/UI/TextArea";
import { FileText, Users } from "lucide-react";
import Button from "../../../components/UI/Button";
import type { GroupResponse } from "../../../types/group";
import {
  useCreateGroupMutation,
  useUpdateGroupMutation,
} from "../../../services/groupApi";

const GroupForm = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: GroupResponse | null;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [createGroup] = useCreateGroupMutation();
  const [updateGroup] = useUpdateGroupMutation();
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setDescription(initialData.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [initialData, open]);

  const handleSubmit = async () => {
    if (initialData) {
      await updateGroup({
        id: initialData.id,
        data: { name, description },
      }).unwrap();
    } else {
      await createGroup({ name, description }).unwrap();
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-xl">
      <div className="p-2 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {initialData ? "Chỉnh sửa nhóm" : "Tạo nhóm mới"}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData
                ? "Cập nhật thông tin nhóm hướng dẫn"
                : "Nhập thông tin để tạo nhóm mới"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Tên nhóm"
            iconLeft={Users}
            placeholder="Nhập tên nhóm..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            label="Mô tả"
            iconLeft={FileText}
            placeholder="Nhập mô tả nhóm..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="pt-4 flex justify-end gap-3">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button
            label={initialData ? "Cập nhật" : "Tạo nhóm"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default GroupForm;
