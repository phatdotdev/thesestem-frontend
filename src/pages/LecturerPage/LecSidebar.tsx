import NavItem from "../../components/header/NavItem";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FaChartBar, FaLandmark, FaUsers, FaUserTie } from "react-icons/fa";
import LogoutButton from "../../components/UI/LogoutButton";
import { useLogoutMutation } from "../../services/authApi";
import { logout } from "../../features/auth/authSlice";

const LecSidebar = () => {
  const { "org-code": orgCode } = useParams();
  const logoUrl = useAppSelector((state) => state.organization.logoUrl);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest({}).unwrap();
    } catch {
    } finally {
      dispatch(logout());
      navigate(orgCode ? `/${orgCode}/login` : "/login", { replace: true });
    }
  };
  return (
    <aside className="flex h-dvh w-16 flex-col overflow-x-hidden border-r border-gray-200 bg-white px-2 py-3 dark:border-gray-800 dark:bg-gray-900 sm:w-20 sm:px-3 lg:w-60 lg:px-4">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center gap-2 border-b border-gray-100 dark:border-gray-800 sm:h-20 lg:gap-4">
        <img
          src={logoUrl}
          alt="logo"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-contain"
        />
        <div className="hidden lg:block">
          <p className="font-bold text-gray-800 dark:text-gray-300 uppercase text-sm">
            Lecturer Portal
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-md text-xs">
            Giảng viên
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 flex flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto">
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

        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
            Thống kê
          </p>
          <NavItem
            to={`/${orgCode}/l/statistics`}
            label="Thống kê"
            icon={FaChartBar}
          />
        </div>
      </nav>

      {/* Logout */}
      <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
        <LogoutButton onLogout={handleLogout} />
      </div>
    </aside>
  );
};

export default LecSidebar;
