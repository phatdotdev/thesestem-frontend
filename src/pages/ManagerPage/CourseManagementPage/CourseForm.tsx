import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";

import Button from "../../../components/UI/Button";
import Modal from "../../../components/UI/Modal";
import Input from "../../../components/UI/Input";

import {
  useCreateCourseMutation,
  useUpdateCourseMutation,
} from "../../../services/catApi";

type CourseFormProps = {
  open: boolean;
  initialData?: any | null;
  onClose: () => void;
  onSuccess: () => void;
};

const CourseForm = ({
  open,
  initialData,
  onClose,
  onSuccess,
}: CourseFormProps) => {
  const isEdit = Boolean(initialData);

  const [form, setForm] = useState({
    code: "",
    name: "",
    startYear: "",
    endYear: "",
    startDate: "",
    endDate: "",
    active: true,
  });

  const [createCourse, { isLoading: creating }] = useCreateCourseMutation();
  const [updateCourse, { isLoading: updating }] = useUpdateCourseMutation();

  const loading = creating || updating;

  useEffect(() => {
    if (initialData) {
      setForm({
        code: initialData.code ?? "",
        name: initialData.name ?? "",
        startYear: initialData.startYear ?? "",
        endYear: initialData.endYear ?? "",
        startDate: initialData.startDate ?? "",
        endDate: initialData.endDate ?? "",
        active: initialData.active ?? true,
      });
    } else {
      setForm({
        code: "",
        name: "",
        startYear: "",
        endYear: "",
        startDate: "",
        endDate: "",
        active: true,
      });
    }
  }, [initialData, open]);

  const onChange = (e: any) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const submit = async () => {
    const payload = {
      ...form,
      startYear: form.startYear ? Number(form.startYear) : null,
      endYear: form.endYear ? Number(form.endYear) : null,
    };

    if (isEdit) {
      await updateCourse({
        id: initialData.id,
        data: payload,
      }).unwrap();
    } else {
      await createCourse(payload).unwrap();
    }

    onSuccess();
  };

  return (
    <Modal open={open} onClose={onClose} width="max-w-xl">
      <div className="space-y-6">
        {/* HEADER */}
        <div className="flex items-center gap-3 pb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
            <BookOpen size={20} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">
              {isEdit ? "Cập nhật khóa học" : "Thêm khóa học"}
            </h2>
            <p className="text-sm text-gray-500">
              Nhập thông tin khóa học trong hệ thống
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Mã khóa học"
            name="code"
            value={form.code}
            onChange={onChange}
            placeholder="VD: K20"
          />

          <Input
            label="Tên khóa học"
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="Khóa 2020 - 2024"
          />

          <Input
            label="Năm bắt đầu"
            name="startYear"
            type="number"
            value={form.startYear}
            onChange={onChange}
            placeholder="2020"
          />

          <Input
            label="Năm kết thúc"
            name="endYear"
            type="number"
            value={form.endYear}
            onChange={onChange}
            placeholder="2024"
          />

          <Input
            label="Ngày bắt đầu khóa"
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={onChange}
          />

          <Input
            label="Ngày kết thúc khóa"
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={onChange}
          />

          {/* ACTIVE */}
          <div className="col-span-2 flex items-center gap-3 pt-2">
            <input
              type="checkbox"
              name="active"
              checked={form.active}
              onChange={onChange}
              className="h-4 w-4 rounded border-gray-300"
            />
            <span className="text-sm font-medium text-gray-600">
              Khóa học đang hoạt động
            </span>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            label="Hủy"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          />

          <Button
            label={isEdit ? "Lưu thay đổi" : "Tạo khóa học"}
            onClick={submit}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
};

export default CourseForm;
