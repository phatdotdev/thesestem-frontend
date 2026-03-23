import { X } from "lucide-react";
import Button from "../../../components/UI/Button";
import { useEffect, useState } from "react";
import {
  useAddYearMutation,
  useUpdateYearMutation,
} from "../../../services/orgApi";
import Input from "../../../components/UI/Input";

type YearProps = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type AddYearFormProps = {
  open: boolean;
  initialData?: YearProps;
  onClose: () => void;
};

const YearForm = ({ open, initialData, onClose }: AddYearFormProps) => {
  const [addYear] = useAddYearMutation();
  const [updateYear] = useUpdateYearMutation();

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    setId(initialData?.id || "");
    setName(initialData?.name || "");
    setStartDate(initialData?.startDate || "");
    setEndDate(initialData?.endDate || "");
  }, [initialData]);

  if (!open) return null;

  const handleSubmit = async () => {
    if (!name.trim()) return;
    if (initialData) {
      await updateYear({ id, data: { name, startDate, endDate } }).unwrap();
    } else {
      await addYear({ name, startDate, endDate }).unwrap();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-xl bg-white dark:bg-gray-900 shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {initialData ? "Cập nhật năm học" : "Thêm năm học"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-md p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X size={18} className="text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-4">
          {/* Name */}
          <Input
            label="Tên năm học"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2025 - 2026"
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* Start Date */}
          <Input
            label="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />

          {/* End Date */}
          <Input
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 border-t border-gray-200 dark:border-gray-800 px-6 py-4">
          <Button label="Hủy" variant="secondary" onClick={onClose} />
          <Button
            onClick={handleSubmit}
            label={initialData ? "Cập nhật" : "Tạo mới"}
          />
        </div>
      </div>
    </div>
  );
};

export default YearForm;
