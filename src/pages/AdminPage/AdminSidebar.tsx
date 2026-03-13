import { FaChartBar, FaUsers } from "react-icons/fa";
import logoUrl from "../../assets/images/simple-logo.png";
import NavItem from "../../components/header/NavItem";
const AdminSidebar = () => {
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
            Admin Portal
          </p>
          <p className="text-gray-600 font-md text-xs">Quản trị viên</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-6 mt-4">
        {/* Users */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
            Người dùng
          </p>
          <NavItem
            to={`/a/users`}
            label="Người dùng"
            icon={FaUsers}
            borderPosition="right"
          />
        </div>
        {/* Statistics */}
        <div>
          <p className="hidden lg:inline mb-2 text-xs font-semibold uppercase text-gray-400">
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
    </aside>
  );
};

export default AdminSidebar;
