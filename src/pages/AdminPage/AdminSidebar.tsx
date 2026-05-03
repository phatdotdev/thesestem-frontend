import { FaChartBar, FaUsers } from "react-icons/fa";
import logoUrl from "../../assets/images/simple-logo.png";
import NavItem from "../../components/header/NavItem";
import { useNavigate } from "react-router-dom";
import { MdTopic } from "react-icons/md";
import LogoutButton from "../../components/UI/LogoutButton";
import { useLogoutMutation } from "../../services/authApi";
import { useAppDispatch } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutRequest] = useLogoutMutation();

  const handleLogout = async () => {
    try {
      await logoutRequest({}).unwrap();
    } catch {
    } finally {
      dispatch(logout());
      navigate("/login", { replace: true });
    }
  };

  return (
    <aside className="border-r w-20 md:w-60 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3 flex flex-col">
      {/* Logo */}
      <div
        onClick={() => navigate("/a")}
        className="cursor-pointer flex h-20 items-center justify-center border-b border-gray-100 dark:border-gray-800 gap-4"
      >
        <img
          src={logoUrl}
          alt="logo"
          className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-contain"
        />
        <div className="md:block hidden">
          <p className="font-bold text-gray-800 dark:text-gray-100 uppercase text-sm">
            Admin Portal
          </p>
          <p className="text-gray-600 dark:text-gray-400 font-md text-xs">
            Quản trị viên
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-6 mt-4 flex-1">
        {/* Users */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
            Người dùng
          </p>
          <NavItem
            to={`/a/users`}
            label="Người dùng"
            icon={FaUsers}
            borderPosition="right"
          />
        </div>
        {/* Theses */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
            Đề tài
          </p>
          <NavItem
            to={`/a/theses`}
            label="Đề tài"
            icon={MdTopic}
            borderPosition="right"
          />
        </div>
        {/* Statistics */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
            Thống kê
          </p>
          <NavItem
            to={`/a/statistics`}
            label="Thống kê"
            icon={FaChartBar}
            borderPosition="right"
          />
        </div>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <LogoutButton onLogout={handleLogout} borderPosition="right" />
      </div>
    </aside>
  );
};

export default AdminSidebar;
