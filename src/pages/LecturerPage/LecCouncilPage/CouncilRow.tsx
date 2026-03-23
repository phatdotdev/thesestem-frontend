import type { CouncilResponse } from "../../../types/council";
import { getColor } from "../../../utils/getColor";
import { getInitials } from "../../../utils/getInitials";
import { ChevronRight } from "lucide-react";

const CouncilRow = ({
  council,
  onClick,
}: {
  council: CouncilResponse;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="group border border-gray-200 rounded-xl p-4 space-y-3 bg-white
        cursor-pointer hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-50
        active:scale-[0.99] active:shadow-sm transition-all duration-150"
    >
      {/* COUNCIL HEADER */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="font-semibold text-gray-800 text-sm truncate group-hover:text-indigo-700 transition-colors duration-150">
            {council.name}
          </h2>
          <span className="shrink-0 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 tracking-wide">
            {council.code}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className="text-[11px] font-medium text-gray-400 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
            {council.members.length} thành viên
          </span>
          <ChevronRight
            size={14}
            className="text-gray-300 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all duration-150"
          />
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-dashed border-gray-100 group-hover:border-indigo-100 transition-colors duration-150" />

      {/* MEMBERS */}
      <div className="flex items-center gap-2 flex-wrap">
        {council.members.map((m: any) => {
          const isMe = m.currentUser;

          return (
            <div
              key={m.id}
              title={`${m.lecturer.fullName} — ${m.role?.name ?? ""}`}
              className={`
                flex items-center gap-2 px-2.5 py-1.5 rounded-full border text-xs font-medium
                ${
                  isMe
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }
              `}
            >
              {/* Avatar */}
              <div
                className={`
                  w-5 h-5 rounded-full flex items-center justify-center
                  text-white text-[9px] font-bold shrink-0
                  ${getColor(m.lecturer.fullName)}
                `}
              >
                {getInitials(m.lecturer.fullName)}
              </div>

              {/* Name */}
              <span className="truncate max-w-[120px]">
                {m.lecturer.fullName}
              </span>

              {/* Role */}
              {m.role?.name && (
                <span
                  className={`shrink-0 ${isMe ? "text-indigo-400" : "text-gray-400"}`}
                >
                  · {m.role.name}
                </span>
              )}

              {/* You badge */}
              {isMe && (
                <span className="shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500 text-white leading-none">
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
