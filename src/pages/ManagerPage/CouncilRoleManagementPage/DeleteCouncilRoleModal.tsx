import { AlertTriangle } from "lucide-react";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";

interface DeleteCouncilRoleModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteCouncilRoleModal = ({
  open,
  onClose,
  onConfirm,
}: DeleteCouncilRoleModalProps) => {
  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Xóa vai trò hội đồng
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Hành động này{" "}
              <span className="font-medium text-red-600">
                không thể hoàn tác
              </span>
              . Bạn có chắc chắn muốn xóa vai trò này không?
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" label="Hủy" onClick={onClose} size="sm" />

          <Button
            variant="danger"
            label="Xóa vai trò"
            onClick={onConfirm}
            size="sm"
          />
        </div>
      </div>
    </Modal>
  );
};

export default DeleteCouncilRoleModal;
