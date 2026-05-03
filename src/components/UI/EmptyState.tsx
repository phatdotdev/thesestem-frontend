import { type LucideIcon, HelpCircle } from "lucide-react";
import type { ReactNode } from "react";
import type { IconType } from "react-icons";

interface EmptyStateProps {
  icon?: LucideIcon | IconType;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

const EmptyState = ({
  icon: Icon = HelpCircle,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`
        flex flex-col items-center justify-center
        text-center
        py-16 px-6
        border border-dashed
        rounded-[2rem]
        bg-gray-50/50 dark:bg-gray-800/30
        border-gray-200 dark:border-gray-700
        ${className}
      `}
    >
      <div className="p-4 rounded-full bg-white dark:bg-gray-800 shadow-sm mb-4 border border-gray-100 dark:border-gray-700">
        <Icon
          className="text-gray-400 dark:text-gray-500"
          size={32}
          strokeWidth={1.5}
        />
      </div>

      <h3 className="font-bold text-gray-700 dark:text-gray-200 text-lg tracking-tight">
        {title}
      </h3>

      {description && (
        <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm max-w-[800px] mx-auto leading-relaxed">
          {description}
        </p>
      )}

      {action && <div className="mt-6">{action}</div>}
    </div>
  );
};

export default EmptyState;
