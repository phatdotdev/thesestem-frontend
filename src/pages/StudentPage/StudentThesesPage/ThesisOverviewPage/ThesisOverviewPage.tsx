import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetStudentThesisByIdQuery,
  useProgressThesisMutation,
  useRejectThesisMutation,
  useUpdateThesisMutation,
} from "../../../../services/thesisApi";
import Button from "../../../../components/UI/Button";
import Input from "../../../../components/UI/Input";
import { Compass, Info, Save } from "lucide-react";
import Textarea from "../../../../components/UI/TextArea";
import Badge from "../../../../components/UI/Badge";
import ConfirmModal from "../../../../components/UI/ConfirmModal";

const ThesisOverviewPage = () => {
  const { ["thesis-id"]: id } = useParams();

  const { data, isLoading } = useGetStudentThesisByIdQuery(id as string);
  const [updateThesis, { isLoading: isUpdating }] = useUpdateThesisMutation();
  const [progressThesis] = useProgressThesisMutation();
  const [rejectThesis] = useRejectThesisMutation();

  const navigate = useNavigate();
  const goToParentPath = () => {
    const parentPath = location.pathname.split("/").slice(0, -1).join("/");

    navigate(parentPath);
  };
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

  const handleChange = async (key: string, value: any) => {
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

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);

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
        <div className="col-span-2 flex justify-between items-center p-2">
          {form.status === "PROPOSAL" && (
            <Badge
              label="Luận văn đã được giảng viên hướng dẫn đề xuất. Bạn hãy xác nhận thực hiện hoặc từ chối đề xuất này."
              icon={Info}
              size="md"
              variant="warning"
            />
          )}

          {form.status === "IN_PROGRESS" && (
            <Badge
              label="Luận văn đang trong quá trình thực hiện. Hãy tiếp tục làm việc chăm chỉ và cập nhật tiến độ thường xuyên."
              icon={Info}
              size="md"
              variant="info"
            />
          )}

          {form.status === "APPROVED" && (
            <Badge
              label="Luận văn đã được giảng viên hướng dẫn duyệt. Bước tiếp theo hãy nộp luận văn."
              icon={Info}
              size="md"
              variant="success"
            />
          )}

          {form.status === "GRADED" && (
            <Badge
              label="Luận văn đã được chấm điểm. Hãy xem lại kết quả và phản hồi nếu cần."
              icon={Info}
              size="md"
              variant="success"
            />
          )}

          {form.status === "PROPOSAL" && (
            <div>
              <Button
                label="Chấp nhận thực hiện"
                size="sm"
                onClick={() => setShowConfirmModal(true)}
              />
              <Button
                label="Từ chối"
                variant="danger"
                onClick={() => setShowRejectModal(true)}
                className="ml-2"
                size="sm"
              />
            </div>
          )}
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

      <ConfirmModal
        title="Xác nhận thực hiện luận văn"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={async () => {
          await progressThesis(id as string).unwrap();
          setShowConfirmModal(false);
        }}
        open={showConfirmModal}
        description="Bạn chắc chắn muốn thực hiện luận văn này?"
      />
      <ConfirmModal
        title="Từ chối đề xuất luận văn"
        onClose={() => setShowRejectModal(false)}
        onConfirm={async () => {
          await rejectThesis(id as string);
          setShowRejectModal(false);
          goToParentPath();
        }}
        open={showRejectModal}
        description="Bạn chắc chắn muốn từ chối đề xuất luận văn này?"
        type="danger"
      />
    </div>
  );
};

export default ThesisOverviewPage;
