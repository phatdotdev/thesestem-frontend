import { Edit, LucideAlertTriangle, Trash } from "lucide-react";
import Badge from "../../../../components/UI/Badge";
import type {
  AssignmentResponse,
  AssignmentStatus,
} from "../../../../types/group";
import { LuCalendarClock } from "react-icons/lu";
import Button from "../../../../components/UI/Button";

const AssignmentCard = ({
  assignment,
  onEdit,
  onDelete,
}: {
  assignment: AssignmentResponse;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const getStatusBadge = (assignment: AssignmentResponse) => {
    if (assignment.status === "OPEN")
      return <Badge label="Đang thực hiện" variant="success" size="sm" dot />;

    return <Badge label="Đã kết thúc" variant="danger" size="sm" dot />;
  };
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div
        key={assignment.id}
        className="group bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
      >
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
            {assignment.name}
          </h3>
          {getStatusBadge(assignment)}
        </div>

        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
          {assignment.description}
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
          <LuCalendarClock size={16} />

          <span>
            Hạn: {new Date(assignment.deadline).toLocaleDateString("vi-VN")}
          </span>
        </div>
        <div className="mt-4 flex gap-3 justify-end">
          <Button icon={Edit} size="sm" variant="outline" onClick={onEdit} />
          <Button icon={Trash} size="sm" variant="outline" onClick={onDelete} />
        </div>
      </div>
    </div>
  );
};

export default AssignmentCard;
