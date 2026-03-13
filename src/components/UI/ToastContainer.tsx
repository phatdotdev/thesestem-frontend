import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { removeToast } from "../../features/notification/notificationSlice";
import type { RootState } from "../../app/store";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContainer = () => {
  const dispatch = useDispatch();
  const notifications = useSelector((state: RootState) => state.toast.toasts);

  useEffect(() => {
    notifications.forEach((notification) => {
      if (!notification.timeoutSet) {
        setTimeout(() => {
          dispatch(removeToast(notification.id as string));
        }, 2000);
      }
    });
  }, [notifications, dispatch]);

  const getStyle = (type: string) => {
    switch (type) {
      case "success":
        return {
          icon: <CheckCircle2 size={18} className="text-green-500" />,
          border: "border-green-200",
        };
      case "error":
        return {
          icon: <AlertCircle size={18} className="text-red-500" />,
          border: "border-red-200",
        };
      case "warning":
        return {
          icon: <AlertCircle size={18} className="text-yellow-500" />,
          border: "border-yellow-200",
        };
      default:
        return {
          icon: <Info size={18} className="text-blue-500" />,
          border: "border-gray-200",
        };
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] space-y-3">
      {notifications.map((n) => {
        const style = getStyle(n.type);

        return (
          <div
            key={n.id}
            className={`
              w-[340px]
              bg-white
              border
              ${style.border}
              shadow-md
              rounded-xl
              px-4
              py-3
              flex
              items-start
              gap-3
              animate-toast-in
            `}
          >
            {/* ICON */}
            <div className="mt-0.5">{style.icon}</div>

            {/* MESSAGE */}
            <div className="flex-1 text-sm text-gray-700">{n.message}</div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => dispatch(removeToast(n.id as string))}
              className="text-gray-400 hover:text-gray-600 transition"
            >
              <X size={16} />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default ToastContainer;
