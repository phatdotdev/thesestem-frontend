import { MdCalendarMonth, MdOutlineAssignment } from "react-icons/md";
import Modal from "../../../../components/UI/Modal";
import type { AssignmentResponse } from "../../../../types/group";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import { useEffect, useState } from "react";
import Textarea from "../../../../components/UI/TextArea";
import { FileText } from "lucide-react";
import {
  useCreateAssignmentMutation,
  useUpdateAssignmentMutation,
} from "../../../../services/groupApi";
import { useParams } from "react-router-dom";

const AssignmentForm = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: AssignmentResponse | null;
}) => {
  const { ["group-id"]: id } = useParams();

  const [name, setName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDescription(initialData.description);
      setDeadline(initialData.deadline);
    }
  }, [initialData]);
  const [createAssignment] = useCreateAssignmentMutation();
  const [updateAssignment] = useUpdateAssignmentMutation();

  const handleSubmit = async () => {
    if (initialData) {
      await updateAssignment({
        groupId: id as string,
        assignmentId: initialData?.id,
        data: { name, description, deadline },
      }).unwrap();
    } else {
      await createAssignment({
        groupId: id as string,
        data: { name, description, deadline },
      }).unwrap();
    }
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-2 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-blue-100 text-blue-600">
            <MdOutlineAssignment size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {initialData ? "Chỉnh sửa bài tập" : "Tạo bài tập mới"}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData
                ? "Cập nhật thông tin bài tập"
                : "Nhập thông tin để tạo bài tập mới"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Tên bài tập"
            iconLeft={MdOutlineAssignment}
            placeholder="Nhập tên bài tập..."
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <Textarea
            label="Mô tả"
            iconLeft={FileText}
            placeholder="Nhập mô tả bài tập..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Thời gian hết hạn"
            iconLeft={MdCalendarMonth}
            placeholder="Nhập tên nhóm..."
            value={deadline}
            type="datetime-local"
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        {/* Divider */}
        <div className="pt-4 flex justify-end gap-3">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button
            label={initialData ? "Cập nhật" : "Tạo nhóm"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default AssignmentForm;
