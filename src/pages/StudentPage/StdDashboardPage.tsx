import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { useGetStudentProfileQuery } from "../../services/userApi";
import { Bell } from "lucide-react";
import {
  markAllRead,
  markAsRead,
} from "../../features/notification/notificationSlice";
import { NOTIFICATION_TYPE_LABELS } from "../../utils/notificationType";

const formatTimeAgo = (value?: string) => {
  if (!value) return "Vừa xong";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  const diffMs = Date.now() - date.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "Vừa xong";
  if (minutes < 60) return `${minutes} phút trước`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getTypeBadgeClass = (type?: string) => {
  const t = (type || "").toLowerCase();
  if (t.includes("reject") || t.includes("remove") || t.includes("error"))
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (t.includes("deadline") || t.includes("reminder") || t.includes("warn"))
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  if (t.includes("approve") || t.includes("success") || t.includes("final"))
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
};

const StdDashboardPage = () => {
  const { data: studentProfileResponse } = useGetStudentProfileQuery();
  const student = studentProfileResponse?.data;

  const dispatch = useAppDispatch();

  const notifications =
    useAppSelector((state) => state.notification.notifications) || [];
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);

  const sortedNotifications = useMemo(() => {
    return [...notifications].sort((a, b) => {
      const timeA = new Date(a.createdAt || "").getTime();
      const timeB = new Date(b.createdAt || "").getTime();
      if (Number.isNaN(timeA) && Number.isNaN(timeB)) return 0;
      if (Number.isNaN(timeA)) return 1;
      if (Number.isNaN(timeB)) return -1;
      return timeB - timeA;
    });
  }, [notifications]);
  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden p-0 sm:gap-5 lg:gap-6">
      {/* Welcome — cố định, không scroll */}
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900 sm:p-5 lg:p-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Xin chào {student?.fullName}!
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Chào mừng bạn quay lại hệ thống quản lý luận văn
        </p>
      </div>

      {/* Notification list — chiếm phần còn lại, scroll bên trong */}
      <div className="flex min-h-0 flex-1 flex-col rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
        {/* Header cố định */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-gray-200 px-3 py-3 dark:border-gray-700 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white">
            <Bell size={16} />
            <span>Thông báo của bạn</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {unreadCount} chưa đọc
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={() => dispatch(markAllRead())}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              Đọc tất cả
            </button>
          )}
        </div>

        {/* Danh sách — scroll */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-gray-400 dark:text-gray-600">
              <Bell size={28} strokeWidth={1.5} />
              <p className="text-sm">Không có thông báo nào</p>
            </div>
          ) : (
            sortedNotifications.map((item, index) => (
              <div
                key={`${item.createdAt || "n"}-${index}`}
                onClick={() => dispatch(markAsRead(item.id))}
                className={`cursor-pointer px-3 py-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 sm:px-4 sm:py-3.5 lg:px-5 lg:py-4
                      ${!item.read ? "bg-blue-50 dark:bg-blue-950/20" : ""}`}
              >
                <div className="mb-1.5 flex items-start gap-2">
                  {!item.read && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
                    {item.title || "Thông báo hệ thống"}
                  </p>
                </div>
                {item.type && (
                  <div className={`mb-2 ${!item.read ? "ml-4" : ""}`}>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getTypeBadgeClass(item.type)}`}
                    >
                      {NOTIFICATION_TYPE_LABELS[item.type] || item.type}
                    </span>
                  </div>
                )}
                <p
                  className={`text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${!item.read ? "ml-4" : ""}`}
                >
                  {item.content || "Không có nội dung chi tiết."}
                </p>
                <p
                  className={`mt-1.5 text-xs text-gray-400 dark:text-gray-500 ${!item.read ? "ml-4" : ""}`}
                >
                  {formatTimeAgo(item.createdAt)}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default StdDashboardPage;
