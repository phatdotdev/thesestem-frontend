import { useMemo, useState } from "react";
import { Bell, BellRing, School, UserRound, X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  useReadAllNotificationsMutation,
  useReadNotificationMutation,
} from "../../services/communicationApi";
import {
  markAllRead,
  markAsRead,
} from "../../features/notification/notificationSlice";
import { NOTIFICATION_TYPE_LABELS } from "../../utils/notificationType";

type NotificationPopProps = {
  userType?: "student" | "lecturer" | "manager";
};

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
  const normalized = (type || "").toLowerCase();
  if (normalized.includes("warning") || normalized.includes("warn"))
    return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300";
  if (normalized.includes("error") || normalized.includes("danger"))
    return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300";
  if (normalized.includes("success"))
    return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300";
  return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300";
};

const NotificationPop = ({ userType = "student" }: NotificationPopProps) => {
  const [open, setOpen] = useState(false);
  const [readNotification] = useReadNotificationMutation();
  const [readAllNotifications] = useReadAllNotificationsMutation();

  const notifications =
    useAppSelector((state) => state.notification.notifications) || [];
  const dispatch = useAppDispatch();
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

  const roleTitle =
    userType === "lecturer"
      ? "Thông báo giảng viên"
      : userType === "manager"
        ? "Thông báo quản lý"
        : "Thông báo sinh viên";
  const roleSubtitle =
    userType === "lecturer"
      ? "Cập nhật hội đồng, nhóm và tiến độ hướng dẫn"
      : userType === "manager"
        ? "Cập nhật tổ chức, phân công và hệ thống"
        : "Cập nhật đăng ký, nhóm và tiến độ luận văn";

  const RoleIcon = userType === "lecturer" ? School : UserRound;
  const unreadCount = useAppSelector((state) => state.notification.unreadCount);
  const triggerPositionClass =
    userType === "manager"
      ? "bottom-24 right-3 sm:bottom-6 sm:right-24"
      : "bottom-6 right-6";
  const panelPositionClass =
    userType === "manager"
      ? "bottom-24 right-3 sm:bottom-6 sm:right-[6.5rem]"
      : "bottom-6 right-6";

  const handleReadNotification = async (
    notificationId: string,
    read?: boolean,
  ) => {
    if (!notificationId || read) {
      return;
    }

    dispatch(markAsRead(notificationId));

    try {
      await readNotification(notificationId).unwrap();
    } catch {
      // Keep optimistic UI for better UX; next refetch will reconcile.
    }
  };

  const handleReadAllNotifications = async () => {
    if (unreadCount === 0) {
      return;
    }

    dispatch(markAllRead());

    try {
      await readAllNotifications().unwrap();
    } catch {
      // Keep optimistic UI for better UX; next refetch will reconcile.
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`fixed ${triggerPositionClass} z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700`}
        aria-label="Mở danh sách thông báo"
      >
        <BellRing size={22} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 min-w-5 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          className={`fixed ${panelPositionClass} z-50 w-[420px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-900`}
        >
          <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-4 text-white dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-white/15 p-2">
                <RoleIcon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">{roleTitle}</p>
                <p className="text-xs text-white/85">{roleSubtitle}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-white/10 p-2 hover:bg-white/20"
              aria-label="Đóng danh sách thông báo"
            >
              <X size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Bell size={14} />
              <span>Thông báo mới nhất dành cho bạn</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {unreadCount} chưa đọc
              </span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleReadAllNotifications}
                  className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-600 hover:bg-blue-100 dark:bg-blue-900/40 dark:text-blue-300 dark:hover:bg-blue-900/60"
                >
                  Đọc tất cả
                </button>
              )}
            </div>
          </div>

          {/* Chiều cao cố định ở đây */}
          <div className="h-[340px] overflow-y-auto px-4 py-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600">
            <div className="space-y-3">
              {sortedNotifications.map((item, index) => (
                <div
                  onClick={() =>
                    void handleReadNotification(item.id, item.read)
                  }
                  key={`${item.createdAt || "n"}-${index}`}
                  className={`cursor-pointer rounded-2xl border p-3.5 hover:border-blue-200 dark:border-gray-700
    ${
      !item.read
        ? "border-blue-200 bg-blue-50 dark:bg-blue-950/30"
        : "border-gray-200 bg-white dark:bg-gray-800"
    }`}
                >
                  {/* Title + chấm chưa đọc */}
                  <div className="mb-1.5 flex items-start gap-2">
                    {!item.read && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <p className="line-clamp-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                      {item.title || "Thông báo hệ thống"}
                    </p>
                  </div>

                  {/* Type badge */}
                  {item.type && (
                    <div className={`mb-2 ${!item.read ? "ml-4" : ""}`}>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${getTypeBadgeClass(item.type)}`}
                      >
                        {NOTIFICATION_TYPE_LABELS[item.type] || item.type}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <p
                    className={`text-sm leading-relaxed text-gray-600 dark:text-gray-300 ${!item.read ? "ml-4" : ""}`}
                  >
                    {item.content || "Không có nội dung chi tiết."}
                  </p>

                  {/* Time */}
                  <p
                    className={`mt-2 text-xs text-gray-400 dark:text-gray-500 ${!item.read ? "ml-4" : ""}`}
                  >
                    {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationPop;
