import { ClipboardList } from "lucide-react";
import AssignmentCard from "./AssignmenCard";

const fakeAssignments = [
  {
    id: "1",
    title: "Bài tập Java OOP",
    subject: "Lập trình Java",
    deadline: "2026-02-05",
    status: "pending",
  },
  {
    id: "2",
    title: "Báo cáo UML",
    subject: "Phân tích hệ thống",
    deadline: "2026-01-20",
    status: "submitted",
  },
  {
    id: "3",
    title: "SQL Practice",
    subject: "Cơ sở dữ liệu",
    deadline: "2026-01-10",
    status: "late",
  },
];

const AssignmentPage = () => {
  return (
    <div className="space-y-6 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <ClipboardList className="h-5 w-5" />
          Nhiệm vụ
        </h1>
      </div>

      {/* LIST */}
      <div className="grid gap-4">
        {fakeAssignments.map((a) => (
          <AssignmentCard key={a.id} assignment={a} />
        ))}
      </div>
    </div>
  );
};

export default AssignmentPage;
