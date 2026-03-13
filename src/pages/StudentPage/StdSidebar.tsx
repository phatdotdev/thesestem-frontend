import { GraduationCap, LogOut, NotebookPen, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import NavItem from "../../components/header/NavItem";
import Button from "../../components/UI/Button";
import { useAppSelector } from "../../app/hook";

const StdSidebar = () => {
  const { "org-code": orgCode } = useParams();
  const logoUrl = useAppSelector((state) => state.organization.logoUrl);

  return (
    <aside
      className="
        flex flex-col
        h-screen
        w-20 md:w-60
        bg-white dark:bg-gray-950
        border-r border-gray-200 dark:border-gray-800
        shadow-sm
        px-4 py-6
      "
    >
      {/* Logo */}
      <div className="flex items-center justify-center lg:justify-start gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="logo"
              className="h-full w-full object-contain"
            />
          ) : (
            <GraduationCap className="w-6 h-6 text-gray-400" />
          )}
        </div>

        <div className="hidden lg:block">
          <p
            className="text-sm font-semibold text-center text-gray-800 dark:text-gray-100"
            style={{ fontFamily: "Inter" }}
          >
            Student Portal
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-100">Sinh viên</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-8 flex-1 mt-6">
        {/* Student */}
        <div>
          <p className="hidden lg:block mb-3 text-[11px] tracking-widest font-semibold uppercase text-gray-400">
            Sinh viên
          </p>

          <div className="flex flex-col gap-2">
            <NavItem
              to={`/${orgCode}/s/profile`}
              label="Thông tin cá nhân"
              icon={GraduationCap}
            />
          </div>
        </div>

        {/* Thesis */}
        <div>
          <p className="hidden lg:block mb-3 text-[11px] tracking-widest font-semibold uppercase text-gray-400">
            Luận văn
          </p>

          <div className="flex flex-col gap-2">
            <NavItem
              to={`/${orgCode}/s/register`}
              label="Đăng ký nhóm"
              icon={NotebookPen}
            />
            <NavItem
              to={`/${orgCode}/s/group`}
              label="Nhóm luận văn"
              icon={Users}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800">
          <Button
            icon={LogOut}
            label="Đăng xuất"
            variant="ghost"
            className="
              w-full
              justify-center lg:justify-start
              text-red-500 hover:text-red-600
              hover:bg-red-50 dark:hover:bg-red-900/20
            "
          />
        </div>
      </nav>
    </aside>
  );
};

export default StdSidebar;
