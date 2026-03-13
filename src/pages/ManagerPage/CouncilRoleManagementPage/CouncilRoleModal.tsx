import { useEffect, useState } from "react";
import Button from "../../../components/UI/Button";
import type { CouncilRole } from "../../../types/organization";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";
import Textarea from "../../../components/UI/TextArea";
import {
  useCreateRoleMutation,
  useUpdateRoleMutation,
} from "../../../services/catApi";
import { useAppDispatch } from "../../../app/hook";
import { addToast } from "../../../features/notification/notificationSlice";

interface CouncilRoleModalProps {
  open: boolean;
  onClose: () => void;
  data: CouncilRole | null;
}

interface CouncilRoleForm {
  code: string;
  name: string;
  description: string;
}

const CouncilRoleModal = ({ open, onClose, data }: CouncilRoleModalProps) => {
  const [createRole] = useCreateRoleMutation();
  const [updateRole] = useUpdateRoleMutation();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<CouncilRoleForm>({
    code: "",
    name: "",
    description: "",
  });

  useEffect(() => {
    setForm({
      code: data?.code || "",
      name: data?.name || "",
      description: data?.description || "",
    });
  }, [data]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.code.trim() || !form.name.trim()) {
      dispatch(
        addToast({
          type: "warning",
          message: "Vui lòng nhập đầy đủ thông tin",
        }),
      );
      return;
    }

    if (data) {
      await updateRole({ id: data.id, data: { ...form } }).unwrap();
    } else {
      await createRole({ ...form }).unwrap();
    }

    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="mx-4">
        <h2 className="text-lg font-semibold">
          {data ? "Chỉnh sửa vai trò" : "Thêm vai trò hội đồng"}
        </h2>
        <p className="text-sm text-gray-500">
          Thông tin vai trò sử dụng trong hội đồng chấm luận văn
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 px-4 py-4">
        <div>
          <Input
            label="Mã vai trò"
            name="code"
            value={form.code}
            onChange={handleChange}
            disabled={!!data}
            placeholder="CHAIRMAN"
          />
        </div>

        <div>
          <Input
            label="Tên vai trò"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Chủ tịch hội đồng"
          />
        </div>

        <div>
          <Textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            label="Mô tả vai trò"
            placeholder="Mô tả chức năng của vai trò"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-2 px-6 py-4">
        <Button variant="outline" onClick={onClose} label="Hủy" />
        <Button onClick={handleSubmit} label={data ? "Cập nhật" : "Tạo mới"} />
      </div>
    </Modal>
  );
};

export default CouncilRoleModal;
