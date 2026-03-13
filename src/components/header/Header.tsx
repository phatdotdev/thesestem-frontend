import SimpleLogo from "../../assets/images/simple-logo.png";
import { Home, BookOpen, LogIn, UserPlus, Building2 } from "lucide-react";

import { useNavigate } from "react-router-dom";
import Button from "../UI/Button";
import ThemeToggle from "../UI/ThemeToggle";
import NavItem from "./NavItem";

const Header = () => {
  const navigate = useNavigate();
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center h-16 px-4 lg:px-[100px] mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer">
          <img src={SimpleLogo} alt="Simple Logo" className="w-9 h-9" />
          <span
            style={{ fontFamily: "Litita" }}
            className="text-2xl tracking-wide"
          >
            thesestem
          </span>
        </div>

        {/* Menu */}
        <nav
          style={{ fontFamily: "Roboto" }}
          className=" font-semibold hidden md:flex items-center gap-8 text-gray-700 text-lg"
        >
          <NavItem size="sm" icon={Home} to="/" label="Trang chủ" />
          <NavItem size="sm" icon={BookOpen} to="/theses" label="Luận văn" />
          <NavItem size="sm" icon={Building2} to="/orgs" label="Tổ chức" />
        </nav>

        {/* Auth */}
        <div className="font-semibold flex items-center gap-2">
          <ThemeToggle />
          <Button
            size="sm"
            onClick={() => {
              {
                navigate("/login");
              }
            }}
            icon={LogIn}
            label="Đăng nhập"
            variant="outline"
          />
          <Button
            size="sm"
            onClick={() => {
              {
                navigate("/register");
              }
            }}
            icon={UserPlus}
            label="Đăng ký"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
