import type { CouncilResponse } from "../../../types/council";
import AvatarInitial from "../../../components/UI/AvatarInitial";
import { ChevronRight } from "lucide-react";

const CouncilRow = ({
  council,
  onClick,
}: {
  council: CouncilResponse;
  onClick: () => void;
}) => {
  const unit = council?.college
    ? council.college.name
    : council?.faculty
      ? council.faculty.name
      : council?.department
        ? council.department.name
        : "Đơn vị chưa xác định";
  return (
    <div
      onClick={onClick}
      className="
        group
        border border-gray-200 dark:border-gray-700
        rounded-xl
        p-4
        space-y-3
        bg-white dark:bg-gray-800
        cursor-pointer
        hover:border-gray-300 dark:hover:border-gray-600
        transition-colors duration-150
      "
    >
      {/* COUNCIL HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2
            className="
              font-semibold
              text-gray-800 dark:text-gray-100
              text-sm
              truncate
              group-hover:text-gray-900 dark:group-hover:text-white
              transition-colors duration-150
            "
          >
            {council.name}
          </h2>

          <span
            className="
              shrink-0
              text-[10px] font-mono font-medium
              px-1.5 py-0.5
              rounded
              bg-gray-100 dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              text-gray-500 dark:text-gray-300
              tracking-wide
            "
          >
            {council.code}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <ChevronRight
            size={14}
            className="
              text-gray-300 dark:text-gray-500
              group-hover:text-gray-500 dark:group-hover:text-gray-300
              group-hover:translate-x-0.5
              transition-all duration-150
            "
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div
        className="
          border-t border-dashed
          border-gray-100 dark:border-gray-700
          group-hover:border-gray-200 dark:group-hover:border-gray-600
          transition-colors duration-150
        "
      />

      <div className="flex justify-between items-center gap-3">
        <span
          className="
              text-[11px] font-medium
              text-gray-400 dark:text-gray-300
              bg-gray-50 dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              px-2 py-0.5
              rounded-full
            "
        >
          {council.members.length} thành viên
        </span>
        <p
          className="
          text-[11px] font-medium
            text-gray-600 dark:text-gray-300
            bg-gray-50 dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              px-2 py-0.5
              rounded-full
        "
        >
          {unit}
        </p>
      </div>

      {/* MEMBERS */}
      <div className="flex items-center gap-2 flex-wrap">
        {council.members.map((m: any) => {
          const isMe = m.currentUser;

          return (
            <div
              key={m.id}
              title={`${m.lecturer.fullName} — ${m.role?.name ?? ""}`}
              className={`
                flex items-center gap-2
                px-2.5 py-1.5
                rounded-full
                border
                text-xs font-medium
                ${
                  isMe
                    ? "bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-500 text-gray-800 dark:text-gray-100"
                    : "bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300"
                }
              `}
            >
              {/* Avatar */}
              <AvatarInitial fullName={m.lecturer.fullName} size={20} />

              {/* Name */}
              <span className="truncate max-w-[120px]">
                {m.lecturer.fullName}
              </span>

              {/* Role */}
              {m.role?.name && (
                <span
                  className={`
                    shrink-0
                    ${
                      isMe
                        ? "text-gray-500 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-300"
                    }
                  `}
                >
                  · {m.role.name}
                </span>
              )}

              {/* You badge */}
              {isMe && (
                <span
                  className="
                    shrink-0
                    text-[9px] font-semibold
                    px-1.5 py-0.5
                    rounded-full
                    bg-gray-700 dark:bg-gray-600
                    text-gray-100
                    leading-none
                  "
                >
                  Bạn
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouncilRow;
