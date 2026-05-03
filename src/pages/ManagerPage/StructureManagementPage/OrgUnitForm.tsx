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
  onError?: () => void;
  onValidationError?: (message: string) => void;
}

const OrgUnitForm = ({
  open,
  initialData,
  onClose,
  onSuccess,
  onError,
  onValidationError,
}: OrgUnitFormProps) => {
  const [addCollege, { isLoading: isAddingCollege }] = useAddCollegeMutation();
  const [addFaculty, { isLoading: isAddingFaculty }] = useAddFacultyMutation();
  const [addDepartment, { isLoading: isAddingDepartment }] =
    useAddDepartmentMutation();

  const [type, setType] = useState<OrgUnitType>("COLLEGE");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [parentId, setParentId] = useState("");

  const isSubmitting = isAddingCollege || isAddingFaculty || isAddingDepartment;

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
    if (!name.trim()) {
      onValidationError?.("Vui lòng nhập tên đơn vị");
      return;
    }

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

      setName("");
      setCode("");
      setDescription("");
      setType("COLLEGE");
      setParentId("");
      onSuccess();
    } catch (err: any) {
      console.error(err);
      onError?.();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="mb-4 flex items-center gap-3 rounded-xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-gray-700 shadow-sm dark:bg-slate-900 dark:text-gray-300">
          <Building2 size={20} />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-gray-600 dark:text-gray-400">
            Quản lý cơ cấu
          </p>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {initialData ? "Cập nhật đơn vị" : "Thêm đơn vị"}
          </h2>
        </div>
      </div>

      <div className="space-y-5 px-1 py-1">
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800/60">
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

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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

        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="Mô tả"
          placeholder="Mô tả ngắn về đơn vị"
          rows={4}
          containerClassName="rounded-lg"
        />

        {type !== "COLLEGE" && (
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-600 dark:text-gray-300">
              Đơn vị cha
            </label>

            <select
              value={parentId}
              onChange={(e) => setParentId(e.target.value)}
              className={inputClass}
              disabled
            >
              <option value="">
                Thêm từ nút + trong cây để chọn đơn vị cha
              </option>
            </select>
          </div>
        )}
      </div>

      <div className="mt-5 flex justify-end gap-3 border-t border-gray-200 px-1 pt-4 dark:border-gray-800">
        <Button label="Hủy" variant="secondary" size="sm" onClick={onClose} />
        <Button
          label={initialData ? "Cập nhật" : "Tạo mới"}
          onClick={handleSubmit}
          loading={isSubmitting}
          size="sm"
        />
      </div>
    </Modal>
  );
};

export default OrgUnitForm;
