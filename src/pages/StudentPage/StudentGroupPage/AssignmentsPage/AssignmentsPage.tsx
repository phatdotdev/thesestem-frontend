import { ClipboardList } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import EmptyState from "../../../../components/UI/EmptyState";
import { useGetGroupAssignmentsQuery } from "../../../../services/groupApi";
import AssignmentCard from "./AssignmenCard";

type AssignmentStatus = "ALL" | "OPEN" | "CLOSED";

const AssignmentPage = () => {
  const { ["group-id"]: id } = useParams();
  const { data: assignmentsResponse } = useGetGroupAssignmentsQuery(id || "");
  const [filter, setFilter] = useState<AssignmentStatus>("ALL");

  const assignments = assignmentsResponse?.data || [];

  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") return assignments;

    return assignments.filter((assignment) => assignment.status === filter);
  }, [assignments, filter]);

  return (
    <div className="mt-6 space-y-6 rounded-3xl border border-gray-200/80 bg-white/95 p-6 text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <ClipboardList size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Nhiệm vụ nhóm
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Theo dõi các nhiệm vụ giảng viên đã giao cho nhóm.
            </p>
          </div>
        </div>
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-3">
        <Badge
          label="Tất cả"
          onClick={() => setFilter("ALL")}
          variant={filter === "ALL" ? "primary" : "outline"}
        />

        <Badge
          label="Đang thực hiện"
          onClick={() => setFilter("OPEN")}
          variant={filter === "OPEN" ? "success" : "outline"}
        />

        <Badge
          label="Đã kết thúc"
          onClick={() => setFilter("CLOSED")}
          variant={filter === "CLOSED" ? "danger" : "outline"}
        />
      </div>

      {/* LIST */}
      {filteredAssignments.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Chưa có nhiệm vụ nào"
          description="Giảng viên chưa giao nhiệm vụ cho nhóm trong giai đoạn này."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard key={assignment.id} assignment={assignment} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignmentPage;
