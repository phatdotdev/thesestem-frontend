import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { useUpdateRegisterRequestStatusMutation } from "../../../services/semApi";
import { useState } from "react";
import type { RegisterResposne } from "../../../types/register";
import Badge from "../../../components/UI/Badge";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  register: RegisterResposne | null;
  status: string;
}

const ConfirmModal = ({
  open,
  onClose,
  register,
  status,
}: ConfirmModalProps) => {
  const [updateRegisterStatus, { isLoading }] =
    useUpdateRegisterRequestStatusMutation();

  const [error, setError] = useState<string | null>(null);

  if (!register) return null;

  const handleConfirm = async () => {
    try {
      setError(null);

      await updateRegisterStatus({
        id: register.id,
        data: { status },
      }).unwrap();

      onClose();
    } catch (err: any) {
      console.log(error);
      setError(err?.data?.message || "Có lỗi xảy ra");
    }
  };

  const getActionText = () => {
    switch (status) {
      case "ACCEPTED":
        return "chấp nhận";
      case "REJECTED":
        return "từ chối";
      case "CANCELLED":
        return "hủy đăng ký";
      default:
        return "cập nhật";
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-4">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-800">
          Xác nhận thao tác
        </h2>

        {/* Content */}
        <p className="text-sm text-gray-600">
          Bạn có chắc muốn <b>{getActionText()}</b> đăng ký với giảng viên{" "}
          <b>{register.mentor.fullName}</b> không?
        </p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <Badge label="Hành động này không thể hoàn tác" variant="danger" />
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button label="Hủy" variant="outline" onClick={onClose} />

          <Button
            label="Xác nhận"
            loading={isLoading}
            onClick={handleConfirm}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
