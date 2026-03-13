import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import { useDeleteLecturerMutation } from "../../../services/userApi";
import type { LecturerResponse } from "../../../types/lecturer";

const ConfirmDeleteModal = ({
  lecturer,
  open,
  onClose,
}: {
  lecturer: LecturerResponse | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [deleteLecturer] = useDeleteLecturerMutation();
  const handleDelete = async () => {
    if (lecturer) {
      await deleteLecturer(lecturer.id);
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="border-b border-gray-300">
        <h2 className="text-lg font-bold">Xóa Cán Bộ</h2>
        <p className="text-md py-3">
          Bạn có muốn xóa cán bộ {lecturer?.fullName}?
        </p>
      </div>
      <div className="mt-2 flex gap-2 justify-end">
        <Button label="Xác nhận" onClick={handleDelete} />
        <Button label="Hủy" variant="outline" onClick={onClose} />
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
