import { Link, useLocation } from "react-router-dom";
import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import clsx from "clsx";

interface NavItemProps {
  to: string;
  label: string;
  icon: LucideIcon | IconType;
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

const NavItem = ({
  to,
  label,
  icon: Icon,
  size = "md",
  borderPosition = "left",
}: NavItemProps) => {
  const location = useLocation();
  const isActive =
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const cfg = sizeConfig[size];

  const indicatorPosition = {
    left: "left-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r",
    right: "right-0 top-1/2 -translate-y-1/2 h-6 w-1 rounded-l",
    top: "top-0 left-1/2 -translate-x-1/2 h-1 w-6 rounded-b",
    bottom: "bottom-0 left-1/2 -translate-x-1/2 h-1 w-6 rounded-full",
  };

  return (
    <Link
      style={{ fontFamily: "Inter" }}
      to={to}
      className={clsx(
        "font-semibold group relative flex items-center gap-3 rounded-lg transition-all duration-200",
        cfg.padding,
        cfg.text,

        // Base
        "text-gray-600 dark:text-gray-300",

        // Hover
        "hover:bg-gray-100 hover:text-blue-600",
        "dark:hover:bg-gray-800 dark:hover:text-blue-400",
        "hover:translate-x-0.5",

        // Active
        isActive && "bg-blue-50 text-blue-600 shadow-sm border border-blue-200",
        isActive && "dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800",
      )}
    >
      {/* Active Indicator */}
      <span
        className={clsx(
          "absolute bg-blue-500 transition-all duration-200 rounded-lg",
          indicatorPosition[borderPosition],
          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40",
          borderPosition === "bottom" ? "w-[75%]" : "",
        )}
      />

      {/* Icon */}
      <Icon
        size={cfg.icon}
        className={clsx(
          "shrink-0 transition-transform duration-200",
          isActive && "scale-110",
          "group-hover:scale-105",
        )}
      />

      {/* Label */}
      <span className="hidden md:block whitespace-nowrap">{label}</span>
    </Link>
  );
};

export default NavItem;
