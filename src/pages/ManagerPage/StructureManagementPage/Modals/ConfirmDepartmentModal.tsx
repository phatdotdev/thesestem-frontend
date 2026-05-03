import { useAppDispatch } from "../../../../app/hook";
import ConfirmModal from "../../../../components/UI/ConfirmModal";
import { addToast } from "../../../../features/notification/toastSlice";
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

  return (
    <ConfirmModal
      open={open}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Xóa bộ môn?"
      description={`Bạn có chắc muốn xóa bộ môn ${departmentName}? Hành động này không thể hoàn tác.`}
      confirmText="Xác nhận xóa"
      type="danger"
      loading={isLoading}
    />
  );
};

export default ConfirmDepartmentModal;
