import { useState } from "react";
import { getColor } from "../../../../utils/getColor";
import { getInitials } from "../../../../utils/getInitials";
import { truncateWords } from "../../../../utils/truncateWord";
import type { CouncilResponse } from "../../../../types/council";

interface Props {
  council: CouncilResponse;
  selected?: boolean;
  onClick?: () => void;
}

const CouncilRow = ({ council, selected, onClick }: Props) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`
        group relative cursor-pointer rounded-lg
        transition-all duration-200
        border px-4 py-3
        ${
          selected
            ? "border-3 border-indigo-400 bg-indigo-50"
            : hovered
              ? "border-gray-300 bg-white"
              : "border-gray-200 bg-white"
        }
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between gap-3 mb-2">
        {/* Left: name + code */}
        <div className="flex items-center gap-2 min-w-0">
          <h3
            className={`text-sm font-semibold truncate ${
              selected ? "text-indigo-700" : "text-gray-800"
            }`}
          >
            {council.name}
          </h3>
          <span className="shrink-0 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-gray-500 tracking-wide">
            {council.code}
          </span>
        </div>

        {/* Right: member count */}
        <div
          className={`shrink-0 flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
            selected
              ? "bg-indigo-50 text-indigo-500"
              : "bg-gray-100 text-gray-400"
          }`}
        >
          <svg
            className="w-3 h-3"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0"
            />
          </svg>
          {council.members.length}
        </div>
      </div>

      {/* DIVIDER */}
      <div className="border-t border-gray-300 my-2"></div>

      {/* MEMBERS */}
      <div className="flex justify-between px-1">
        {council.members.map((m) => {
          const name = m.lecturer?.fullName ?? "—";
          const unit =
            m.lecturer?.department?.name ??
            m.lecturer?.faculty?.name ??
            m.lecturer?.college?.name ??
            "Chưa cập nhật";
          return (
            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
                {m?.role?.name}
              </p>
              <div key={m.id} className="flex items-center gap-2.5 group/item">
                {/* Avatar */}
                <div
                  className={`
                  w-7 h-7 rounded-full flex items-center justify-center
                  text-[11px] font-semibold text-white shrink-0
                  ${getColor(name)}
                  shadow-sm
                `}
                >
                  {getInitials(name)}
                </div>

                {/* Name */}
                <div className="text-gray-800 text-sm truncate font-semibold">
                  <p className="text-sm text-gray-800 truncate">
                    {m?.lecturer?.fullName ?? "—"} -{" "}
                    {m?.lecturer?.lecturerCode ?? "—"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {truncateWords(unit, 5)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouncilRow;
