import { Users } from "lucide-react";
import Loader from "../../../components/UI/Loader";
import Badge from "../../../components/UI/Badge";

import { useGetCurrentStudentGroupsQuery } from "../../../services/groupApi";
import type { GroupResponse } from "../../../types/group";
import { useNavigate } from "react-router-dom";
import GroupCard from "./GroupCard";

const StudentGroupPage = () => {
  const { data: groupsResponse, isLoading } = useGetCurrentStudentGroupsQuery();

  const groups: GroupResponse[] = groupsResponse?.data ?? [];

  const navigate = useNavigate();

  return (
    <div className="space-y-6 bg-white dark:bg-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex gap-4">
          <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 flex items-center justify-center">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              Nhóm của tôi
            </h1>

            <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
              Danh sách các nhóm bạn đang tham gia trong học kỳ hiện tại
            </p>
          </div>
        </div>

        <Badge label="Học kỳ hiện tại" variant="success" size="sm" dot />
      </div>

      {/* ================= GROUP LIST ================= */}
      {isLoading ? (
        <Loader />
      ) : groups.length === 0 ? (
        <div className="text-center py-16 border border-dashed dark:border-gray-700 rounded-2xl bg-gray-50 dark:bg-gray-800">
          <Users
            className="mx-auto mb-4 text-gray-400 dark:text-gray-500"
            size={36}
          />

          <p className="font-semibold text-gray-700 dark:text-gray-200 text-lg">
            Bạn chưa tham gia nhóm nào
          </p>

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Khi được giảng viên thêm vào nhóm, nhóm sẽ xuất hiện ở đây
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onView={(g) => navigate(`${g.id}`)}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentGroupPage;
