import { useEffect, useState } from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import Input from "../../../components/UI/Input";
import type { ManagerRequest, ManagerResponse } from "../../../types/user";
import { UserRoundCog } from "lucide-react";
import {
  useCreateManagerMutation,
  useUpdateManagerMutation,
} from "../../../services/userApi";

type Props = {
  open: boolean;
  manager?: ManagerResponse | null;
  onClose: () => void;
};

const ManagerFormModal = ({ open, manager, onClose }: Props) => {
  const [createManager] = useCreateManagerMutation();
  const [updateManager] = useUpdateManagerMutation();
  const isEdit = !!manager;

  const [form, setForm] = useState<ManagerRequest>({
    username: "",
    password: "",
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    website: "",
    description: "",
    type: "UNIVERSITY",
  });

  useEffect(() => {
    if (manager) {
      setForm({
        username: manager.username,
        password: "",
        name: manager.name,
        code: manager.code,
        email: manager.email,
        phone: manager.phone,
        address: manager.address,
        website: manager.website,
        description: manager.description,
        type: manager.type,
      });
    } else {
      setForm({
        username: "",
        password: "",
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        website: "",
        description: "",
        type: "UNIVERSITY",
      });
    }
  }, [manager]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!manager) {
        await createManager(form).unwrap();
      } else {
        await updateManager({
          id: manager.id,
          data: form,
        }).unwrap();
      }
      onClose();
    } catch (e: any) {}
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-2xl">
      <div className="bg-white rounded-xl p-2 space-y-6">
        {/* HEADER */}
        <div className="flex gap-4">
          <div className="bg-blue-100 text-blue-600 rounded-xl p-3 flex items-center justify-center">
            <UserRoundCog size={20} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              {isEdit ? "Chỉnh sửa người quản lý" : "Thêm người quản lý"}
            </h2>
            <p className="text-sm text-gray-500">
              {isEdit
                ? "Cập nhật thông tin tổ chức"
                : "Tạo mới tài khoản quản lý"}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Username"
            value={form.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />

          {!isEdit && (
            <Input
              label="Password"
              type="password"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
            />
          )}

          <Input
            label="Tên tổ chức"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            label="Mã tổ chức"
            value={form.code}
            onChange={(e) => handleChange("code", e.target.value)}
          />

          <Input
            label="Email"
            value={form.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <Input
            label="Số điện thoại"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <Input
            label="Website"
            value={form.website}
            onChange={(e) => handleChange("website", e.target.value)}
          />

          <Input
            label="Địa chỉ"
            value={form.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        <div>
          <Input
            label="Mô tả"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" label="Hủy" onClick={onClose} />

          <Button
            label={isEdit ? "Cập nhật" : "Tạo mới"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ManagerFormModal;
