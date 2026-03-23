import React from "react";

type Score = {
  id: string;
  score: number;
  comment?: string;
  member: {
    role: {
      name: string;
    };
    lecturer: {
      fullName: string;
    };
  };
};

type Props = {
  score: Score;
};

const ScoreCard: React.FC<Props> = ({ score }) => {
  const lecturerName = score?.member?.lecturer?.fullName || "Không xác định";
  const roleName = score?.member?.role?.name || "Thành viên";

  const initial =
    lecturerName?.split(" ").pop()?.charAt(0).toUpperCase() || "?";

  const getScoreColor = (s: number) => {
    if (s >= 8)
      return "bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/40 dark:border-emerald-900 dark:text-emerald-300";
    if (s >= 5)
      return "bg-amber-50 border-amber-200 text-amber-600 dark:bg-amber-950/40 dark:border-amber-900 dark:text-amber-300";
    return "bg-red-50 border-red-200 text-red-600 dark:bg-red-950/40 dark:border-red-900 dark:text-red-300";
  };

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-hidden">
      <div className="p-4 flex items-start justify-between gap-4">
        {/* Left */}
        <div className="min-w-0 flex gap-3">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xs font-semibold text-gray-600 dark:text-gray-300 shrink-0">
            {initial}
          </div>

          {/* Info */}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">
              {lecturerName}
            </p>

            <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-0.5">
              {roleName}
            </p>

            {score.comment && (
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed italic">
                {score.comment}
              </p>
            )}
          </div>
        </div>

        {/* Score Box */}
        <div
          className={`shrink-0 flex flex-col items-center justify-center w-14 h-14 rounded-xl border font-bold text-xl leading-none ${getScoreColor(
            score.score,
          )}`}
        >
          {score.score}

          <span className="text-[10px] font-normal opacity-60 mt-0.5">
            / 10
          </span>
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
