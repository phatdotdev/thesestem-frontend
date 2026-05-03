import { useEffect, useState } from "react";
import Modal from "../../../components/UI/Modal";
import Button from "../../../components/UI/Button";
import { Save } from "lucide-react";
import {
  useCreateMilestoneMutation,
  useUpdateMilestoneMutation,
} from "../../../services/semApi";
import type { MilestoneResponse } from "../../../types/milestone";
import { data } from "react-router-dom";

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: MilestoneResponse | null;
}

const EMPTY = { title: "", description: "", startAt: "", endAt: "" };

const toInputDate = (iso?: string) =>
  iso ? new Date(iso).toISOString().slice(0, 16) : "";

const TimeLineForm = ({ open, onClose, initialData }: Props) => {
  const isEdit = !!initialData;

  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<Partial<typeof EMPTY>>({});

  const [createMilestone, { isLoading: creating }] =
    useCreateMilestoneMutation();
  const [updateMilestone, { isLoading: updating }] =
    useUpdateMilestoneMutation();
  const isLoading = creating || updating;

  /* Sync initialData khi mở form */
  useEffect(() => {
    if (open) {
      setErrors({});
      setForm(
        initialData
          ? {
              title: initialData.title,
              description: initialData.description ?? "",
              startAt: toInputDate(initialData.startAt),
              endAt: toInputDate(initialData.endAt),
            }
          : EMPTY,
      );
    }
  }, [open, initialData]);

  const validate = () => {
    const e: Partial<typeof EMPTY> = {};
    if (!form.title.trim()) e.title = "Vui lòng nhập tiêu đề";
    if (!form.startAt) e.startAt = "Vui lòng chọn ngày bắt đầu";
    if (!form.endAt) e.endAt = "Vui lòng chọn ngày kết thúc";
    if (form.startAt && form.endAt && form.startAt >= form.endAt)
      e.endAt = "Ngày kết thúc phải sau ngày bắt đầu";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        startAt: new Date(form.startAt).toISOString(),
        endAt: new Date(form.endAt).toISOString(),
      };

      if (isEdit && initialData) {
        await updateMilestone({
          id: initialData?.id as string,
          data: payload,
        }).unwrap();
      } else {
        await createMilestone(payload).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Milestone save failed:", err);
    }
  };

  const set =
    (field: keyof typeof EMPTY) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

  /* ── Input classes ── */
  const inputCls = (err?: string) =>
    `w-full border rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800
     text-gray-800 dark:text-gray-100 placeholder:text-gray-300 dark:placeholder:text-gray-600
     focus:outline-none focus:ring-2 transition
     ${
       err
         ? "border-red-300 dark:border-red-700 focus:ring-red-300 dark:focus:ring-red-700"
         : "border-gray-200 dark:border-gray-700 focus:ring-indigo-400 focus:border-transparent"
     }`;

  const labelCls =
    "text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide";
  const errCls = "text-[11px] text-red-500 dark:text-red-400 mt-1";

  return (
    <Modal open={open} onClose={onClose}>
      <div className="space-y-5">
        {/* Header */}
        <div>
          <h2 className="text-base font-bold text-gray-800 dark:text-gray-100">
            {isEdit ? "Cập nhật mốc thời gian" : "Thêm mốc thời gian"}
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
            {isEdit
              ? "Chỉnh sửa thông tin mốc thời gian"
              : "Tạo mốc thời gian mới cho học kỳ"}
          </p>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Title */}
        <div className="space-y-1.5">
          <label className={labelCls}>
            Tiêu đề <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls(errors.title)}
            placeholder="VD: Nộp đề cương luận văn"
            value={form.title}
            onChange={set("title")}
          />
          {errors.title && <p className={errCls}>{errors.title}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className={labelCls}>Mô tả</label>
          <textarea
            className={inputCls()}
            placeholder="Nhập mô tả cho mốc thời gian..."
            rows={3}
            style={{ resize: "none" }}
            value={form.description}
            onChange={set("description")}
          />
        </div>

        {/* Date range */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className={labelCls}>
              Bắt đầu <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              className={inputCls(errors.startAt)}
              value={form.startAt}
              onChange={set("startAt")}
            />
            {errors.startAt && <p className={errCls}>{errors.startAt}</p>}
          </div>

          <div className="space-y-1.5">
            <label className={labelCls}>
              Kết thúc <span className="text-red-400">*</span>
            </label>
            <input
              type="datetime-local"
              className={inputCls(errors.endAt)}
              value={form.endAt}
              onChange={set("endAt")}
            />
            {errors.endAt && <p className={errCls}>{errors.endAt}</p>}
          </div>
        </div>

        <div className="h-px bg-gray-100 dark:bg-gray-800" />

        {/* Actions */}
        <div className="flex justify-end gap-2">
          <Button
            label="Hủy"
            size="sm"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          />
          <Button
            label={isEdit ? "Cập nhật" : "Tạo mốc"}
            size="sm"
            variant="primary"
            icon={Save}
            loading={isLoading}
            onClick={handleSubmit}
          />
        </div>
      </div>
    </Modal>
  );
};

export default TimeLineForm;
