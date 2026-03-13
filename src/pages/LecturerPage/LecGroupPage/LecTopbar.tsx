import {
  LuBookCopy,
  LuCalendarClock,
  LuMessagesSquare,
  LuUsersRound,
  LuFolderKanban,
} from "react-icons/lu";
import { useParams } from "react-router-dom";
import NavItem from "../../../components/header/NavItem";
import { useGetGroupByIdQuery } from "../../../services/groupApi";
import Loader from "../../../components/UI/Loader";
import { FaUsers } from "react-icons/fa";
import Button from "../../../components/UI/Button";
import { Edit } from "lucide-react";
import { MdAssignment } from "react-icons/md";

const LecTopbar = () => {
  const { ["org-code"]: code, ["group-id"]: id } = useParams();
  const { data: groupResponse, isLoading } = useGetGroupByIdQuery(id || "");
  const group = groupResponse?.data;

  const basePath = `/${code}/l/group/${id}`;

  if (isLoading) {
    return (
      <div className="h-screen flex items-center">
        <Loader />
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* ===== GROUP HEADER ===== */}
      <div className="bg-white border border-gray-200 pt-6 rounded-2xl">
        <div className="flex justify-between  px-6">
          <div className="flex items-center gap-5">
            {/* Avatar group */}
            <div className="h-16 w-16 rounded-3xl bg-white shadow-md flex items-center justify-center text-blue-600 font-bold text-xl">
              <FaUsers size={40} />
            </div>

            <div className="">
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                {group?.name}
              </h1>
              <p className="text-gray-600 mt-1 max-w-2xl">
                {group?.description || "Chưa có mô tả cho nhóm này"}
              </p>
            </div>
          </div>

          <div>
            <Button label="Chỉnh sửa" icon={Edit} size="sm" variant="outline" />
          </div>
        </div>

        <div className="mt-6 pb-2 md:px-4">
          {/* ===== NAVIGATION ===== */}
          <nav className=" rounded-2xl flex flex-wrap gap-2 justify-center gap-6 md:justify-start">
            <NavItem
              to={`${basePath}/assignments`}
              label="Nhiệm vụ"
              icon={MdAssignment}
              borderPosition="bottom"
            />
            <NavItem
              to={`${basePath}/meetings`}
              label="Lịch họp"
              icon={LuCalendarClock}
            />
            <NavItem
              to={`${basePath}/chat`}
              label="Trò chuyện"
              icon={LuMessagesSquare}
            />
            <NavItem
              to={`${basePath}/documents`}
              label="Tài liệu"
              icon={LuBookCopy}
            />
            <NavItem
              to={`${basePath}/members`}
              label="Thành viên"
              icon={LuUsersRound}
            />
            <NavItem
              to={`${basePath}/topics`}
              label="Đề tài"
              icon={LuFolderKanban}
            />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default LecTopbar;
