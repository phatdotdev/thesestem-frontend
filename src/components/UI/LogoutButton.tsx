import { MdLogout } from "react-icons/md";
import clsx from "clsx";

interface LogoutButtonProps {
  onLogout: () => void;
  size?: "sm" | "md";
  borderPosition?: "left" | "right" | "top" | "bottom";
}

const sizeConfig = {
  sm: {
    icon: 18,
    text: "text-sm",
    padding: "px-3 py-2",
  },
  md: {
    icon: 20,
    text: "text-[15px]",
    padding: "px-3 py-2.5",
  },
};

const LogoutButton = ({
  onLogout,
  size = "md",
  borderPosition = "left",
}: LogoutButtonProps) => {
  const cfg = sizeConfig[size];

  const indicatorPosition = {
    left: "left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r",
    right: "right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l",
    top: "top-0 left-1/2 -translate-x-1/2 h-1 w-6 rounded-b",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full",
  };

  return (
    <button
      onClick={onLogout}
      style={{ fontFamily: "Inter" }}
      className={clsx(
        "font-semibold group relative flex w-full max-w-full items-center justify-center gap-3 overflow-hidden rounded-lg transition-all duration-200 lg:justify-start",
        cfg.padding,
        cfg.text,

        "text-gray-600 dark:text-gray-300",

        "hover:bg-gray-100 hover:text-red-600",
        "dark:hover:bg-gray-800 dark:hover:text-red-400",
      )}
    >
      {/* Indicator */}
      <span
        className={clsx(
          "absolute bg-red-500 transition-all duration-200",
          indicatorPosition[borderPosition],
          "opacity-0 group-hover:opacity-40",
          borderPosition === "bottom" ? "w-[75%]" : "",
        )}
      />

      <MdLogout
        size={cfg.icon}
        className="shrink-0 transition-transform duration-200 group-hover:scale-105"
      />

      <span className="hidden whitespace-nowrap lg:block">Đăng xuất</span>
    </button>
  );
};

export default LogoutButton;
