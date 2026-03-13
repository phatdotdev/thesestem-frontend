import {
  BookCopy,
  CalendarClock,
  ListTodo,
  MessagesSquare,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import NavItem from "../../../components/header/NavItem";

const StdTopbar = () => {
  const location = useLocation();
  const basePath = location.pathname;

  return (
    <nav
      className="
        flex items-center gap-2
        rounded-xl border border-gray-200
        bg-white px-2 py-2
        shadow-sm
        dark:border-gray-800 dark:bg-gray-900
      "
    >
      <NavItem
        to={`${basePath}/assignments`}
        label="Nhiệm vụ"
        icon={ListTodo}
      />
      <NavItem
        to={`${basePath}/meetings`}
        label="Lịch họp"
        icon={CalendarClock}
      />
      <NavItem
        to={`${basePath}/chat`}
        label="Trò chuyện"
        icon={MessagesSquare}
      />
      <NavItem to={`${basePath}/documents`} label="Tài liệu" icon={BookCopy} />
    </nav>
  );
};

export default StdTopbar;
