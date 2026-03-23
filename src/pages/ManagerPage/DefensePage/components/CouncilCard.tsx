import { getColor } from "../../../../utils/getColor";
import { getInitials } from "../../../../utils/getInitials";
import type { CouncilResponse } from "../../../../types/council";

const roleBadgeStyle: Record<string, string> = {
  "Chủ tịch": "bg-amber-100 text-amber-700 border border-amber-200",
  "Thư ký": "bg-sky-100 text-sky-700 border border-sky-200",
  "Phản biện": "bg-rose-100 text-rose-700 border border-rose-200",
  "Ủy viên": "bg-violet-100 text-violet-700 border border-violet-200",
  "Hướng dẫn": "bg-emerald-100 text-emerald-700 border border-emerald-200",
};

const CouncilCard = ({
  council,
}: {
  council: CouncilResponse | null | undefined;
}) => {
  if (!council) return;
  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm space-y-3">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            {council.name}
          </h3>
          <p className="text-xs text-gray-400">{council.code}</p>
        </div>

        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-md border text-gray-600">
          {council.members.length} thành viên
        </span>
      </div>

      {/* DIVIDER */}
      <div className="border-t"></div>

      {/* MEMBERS */}
      <div className="space-y-2">
        {council.members.map((member) => {
          const name = member.lecturer?.fullName ?? "—";
          const role = member.role?.name ?? "";

          return (
            <div key={member.id} className="flex items-center gap-2.5">
              {/* Avatar */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-xs font-semibold text-white shrink-0
                  ${getColor(name)}
                  shadow-sm
                `}
              >
                {getInitials(name)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 truncate">{name}</p>
              </div>

              {/* Role */}
              {role && (
                <span
                  className={`
                    text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap
                    ${
                      roleBadgeStyle[role] ??
                      "bg-gray-100 text-gray-600 border border-gray-200"
                    }
                  `}
                >
                  {role}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouncilCard;
