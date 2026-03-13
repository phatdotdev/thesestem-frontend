import { AlertTriangle } from "lucide-react";
import Modal from "../../../../components/UI/Modal";
import { useDeleteAssignmentMutation } from "../../../../services/groupApi";
import type { AssignmentResponse } from "../../../../types/group";
import Button from "../../../../components/UI/Button";
import { useParams } from "react-router-dom";

const ConfirmModal = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: AssignmentResponse | null;
}) => {
  const [deleteAssignment, { isLoading }] = useDeleteAssignmentMutation();
  const { "group-id": id } = useParams();
  const handleDelete = async () => {
    await deleteAssignment({
      assignmentId: initialData?.id as string,
      groupId: id as string,
    }).unwrap();
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-6 space-y-5">
        {/* Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Xóa bài tập</h2>
            <p className="text-sm text-gray-500 mt-1">
              Bạn có chắc chắn muốn xóa bài tập{" "}
              <span className="font-medium text-gray-700">
                {initialData?.name}
              </span>
              ?
            </p>
          </div>
        </div>

        {/* Warning text */}
        <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg p-3">
          Hành động này không thể hoàn tác.
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button
            label={isLoading ? "Đang xóa..." : "Xác nhận"}
            onClick={handleDelete}
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
