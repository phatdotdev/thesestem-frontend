import { BookOpen, Calendar, Eye, Pencil, Trash2, Users } from "lucide-react";
import Button from "../../../../components/UI/Button";
import { formatDateTimeVN } from "../../../../utils/formatters";
import type { TopicResponse, TopicStatus } from "../../../../types/group";

const getStatusConfig = (status: TopicStatus) => {
  switch (status) {
    case "DRAFT":
      return { label: "Nháp", className: "bg-gray-100 text-gray-600" };
    case "OPEN":
      return { label: "Đang mở", className: "bg-blue-100 text-blue-600" };
    case "IN_PROGRESS":
      return {
        label: "Đang thực hiện",
        className: "bg-yellow-100 text-yellow-700",
      };
    case "COMPLETED":
      return { label: "Hoàn thành", className: "bg-green-100 text-green-700" };
    default:
      return { label: status, className: "" };
  }
};

const TopicCard = ({
  topic,
  onEdit,
  onDelete,
}: {
  topic: TopicResponse;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const status = getStatusConfig(topic.status);

  return (
    <div className="group border border-gray-200 rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {topic.title}
          </h2>

          <p className="text-sm text-gray-500 max-w-2xl line-clamp-2">
            {topic.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${status.className}`}
        >
          {status.label}
        </span>
      </div>

      {/* Info */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mt-3">
        {/* Students */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4" />
            <span>
              {topic.students.length}/{topic.maxStudents} sinh viên
            </span>
          </div>
        </div>

        {/* Updated */}
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>
            {formatDateTimeVN(topic.updatedAt) ||
              formatDateTimeVN(topic.createdAt)}
          </span>
        </div>

        {/* Code */}
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span className="font-medium text-gray-700">TOPIC-{topic.id}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
        <Button size="sm" variant="outline" icon={Eye}>
          Xem
        </Button>
        <Button onClick={onEdit} size="sm" variant="outline" icon={Pencil}>
          Sửa
        </Button>
        <Button onClick={onDelete} size="sm" variant="danger" icon={Trash2}>
          Xóa
        </Button>
      </div>
    </div>
  );
};

export default TopicCard;
