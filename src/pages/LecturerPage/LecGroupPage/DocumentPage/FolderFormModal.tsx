import { useEffect, useState } from "react";

import { useParams } from "react-router-dom";
import Input from "../../../../components/UI/Input";
import Button from "../../../../components/UI/Button";
import Modal from "../../../../components/UI/Modal";
import { useCreateGroupFolderMutation } from "../../../../services/groupApi";

interface Props {
  open: boolean;
  onClose: () => void;
  currentFolderId: string;
}

const FolderFormModal = ({ open, onClose, currentFolderId }: Props) => {
  const { ["group-id"]: id } = useParams();

  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const [createFolder, { isLoading }] = useCreateGroupFolderMutation();

  // reset khi mở modal
  useEffect(() => {
    if (open) {
      setName("");
      setError("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Tên thư mục không được để trống");
      return;
    }

    try {
      await createFolder({
        groupId: id as string,
        folderId: currentFolderId,
        name: name.trim(),
      }).unwrap();

      onClose(); // đóng modal sau khi tạo
    } catch (err) {
      console.error(err);
      setError("Tạo thư mục thất bại");
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        {/* TITLE */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Tạo thư mục mới
          </h2>
          <p className="text-sm text-gray-500">Nhập tên thư mục bạn muốn tạo</p>
        </div>

        {/* INPUT */}
        <div>
          <Input
            placeholder="Nhập tên thư mục..."
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError("");
            }}
          />

          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3">
          <Button label="Hủy" variant="secondary" onClick={onClose} />

          <Button
            label={isLoading ? "Đang tạo..." : "Xác nhận"}
            onClick={handleSubmit}
            disabled={!name.trim() || isLoading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default FolderFormModal;
