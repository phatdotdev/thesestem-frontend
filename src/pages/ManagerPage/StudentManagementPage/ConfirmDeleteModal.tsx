import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import { useDeleteStudentMutation } from "../../../services/userApi";
import type { StudentResponse } from "../../../types/student";

const ConfirmDeleteModal = ({
  student,
  open,
  onClose,
}: {
  student: StudentResponse | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [deleteStudent] = useDeleteStudentMutation();
  const handleDelete = async () => {
    if (student) {
      await deleteStudent(student.id);
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="border-b border-gray-300">
        <h2 className="text-lg font-bold">Xóa Cán Bộ</h2>
        <p className="text-md py-3">
          Bạn có muốn sinh viên {student?.fullName}?
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
