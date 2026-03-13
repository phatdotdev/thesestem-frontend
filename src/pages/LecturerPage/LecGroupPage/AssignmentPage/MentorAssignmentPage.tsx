import { useMemo, useState } from "react";
import Badge from "../../../../components/UI/Badge";
import { LucideCheckCircle2, Plus } from "lucide-react";
import { useGetGroupAssignmentsQuery } from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import Button from "../../../../components/UI/Button";
import AssignmentForm from "./AssignmentForm";
import AssignmentCard from "./AssignmentCard";
import { type AssignmentResponse } from "../../../../types/group";
import ConfirmModal from "./ConfirmModal";

type AssignmentStatus = "ALL" | "OPEN" | "CLOSED";

const MentorAssignmentPage = () => {
  const [filter, setFilter] = useState<AssignmentStatus>("ALL");
  const { "group-id": id } = useParams();
  const { data: assignmentsResponse } = useGetGroupAssignmentsQuery(id || "");
  console.log(assignmentsResponse);

  const [openAssigmentModal, setOpenAssignmentModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const assignments = assignmentsResponse?.data || [];
  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") return assignments;
    if (filter === "OPEN")
      return assignments.filter((assignment) => assignment.status === "OPEN");
    if (filter === "CLOSED")
      return assignments.filter((assignment) => assignment.status === "CLOSED");
    return [];
  }, [filter, assignmentsResponse]);

  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentResponse | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<AssignmentResponse | null>(null);

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Danh sách nhiệm vụ
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý và theo dõi các nhiệm vụ của nhóm trong học kỳ hiện tại.
          </p>
        </div>

        <div>
          <Button
            label="Thêm nhiệm vụ"
            icon={Plus}
            size="sm"
            variant="outline"
            onClick={() => setOpenAssignmentModal(true)}
          />
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
        <div className="text-center py-16 border border-dashed rounded-3xl bg-gray-50">
          <LucideCheckCircle2
            className="mx-auto mb-4 text-gray-400"
            size={36}
          />
          <p className="font-semibold text-gray-600 text-lg">
            Không có nhiệm vụ phù hợp
          </p>
        </div>
      ) : (
        filteredAssignments.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
            onEdit={() => {
              {
                setEditingAssignment(assignment);
                setOpenAssignmentModal(true);
              }
            }}
            onDelete={() => {
              {
                setDeletingAssignment(assignment);
                setOpenConfirmModal(true);
              }
            }}
          />
        ))
      )}
      <AssignmentForm
        open={openAssigmentModal}
        onClose={() => {
          {
            setOpenAssignmentModal(false);
            setEditingAssignment(null);
          }
        }}
        initialData={editingAssignment}
      />
      <ConfirmModal
        open={openConfirmModal}
        onClose={() => {
          {
            setOpenConfirmModal(false);
            setDeletingAssignment(null);
          }
        }}
        initialData={deletingAssignment}
      />
    </div>
  );
};

export default MentorAssignmentPage;
