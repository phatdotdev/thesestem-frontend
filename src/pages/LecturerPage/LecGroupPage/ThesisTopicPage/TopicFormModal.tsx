import { useEffect, useState } from "react";
import Modal from "../../../../components/UI/Modal";
import type { TopicResponse } from "../../../../types/group";
import Input from "../../../../components/UI/Input";
import Textarea from "../../../../components/UI/TextArea";
import { BookOpen, FileText, TextInitial, Users } from "lucide-react";
import Button from "../../../../components/UI/Button";
import {
  useCreateTopicMutation,
  useUpdateTopicMutation,
} from "../../../../services/groupApi";
import { useParams } from "react-router-dom";

const TopicFormModal = ({
  open,
  onClose,
  initialData,
}: {
  open: boolean;
  onClose: () => void;
  initialData: TopicResponse | null;
}) => {
  const { ["group-id"]: id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxStudents, setMaxStudents] = useState<number>(1);

  const [createTopic] = useCreateTopicMutation();
  const [updateTopic] = useUpdateTopicMutation();

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setDescription(initialData.description);
      setMaxStudents(initialData.maxStudents);
    }
  }, [initialData]);

  const handleSubmit = async () => {
    if (initialData) {
      await updateTopic({
        groupId: id as string,
        topicId: initialData.id,
        data: { title, description, maxStudents },
      });
    } else {
      await createTopic({
        groupId: id as string,
        data: { title, description, maxStudents },
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
            <BookOpen size={20} />
          </div>
          <div>
            <h1 className="text-lg font-semibold">
              {initialData ? "Chỉnh sửa đề tài" : "Tạo đề tài mới"}
            </h1>
            <p className="text-sm text-gray-500">
              {initialData
                ? "Cập nhật thông tin đề tài"
                : "Nhập thông tin để tạo đề tài mới"}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Tên đề tài"
            iconLeft={BookOpen}
            placeholder="Nhập tên đề tài..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <Textarea
            label="Mô tả"
            iconLeft={FileText}
            placeholder="Nhập mô tả đề tài..."
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Input
            label="Số lượng sinh viên tối đa"
            iconLeft={Users}
            placeholder="Nhập tên nhóm..."
            value={maxStudents}
            type="number"
            onChange={(e) => setMaxStudents(Number(e.target.value))}
          />
        </div>

        {/* Divider */}
        <div className="pt-4 flex justify-end gap-3">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button
            label={initialData ? "Cập nhật" : "Tạo đề tài"}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TopicFormModal;
