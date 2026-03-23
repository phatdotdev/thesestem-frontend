import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGetStudentThesisByIdQuery,
  useUpdateThesisMutation,
} from "../../../../services/thesisApi";
import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import { Compass, Save } from "lucide-react";
import Textarea from "../../../../components/UI/TextArea";

const ThesisOverviewPage = () => {
  const { ["thesis-id"]: id } = useParams();

  const { data, isLoading } = useGetStudentThesisByIdQuery(id as string);
  const [updateThesis, { isLoading: isUpdating }] = useUpdateThesisMutation();

  const thesis = data?.data;

  const [form, setForm] = useState({
    title: "",
    titleEn: "",
    description: "",
    descriptionEn: "",
    status: "PROPOSAL",
    progressPercent: 0,
  });

  useEffect(() => {
    if (thesis) {
      setForm({
        title: thesis.title || "",
        titleEn: thesis.titleEn || "",
        description: thesis.description || "",
        descriptionEn: thesis.descriptionEn || "",
        status: thesis.status || "PROPOSAL",
        progressPercent: thesis.progressPercent || 0,
      });
    }
  }, [thesis]);

  const handleChange = (key: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await updateThesis({
        id,
        data: form,
      }).unwrap();

      alert("Cập nhật thành công!");
    } catch (err) {
      console.error(err);
      alert("Có lỗi xảy ra!");
    }
  };

  if (isLoading) return null;

  return (
    <div
      className="
        mt-6 
        bg-white 
        dark:bg-gray-900
        rounded-lg 
        border 
        border-gray-300 
        dark:border-gray-700
        p-6 
        space-y-6
      "
    >
      {/* HEADER */}
      <div className="flex gap-4 items-center">
        <div className="text-gray-800 dark:text-gray-200">
          <Compass />
        </div>

        <div>
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
            Tổng quan luận văn
          </h1>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            Chỉnh sửa thông tin cơ bản của luận văn
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Tiêu đề (VI)"
          value={form.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />

        <Input
          label="Tiêu đề (EN)"
          value={form.titleEn}
          onChange={(e) => handleChange("titleEn", e.target.value)}
        />

        <div className="md:col-span-2">
          <Textarea
            label="Mô tả (VI)"
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={3}
          />
        </div>

        <div className="md:col-span-2">
          <Textarea
            label="Mô tả (EN)"
            value={form.descriptionEn}
            onChange={(e) => handleChange("descriptionEn", e.target.value)}
            rows={3}
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Trạng thái
          </label>

          <select
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="
              mt-1 
              w-full 
              border 
              border-gray-300
              dark:border-gray-600
              rounded-lg 
              px-3 
              py-2 
              text-sm
              bg-white
              dark:bg-gray-800
              text-gray-800
              dark:text-gray-100
            "
          >
            <option value="PROPOSAL">Draft</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="APPROVED">Approved</option>
          </select>
        </div>

        {/* PROGRESS */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Tiến độ
            </label>

            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              {form.progressPercent}%
            </span>
          </div>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <div
              className="
                h-full
                bg-gradient-to-r 
                from-blue-500 
                to-blue-600
                dark:from-blue-400
                dark:to-blue-500
                transition-all duration-300
              "
              style={{ width: `${form.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* ACTION */}
      <div className="flex justify-end">
        <Button
          icon={Save}
          size="sm"
          label={isUpdating ? "Đang lưu..." : "Lưu thay đổi"}
          onClick={handleSubmit}
        />
      </div>
    </div>
  );
};

export default ThesisOverviewPage;
