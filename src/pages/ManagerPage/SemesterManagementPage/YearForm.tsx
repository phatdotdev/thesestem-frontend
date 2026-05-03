import { CalendarDays } from "lucide-react";
import Button from "../../../components/UI/Button";
import { useEffect, useState } from "react";
import {
  useAddYearMutation,
  useUpdateYearMutation,
} from "../../../services/orgApi";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";

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
  onSuccess?: () => void;
};

const YearForm = ({
  open,
  initialData,
  onClose,
  onSuccess,
}: AddYearFormProps) => {
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

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (initialData) {
        await updateYear({ id, data: { name, startDate, endDate } }).unwrap();
      } else {
        await addYear({ name, startDate, endDate }).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch {
      // Keep modal open on failure so user can adjust input and retry.
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-xl">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-800 flex items-center justify-center text-blue-500 shrink-0">
            <CalendarDays size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {initialData ? "Cập nhật năm học" : "Thêm năm học"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Khai báo thông tin năm học để quản lý các học kỳ tương ứng
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Tên năm học"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="2025 - 2026"
            className="sm:col-span-2"
          />

          <Input
            label="Ngày bắt đầu"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />

          <Input
            label="Ngày kết thúc"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <div className="flex justify-end gap-2">
          <Button label="Hủy" variant="outline" onClick={onClose} />
          <Button
            onClick={handleSubmit}
            label={initialData ? "Cập nhật" : "Tạo mới"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default YearForm;
