import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { useUpdateRegisterRequestStatusMutation } from "../../../services/semApi";
import { useState } from "react";
import type { RegisterResposne } from "../../../types/register";
import Badge from "../../../components/UI/Badge";
import Textarea from "../../../components/UI/TextArea";

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  register: RegisterResposne | null;
  status: string;
}

const ConfirmStatusChangeModal = ({
  open,
  onClose,
  register,
  status,
}: ConfirmModalProps) => {
  const [updateRegisterStatus, { isLoading }] =
    useUpdateRegisterRequestStatusMutation();

  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState("");

  if (!register) return null;

  const handleConfirm = async () => {
    try {
      setError(null);

      await updateRegisterStatus({
        id: register.id,
        data: { status, response },
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
        return <Badge label="chấp nhận" variant="success" size="sm" />;
      case "REJECTED":
        return <Badge label="từ chối" variant="danger" size="sm" />;
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
          Bạn có chắc muốn <b>{getActionText()}</b> đăng ký sinh viên
          <b>{register.student.fullName}</b> không?
        </p>

        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}

        <Textarea
          label="Phản hồi"
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          rows={3}
          placeholder="Nhập phản hồi của bạn"
        />
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

export default ConfirmStatusChangeModal;
