import { useMemo, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Badge from "../../../../components/UI/Badge";
import Button from "../../../../components/UI/Button";
import AssignmentForm from "./AssignmentForm";
import AssignmentCard from "./AssignmentCard";
import ConfirmModal from "./ConfirmModal";

import { useGetGroupAssignmentsQuery } from "../../../../services/groupApi";
import { type AssignmentResponse } from "../../../../types/group";
import EmptyState from "../../../../components/UI/EmptyState";

type AssignmentStatus = "ALL" | "OPEN" | "CLOSED";

const MentorAssignmentPage = () => {
  const [filter, setFilter] = useState<AssignmentStatus>("ALL");
  const navigate = useNavigate();
  const { "group-id": id } = useParams();
  const { data: assignmentsResponse } = useGetGroupAssignmentsQuery(id || "");

  const [openAssignmentModal, setOpenAssignmentModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<AssignmentResponse | null>(null);
  const [deletingAssignment, setDeletingAssignment] =
    useState<AssignmentResponse | null>(null);

  const assignments = assignmentsResponse?.data || [];

  const filteredAssignments = useMemo(() => {
    if (filter === "ALL") return assignments;
    return assignments.filter((a) => a.status === filter);
  }, [filter, assignments]);

  // Đóng modal và reset state
  const handleCloseModal = () => {
    setOpenAssignmentModal(false);
    setEditingAssignment(null);
  };

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
              Nhiệm vụ hướng dẫn
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý và theo dõi các nhiệm vụ hướng dẫn sinh viên.
            </p>
          </div>
        </div>

        <Button
          label="Thêm nhiệm vụ"
          icon={Plus}
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingAssignment(null);
            setOpenAssignmentModal(true);
          }}
        />
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
          description="Thêm nhiệm vụ mới để bắt đầu hướng dẫn sinh viên."
          action={
            <Button
              label="Thêm nhiệm vụ"
              icon={Plus}
              size="sm"
              onClick={() => {
                setEditingAssignment(null);
                setOpenAssignmentModal(true);
              }}
            />
          }
        />
      ) : (
        <div className="grid md:grid-cols-3 gap-4">
          {filteredAssignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onViewDetails={() => navigate(`${assignment.id}`)}
              onEdit={() => {
                setEditingAssignment(assignment);
                setOpenAssignmentModal(true);
              }}
              onDelete={() => {
                setDeletingAssignment(assignment);
                setOpenConfirmModal(true);
              }}
            />
          ))}
        </div>
      )}

      {/* MODALS */}
      {openAssignmentModal && (
        <AssignmentForm
          open={openAssignmentModal}
          onClose={handleCloseModal}
          initialData={editingAssignment}
        />
      )}

      <ConfirmModal
        initialData={deletingAssignment}
        open={openConfirmModal}
        onClose={() => setOpenConfirmModal(false)}
      />
    </div>
  );
};

export default MentorAssignmentPage;
