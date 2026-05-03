import { CalendarRange } from "lucide-react";
import Button from "../../../components/UI/Button";
import { useEffect, useState } from "react";
import {
  useAddSemeseterMutation,
  useUpdateSemesterMutation,
} from "../../../services/orgApi";
import Input from "../../../components/UI/Input";
import Modal from "../../../components/UI/Modal";

type SemesterProps = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type SemesterFormProps = {
  semesterId: string;
  yearId: string;
  open: boolean;
  initialData?: SemesterProps;
  onClose: () => void;
  onSuccess?: () => void;
};

const SemesterForm = ({
  semesterId,
  yearId,
  open,
  initialData,
  onClose,
  onSuccess,
}: SemesterFormProps) => {
  const [addSemester] = useAddSemeseterMutation();
  const [updateSemester] = useUpdateSemesterMutation();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  useEffect(() => {
    setName(initialData?.name || "");
    setStartDate(initialData?.startDate || "");
    setEndDate(initialData?.endDate || "");
  }, [initialData]);

  const handleSubmit = async () => {
    if (!name.trim()) return;

    try {
      if (initialData) {
        await updateSemester({
          id: semesterId,
          data: { name, startDate, endDate },
        }).unwrap();
      } else {
        await addSemester({
          id: yearId,
          data: { name, startDate, endDate },
        }).unwrap();
      }

      onSuccess?.();
      onClose();
    } catch {
      // Keep modal open on failure so user can correct and retry.
    }
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-xl">
      <div className="space-y-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center text-indigo-500 shrink-0">
            <CalendarRange size={20} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-gray-100">
              {initialData ? "Cập nhật học kỳ" : "Thêm học kỳ"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Thiết lập thời gian bắt đầu và kết thúc cho học kỳ
            </p>
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Tên học kỳ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Học kỳ 1"
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

export default SemesterForm;
