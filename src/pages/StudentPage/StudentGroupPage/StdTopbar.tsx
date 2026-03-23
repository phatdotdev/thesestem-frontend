import {
  FiBook,
  FiCalendar,
  FiMessageSquare,
  FiFolder,
  FiUsers,
} from "react-icons/fi";

import { useParams } from "react-router-dom";
import NavItem from "../../../components/header/NavItem";
import { useGetGroupByIdQuery } from "../../../services/groupApi";
import Loader from "../../../components/UI/Loader";

const StdTopbar = () => {
  const { ["org-code"]: code, ["group-id"]: id } = useParams();
  const { data: groupResponse, isLoading } = useGetGroupByIdQuery(id || "");
  const group = groupResponse?.data;

  const basePath = `/${code}/s/group/${id}`;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== GROUP HEADER ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 pt-6 rounded-2xl">
        <div className="flex justify-between px-6">
          <div className="flex items-center gap-5">
            {/* Avatar group */}
            <div className="h-16 w-16 rounded-3xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-blue-600 dark:text-blue-400">
              <FiUsers size={34} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {group?.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-300 mt-1 max-w-2xl">
                {group?.description || "Chưa có mô tả cho nhóm này"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pb-2 md:px-4">
          {/* ===== NAVIGATION ===== */}
          <nav className="flex flex-wrap gap-6 justify-center md:justify-start">
            <NavItem
              to={`${basePath}/assignments`}
              label="Nhiệm vụ"
              icon={FiFolder}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/meetings`}
              label="Lịch họp"
              icon={FiCalendar}
            />

            <NavItem
              to={`${basePath}/chat`}
              label="Trò chuyện"
              icon={FiMessageSquare}
            />

            <NavItem
              to={`${basePath}/documents`}
              label="Tài liệu"
              icon={FiBook}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default StdTopbar;
