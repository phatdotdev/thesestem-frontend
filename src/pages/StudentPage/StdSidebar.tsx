import { useParams, useNavigate } from "react-router-dom";
import NavItem from "../../components/header/NavItem";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FaGraduationCap, FaUserTie } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { MdTopic } from "react-icons/md";
import { logout } from "../../features/auth/authSlice";
import { useLogoutMutation } from "../../services/authApi";
import LogoutButton from "../../components/UI/LogoutButton";

const StdSidebar = () => {
  const { "org-code": orgCode } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [logoutRequest] = useLogoutMutation();
  const logoUrl = useAppSelector((state) => state.organization.logoUrl);

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
    <aside
      className="
        flex flex-col
        h-dvh
        w-16 sm:w-20 lg:w-64
        overflow-x-hidden
        bg-white dark:bg-gray-950
        border-r border-gray-200 dark:border-gray-800
        shadow-sm
        px-2 sm:px-3 lg:px-4 py-4 sm:py-5 lg:py-6
      "
    >
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 border-b border-gray-100 pb-4 dark:border-gray-800 sm:pb-5 lg:justify-start lg:gap-4 lg:pb-6">
        <div className="h-12 w-12 rounded-xl flex items-center justify-center overflow-hidden">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="logo"
              className="h-full w-full object-contain"
            />
          ) : (
            <FaGraduationCap className="w-6 h-6 text-gray-400" />
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
      <nav className="mt-4 flex flex-1 flex-col gap-6 overflow-x-hidden overflow-y-auto sm:mt-5 lg:mt-6 lg:gap-8">
        {/* Student */}
        <div>
          <p className="mb-2 hidden text-[11px] font-semibold uppercase tracking-widest text-gray-400 lg:mb-3 lg:block">
            Sinh viên
          </p>

          <div className="flex flex-col gap-2">
            <NavItem
              to={`/${orgCode}/s/profile`}
              label="Thông tin cá nhân"
              icon={FaGraduationCap}
            />
          </div>
        </div>

        {/* Thesis */}
        <div>
          <p className="mb-2 hidden text-[11px] font-semibold uppercase tracking-widest text-gray-400 lg:mb-3 lg:block">
            Luận văn
          </p>

          <div className="flex flex-col gap-2">
            <NavItem
              to={`/${orgCode}/s/register`}
              label="Giảng viên hướng dẫn"
              icon={FaUserTie}
            />
            <NavItem
              to={`/${orgCode}/s/group`}
              label="Nhóm luận văn"
              icon={FaUserGroup}
            />

            <NavItem
              to={`/${orgCode}/s/theses`}
              label="Đề tài luận văn"
              icon={MdTopic}
            />
          </div>
        </div>

        {/* Logout */}
        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800 sm:pt-5 lg:pt-6">
          <LogoutButton onLogout={handleLogout} />
        </div>
      </nav>
    </aside>
  );
};

export default StdSidebar;
