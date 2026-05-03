import { useSelector, useDispatch } from "react-redux";
import NotificationItem from "./NotificationItem";
import { markAllRead } from "../../features/notification/notificationSlice";
import { Bell, CheckCheck } from "lucide-react";

const NotificationDropdown = () => {
  const notifications =
    useSelector((state: any) => state.notification.notifications) || [];
  const dispatch = useDispatch();

  const unreadCount = notifications.filter((n: any) => !n.read).length;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-gray-950/60 overflow-hidden z-50">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            Thông báo
          </h3>
          {unreadCount > 0 && (
            <span className="text-[11px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-500 text-white leading-none">
              {unreadCount}
            </span>
          )}
        </div>

        {unreadCount > 0 && (
          <button
            onClick={() => dispatch(markAllRead())}
            className="flex items-center gap-1.5 text-xs font-medium text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <CheckCheck size={13} />
            Đánh dấu đã đọc
          </button>
        )}
      </div>

      {/* ── List ── */}
      <div
        className="overflow-y-auto"
        style={{
          maxHeight: "420px",
          scrollbarWidth: "thin",
          scrollbarColor: "#e5e7eb transparent",
        }}
      >
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 dark:text-gray-500 gap-2">
            <Bell size={28} className="text-gray-200 dark:text-gray-700" />
            <p className="text-sm">Không có thông báo nào</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {notifications.map((n: any, index: number) => (
              <NotificationItem
                key={index}
                title={n.title}
                content={n.content}
                time={n.createdAt}
                read={n.read}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Footer ── */}
      {notifications.length > 0 && (
        <div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
          <button className="w-full text-xs font-medium text-center text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
