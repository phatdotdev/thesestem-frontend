import NavItem from "../../components/header/NavItem";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../app/hook";
import { FaLandmark, FaUsers, FaUserTie } from "react-icons/fa";

const LecSidebar = () => {
  const { "org-code": orgCode } = useParams();
  const logoUrl = useAppSelector((state) => state.organization.logoUrl);
  return (
    <aside className="border-r w-20 md:w-60 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Logo */}
      <div className="flex h-20 items-center justify-center border-b border-gray-100 dark:border-gray-800 gap-4">
        <img
          src={logoUrl}
          alt="logo"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-contain"
        />
        <div className="md:block hidden">
          <p className="font-bold text-gray-800 uppercase text-sm">
            Lecturer Portal
          </p>
          <p className="text-gray-600 font-md text-xs">Giảng viên</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-6 mt-4">
        {/* Organization */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
            Giảng viên
          </p>
          <NavItem
            to={`/${orgCode}/l/info`}
            label="Thông tin cá nhân"
            icon={FaUserTie}
          />
        </div>

        {/* Thesis */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
            Luận văn
          </p>
          <NavItem
            to={`/${orgCode}/l/group`}
            label="Nhóm luận văn"
            icon={FaUsers}
          />
        </div>

        {/* Thesis */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
            Hội đồng
          </p>
          <NavItem
            to={`/${orgCode}/l/councils`}
            label="Nhóm hội đồng"
            icon={FaLandmark}
          />
        </div>
      </nav>
    </aside>
  );
};

export default LecSidebar;
