import { useState } from "react";
import { useSelector } from "react-redux";
import NotificationDropdown from "./NotificationDropdown";
import { Bell } from "lucide-react";

const NotificationBell = () => {
  const [open, setOpen] = useState(false);

  const unread = useSelector((state: any) => state.notification.unreadCount);

  return (
    <div className="relative dark:text-white">
      <button onClick={() => setOpen(!open)} className="relative">
        <Bell size={24} />
        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 rounded-full">
            {unread}
          </span>
        )}
      </button>

      {open && <NotificationDropdown />}
    </div>
  );
};

export default NotificationBell;
