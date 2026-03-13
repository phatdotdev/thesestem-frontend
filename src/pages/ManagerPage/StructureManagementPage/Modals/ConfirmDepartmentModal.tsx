import { useAppDispatch } from "../../../../app/hook";
import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import Modal from "../../../../components/UI/Modal";
import { addToast } from "../../../../features/notification/notificationSlice";
import { useDeleteDepartmentMutation } from "../../../../services/orgApi";

type Props = {
  open: boolean;
  onClose: () => void;
  departmentId: string;
  departmentName: string;
};

const ConfirmDepartmentModal = ({
  open,
  onClose,
  departmentId,
  departmentName,
}: Props) => {
  const [deleteDepartment, { isLoading }] = useDeleteDepartmentMutation();
  const dispatch = useAppDispatch();
  const handleDelete = async () => {
    try {
      await deleteDepartment(departmentId).unwrap();
      onClose();
      dispatch(addToast({ type: "success", message: "Xóa bộ môn thành công" }));
    } catch (err) {
      console.log(err);
      dispatch(addToast({ type: "error", message: "Không thể xóa bộ môn" }));
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="px-2">
        <h2 className="text-lg font-bold mb-3">Xóa bộ môn?</h2>

        <p className="text-gray-600 mb-6">
          Bạn có chắc là muốn xóa <b>{departmentName}</b>?
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

export default ConfirmDepartmentModal;
