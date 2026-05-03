import { useEffect, useState } from "react";
import Modal from "../../../../components/UI/Modal";
import Textarea from "../../../../components/UI/TextArea";
import type { OrgUnit } from "../../../../types/structure";
import Input from "../../../../components/UI/Input";
import { useUpdateDepartmentMutation } from "../../../../services/orgApi";
import Button from "../../../../components/UI/Button";
import { useAppDispatch } from "../../../../app/hook";
import { addToast } from "../../../../features/notification/toastSlice";

const DepartmentFormModal = ({
  open,
  onClose,
  department,
}: {
  open: boolean;
  onClose: () => void;
  department: OrgUnit;
}) => {
  const dispatch = useAppDispatch();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");

  const [updateDepartment, { isLoading }] = useUpdateDepartmentMutation();

  useEffect(() => {
    if (department) {
      setName(department.name || "");
      setCode(department.code || "");
      setDescription(department.description || "");
    }
  }, [department]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      dispatch(
        addToast({ type: "warning", message: "Vui lòng nhập tên bộ môn" }),
      );
      return;
    }

    try {
      await updateDepartment({
        id: department.id,
        data: { name, code, description },
      }).unwrap();

      dispatch(
        addToast({ type: "success", message: "Cập nhật bộ môn thành công" }),
      );
      onClose();
    } catch (err) {
      console.error(err);
      dispatch(
        addToast({ type: "error", message: "Không thể cập nhật bộ môn" }),
      );
    }
  };

  if (!open) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <div className="w-[560px] max-w-full space-y-5 rounded-xl bg-white p-1 dark:bg-gray-900">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Cập nhật đơn vị
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Chỉnh sửa thông tin của bộ môn
          </p>
        </div>

        <div className="space-y-4 rounded-xl border border-gray-200 p-4 dark:border-gray-700">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input
              label="Tên đơn vị"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên đơn vị"
            />

            <Input
              label="Mã đơn vị"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: CNTT"
            />
          </div>

          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            label="Mô tả"
            placeholder="Mô tả đơn vị của bạn"
            rows={4}
          />
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button onClick={onClose} variant="outline" size="sm" label="Hủy" />
          <Button
            onClick={handleSubmit}
            loading={isLoading}
            size="sm"
            label={isLoading ? "Đang lưu..." : "Lưu thay đổi"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default DepartmentFormModal;
