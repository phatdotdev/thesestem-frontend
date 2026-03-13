import { Building2 } from "lucide-react";
import { useEffect, useState } from "react";
import Button from "../../../components/UI/Button";
import {
  useAddCollegeMutation,
  useAddDepartmentMutation,
  useAddFacultyMutation,
} from "../../../services/orgApi";
import Textarea from "../../../components/UI/TextArea";
import Modal from "../../../components/UI/Modal";

type OrgUnitType = "COLLEGE" | "FACULTY" | "DEPARTMENT";

interface OrgUnitFormProps {
  open: boolean;
  initialData?: {
    id?: string;
    type: OrgUnitType;
    name: string;
    code?: string;
    parentId?: string;
  };
  onClose: () => void;
  onSuccess: () => void;
}

const OrgUnitForm = ({
  open,
  initialData,
  onClose,
  onSuccess,
}: OrgUnitFormProps) => {
  const [addCollege] = useAddCollegeMutation();
  const [addFaculty] = useAddFacultyMutation();
  const [addDepartment] = useAddDepartmentMutation();

  const [type, setType] = useState<OrgUnitType>("COLLEGE");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  useEffect(() => {
    if (initialData) {
      setType(initialData.type);
      setName(initialData.name);
      setCode(initialData.code || "");
      setParentId(initialData.parentId || "");
    }
  }, [initialData]);

  if (!open) return null;

  const inputClass =
    "w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (type === "COLLEGE") {
        await addCollege({ name, description, code }).unwrap();
      }

      if (type === "FACULTY") {
        await addFaculty({ name, description, code }).unwrap();
      }

      if (type === "DEPARTMENT") {
        await addDepartment({ name, description, code }).unwrap();
      }

      onSuccess();
    } catch (err: any) {
      console.error(err);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      {/* Header */}
      <div className="flex items-center gap-2 border-gray-200 dark:border-gray-800 px-2 py-2">
        <Building2 size={20} className="text-blue-600" />
        <h2 className="text-lg font-semibold">
          {initialData ? "Cập nhật đơn vị" : "Thêm đơn vị"}
        </h2>
      </div>

      {/* Body */}
      <div className="space-y-5 px-6 py-5">
        {/* Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
            Loại đơn vị
          </label>

          <select
            value={type}
            onChange={(e) => setType(e.target.value as OrgUnitType)}
            className={inputClass}
          >
            <option value="COLLEGE">Trường</option>
            <option value="FACULTY">Khoa</option>
            <option value="DEPARTMENT">Bộ môn</option>
          </select>
        </div>

        {/* Name + Code */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Tên đơn vị
            </label>

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên đơn vị"
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Mã
            </label>

            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="VD: CNTT"
              className={inputClass}
            />
          </div>
        </div>

        {/* Description */}
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Mô tả"
          placeholder="Mô tả đơn vị của bạn"
          rows={4}
        />

        {/* Parent */}
        {type !== "COLLEGE" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Đơn vị cha
            </label>

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className={inputClass}
            >
              <option value="">-- Chọn đơn vị --</option>
            </select>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-3 border-gray-200 dark:border-gray-800 px-6 py-4">
        <Button label="Hủy" variant="secondary" onClick={onClose} />
        <Button
          label={initialData ? "Cập nhật" : "Tạo mới"}
          onClick={handleSubmit}
        />
      </div>
    </Modal>
  );
};

export default OrgUnitForm;
