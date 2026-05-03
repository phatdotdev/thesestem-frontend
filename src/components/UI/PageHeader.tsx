import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";

interface PageHeaderProps {
  icon: LucideIcon | IconType;
  title: string;
  description?: string;
  rightContent?: React.ReactNode;
}

const PageHeader = ({
  icon: Icon,
  title,
  description,
  rightContent,
}: PageHeaderProps) => {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4">
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <div
          className="
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-xl
            bg-blue-100
            dark:bg-blue-900/30
            text-blue-600
            dark:text-blue-400
          "
        >
          <Icon className="w-6 h-6" />
        </div>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      </div>

      {/* RIGHT */}
      {rightContent && (
        <div className="flex items-center gap-2">{rightContent}</div>
      )}
    </div>
  );
};

export default PageHeader;
