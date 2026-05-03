import { FiBook, FiCalendar, FiMessageSquare, FiFolder } from "react-icons/fi";

import { useParams } from "react-router-dom";
import NavItem from "../../../components/header/NavItem";
import { useGetGroupByIdQuery } from "../../../services/groupApi";
import Loader from "../../../components/UI/Loader";
import { FaUsers } from "react-icons/fa";

const StdTopbar = () => {
  const { ["org-code"]: code, ["group-id"]: id } = useParams();
  const { data: groupResponse, isLoading } = useGetGroupByIdQuery(id || "");
  const group = groupResponse?.data;

  const basePath = `/${code}/s/group/${id}`;

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* ===== GROUP HEADER ===== */}
      <div className="rounded-2xl border border-gray-200 bg-white pt-4 dark:border-gray-700 dark:bg-gray-900 sm:pt-6">
        <div className="flex flex-col gap-4 px-4 sm:flex-row sm:gap-5 sm:px-6">
          <div
            className="
              h-14 w-14 rounded-2xl
              bg-white dark:bg-gray-800
              shadow-md
              flex items-center justify-center
              text-blue-600 dark:text-blue-300
              font-bold text-xl
              border border-gray-200 dark:border-gray-700
              sm:h-16 sm:w-16 sm:rounded-3xl
              "
          >
            <FaUsers size={36} />
          </div>

          <div>
            <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-gray-100 sm:text-2xl">
              {group?.name}
            </h1>

            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-3xl">
              {group?.description || "Chưa có mô tả cho nhóm này"}
            </p>
          </div>
        </div>

        <div className="mt-4 pb-2 sm:mt-6 md:px-4">
          {/* ===== NAVIGATION ===== */}
          <nav className="flex gap-2 overflow-x-auto px-2 sm:flex-wrap sm:justify-start sm:gap-6 sm:px-0 md:justify-start">
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
