import { useAppDispatch } from "../../../app/hook";
import Badge from "../../../components/UI/Badge";
import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import { addToast } from "../../../features/notification/notificationSlice";
import { useDeleteProgramMutation } from "../../../services/orgApi";
import type { ProgramResponse } from "../../../types/organization";

const ConfirmModal = ({
  open,
  onClose,
  program,
}: {
  open: boolean;
  onClose: () => void;
  program: ProgramResponse | null;
}) => {
  const [deleteProgram, { isLoading }] = useDeleteProgramMutation();

  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    if (!program) return;
    try {
      await deleteProgram(program.id).unwrap();
      dispatch(
        addToast({ type: "success", message: "Xóa chương trình thành công" }),
      );
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Không thể xóa chương trình" }),
      );
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-2">
        <h2 className="text-lg font-bold mb-3">Xóa chương trình đào tạo?</h2>

        <p className="text-gray-600 mb-6">
          Bạn có chắc là muốn xóa <b>{program?.name}</b>?
          <br />
          <Badge
            variant="danger"
            label="Hành động này không thể khôi phục."
            className="mt-4"
          />
        </p>

        <div className="flex justify-end gap-3">
          <Button onClick={onClose} label="Hủy" variant="outline" />

          <Button
            onClick={handleDelete}
            variant="danger"
            label={!isLoading ? "Xác nhận" : "Đang xóa..."}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
