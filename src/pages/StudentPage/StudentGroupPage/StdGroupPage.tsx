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
  const groupCount = groups.length;

  const navigate = useNavigate();

  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
            <Users size={24} />
          </div>

          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-800 dark:text-gray-100">
              Nhóm của tôi
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
              Danh sách các nhóm bạn đang tham gia trong học kỳ hiện tại.
            </p>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                {groupCount} nhóm
              </span>

              <Badge label="Học kỳ hiện tại" variant="success" size="sm" dot />
            </div>
          </div>
        </div>
      </div>

      <div>
        {isLoading ? (
          <div className="py-12">
            <Loader />
          </div>
        ) : groups.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-16 text-center dark:border-gray-700 dark:bg-gray-800/70">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-500">
              <Users size={28} />
            </div>

            <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
              Bạn chưa tham gia nhóm nào
            </p>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500 dark:text-gray-400">
              Khi được giảng viên thêm vào nhóm, nhóm sẽ xuất hiện ở đây để bạn
              theo dõi nhiệm vụ và trao đổi.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
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
    </div>
  );
};

export default StudentGroupPage;
