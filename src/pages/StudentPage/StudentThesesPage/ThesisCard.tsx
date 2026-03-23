import { FiBookOpen, FiUser, FiMail } from "react-icons/fi";
import type { ThesisResponse } from "../../../types/thesis";
import { useNavigate } from "react-router-dom";

interface ThesisCardProps {
  thesis: ThesisResponse;
}

const ThesisCard = ({ thesis }: ThesisCardProps) => {
  const navigate = useNavigate();
  return (
    <div
      className="
        group
        bg-white
        dark:bg-gray-900
        border border-gray-200
        dark:border-gray-700
        rounded-2xl
        p-6
        shadow-sm
        hover:shadow-lg
        hover:-translate-y-1
        transition-all
        duration-200
      "
    >
      {/* TITLE */}
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
          <FiBookOpen size={18} />
        </div>

        <div className="flex-1">
          <h2
            className="cursor-pointer font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition"
            onClick={() => {
              {
                navigate(`${thesis.id}`);
              }
            }}
          >
            {thesis.title}
          </h2>

          {thesis.titleEn && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">
              {thesis.titleEn}
            </p>
          )}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

      {/* MENTOR */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        {thesis.mentor?.avatarUrl ? (
          <img
            src={thesis.mentor.avatarUrl}
            alt={thesis.mentor.fullName}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <FiUser size={16} />
          </div>
        )}

        <div className="flex-1">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {thesis.mentor?.fullName || "Chưa có giảng viên"}
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Giảng viên hướng dẫn
          </p>
        </div>
      </div>

      {/* EMAIL */}
      {thesis.mentor?.email && (
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-3">
          <FiMail size={14} />
          <span className="truncate">{thesis.mentor.email}</span>
        </div>
      )}

      {/* FOOTER */}
      <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-400 dark:text-gray-500 flex justify-between">
        <span>ID</span>
        <span className="truncate max-w-[160px]">{thesis.id}</span>
      </div>
    </div>
  );
};

export default ThesisCard;
