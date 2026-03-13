import { AlertTriangle } from "lucide-react";
import type { TopicResponse } from "../../../../types/group";
import { useDeleteTopicMutation } from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import Modal from "../../../../components/UI/Modal";
import Button from "../../../../components/UI/Button";

const ConfirmModal = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: TopicResponse | null;
}) => {
  const { ["group-id"]: id } = useParams();
  const [deleteGroup, { isLoading }] = useDeleteTopicMutation();

  const handleDelete = async () => {
    if (!initialData) return;

    try {
      await deleteGroup({
        topicId: initialData.id,
        groupId: id as string,
      }).unwrap();
      onClose();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-md">
      <div className="p-2 space-y-5">
        {/* Icon + Title */}
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={22} />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-800">Xóa chủ đề</h2>
            <p className="text-sm text-gray-500 mt-1">
              Bạn có chắc chắn muốn xóa chủ đề <br />
              <span className="font-medium text-gray-700">
                {initialData?.title}
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
          <Button
            label="Hủy"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            label={isLoading ? "Đang xóa..." : "Xác nhận"}
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
