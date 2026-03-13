import { useState } from "react";
import Modal from "../../../components/UI/Modal";
import Textarea from "../../../components/UI/TextArea";
import { useCreateMentorRegisterMutation } from "../../../services/semApi";
import type { LecturerResponse } from "../../../types/lecturer";
import { FileText, Send } from "lucide-react";
import Button from "../../../components/UI/Button";

const MessageModal = ({
  mentor,
  open,
  onClose,
}: {
  mentor: LecturerResponse | null;
  open: boolean;
  onClose: () => void;
}) => {
  const [createRegister, { isLoading }] = useCreateMentorRegisterMutation();

  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!message.trim() || !mentor) return;

    try {
      await createRegister({
        mentorId: mentor.id,
        message,
      }).unwrap();

      setMessage("");
      onClose();
    } catch (err) {
      console.error("Submit failed", err);
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-lg">
      <div className="p-2 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-lg font-semibold">
            Gửi đăng ký đến{" "}
            <span className="text-blue-600">{mentor?.fullName}</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Viết lời nhắn để giới thiệu bản thân và mong muốn được hướng dẫn.
          </p>
        </div>

        {/* Textarea */}
        <div className="space-y-2">
          <Textarea
            iconLeft={FileText}
            placeholder="Nhập lời nhắn của bạn..."
            rows={5}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <div className="text-xs text-right text-gray-400">
            {message.length}/500 ký tự
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="outline"
            label="Hủy"
            onClick={onClose}
            disabled={isLoading}
          />

          <Button
            icon={Send}
            label={isLoading ? "Đang gửi..." : "Gửi đăng ký"}
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default MessageModal;
