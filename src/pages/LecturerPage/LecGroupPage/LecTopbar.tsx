import { useNavigate, useParams } from "react-router-dom";
import NavItem from "../../../components/header/NavItem";
import { useGetGroupByIdQuery } from "../../../services/groupApi";
import Loader from "../../../components/UI/Loader";
import { FaUsers } from "react-icons/fa";
import Button from "../../../components/UI/Button";
import {
  CalendarClock,
  ClipboardList,
  Edit,
  FileText,
  FolderKanban,
  GraduationCap,
  MessageCircle,
  MoveLeft,
  Users,
} from "lucide-react";

const LecTopbar = () => {
  const navigate = useNavigate();
  const { ["org-code"]: code, ["group-id"]: id } = useParams();
  const { data: groupResponse, isLoading } = useGetGroupByIdQuery(id || "");
  const group = groupResponse?.data;

  const basePath = `/${code}/l/group/${id}`;
  const groupListPath = `/${code}/l/group`;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ===== GROUP HEADER ===== */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 pt-6 rounded-2xl shadow-sm">
        <div className="px-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <Button
            label="Quay lại nhóm"
            icon={MoveLeft}
            size="sm"
            variant="ghost"
            onClick={() => navigate(groupListPath)}
          />
        </div>

        <div className="flex justify-between px-6">
          <div className="flex items-center gap-5">
            {/* Avatar group */}
            <div
              className="
              h-16 w-16 rounded-3xl
              bg-white dark:bg-gray-800
              shadow-md
              flex items-center justify-center
              text-blue-600 dark:text-blue-300
              font-bold text-xl
              border border-gray-200 dark:border-gray-700
              "
            >
              <FaUsers size={36} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
                {group?.name}
              </h1>

              <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-2xl">
                {group?.description || "Chưa có mô tả cho nhóm này"}
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <Button label="Chỉnh sửa" icon={Edit} size="sm" variant="outline" />
          </div>
        </div>

        {/* NAV */}
        <div className="mt-6 pb-2 md:px-4">
          <nav
            className="
      flex flex-wrap
      gap-2 md:gap-6
      justify-center md:justify-start
      border-t border-gray-100 dark:border-gray-800
      pt-4
    "
          >
            <NavItem
              to={`${basePath}/assignments`}
              label="Nhiệm vụ"
              icon={ClipboardList}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/meetings`}
              label="Họp nhóm"
              icon={CalendarClock}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/chat`}
              label="Trò chuyện"
              icon={MessageCircle}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/documents`}
              label="Tài liệu"
              icon={FileText}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/members`}
              label="Thành viên"
              icon={Users}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/topics`}
              label="Đề tài"
              icon={FolderKanban}
              borderPosition="bottom"
            />

            <NavItem
              to={`${basePath}/theses`}
              label="Luận văn"
              icon={GraduationCap}
              borderPosition="bottom"
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LecTopbar;
