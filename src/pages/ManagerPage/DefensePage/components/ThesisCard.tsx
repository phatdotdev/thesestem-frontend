import { getColor } from "../../../../utils/getColor";
import { getInitials } from "../../../../utils/getInitials";
import { truncateWords } from "../../../../utils/truncateWord";
import type { ThesisResponse } from "../../../../types/thesis";

const ThesisCard = ({
  thesis,
}: {
  thesis: ThesisResponse | null | undefined;
}) => {
  if (!thesis) return;
  const student = thesis?.student;
  const mentor = thesis?.mentor;

  return (
    <div className="border rounded-2xl p-4 bg-white shadow-sm space-y-3">
      {/* TITLE */}
      <div>
        <h3 className="text-sm font-semibold text-gray-800 leading-snug">
          {truncateWords(thesis?.title ?? "Không có tiêu đề", 20)}
        </h3>

        {thesis?.titleEn && (
          <p className="text-xs text-gray-400 mt-0.5">
            {truncateWords(thesis.titleEn, 15)}
          </p>
        )}
      </div>

      {/* DIVIDER */}
      <div className="border-t"></div>

      {/* INFO */}
      <div className="grid grid-cols-1 gap-4 text-sm">
        {/* STUDENT */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Sinh viên
          </p>

          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-semibold text-white
                ${getColor(student?.fullName)}
                shadow-sm
              `}
            >
              {getInitials(student?.fullName)}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {student?.fullName ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {student?.studentCode ?? "—"}
              </p>
            </div>
          </div>
        </div>

        {/* MENTOR */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            GV hướng dẫn
          </p>

          <div className="flex items-center gap-2">
            {/* Avatar */}
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-semibold text-white
                ${getColor(mentor?.fullName)}
                shadow-sm
              `}
            >
              {getInitials(mentor?.fullName)}
            </div>

            {/* Info */}
            <div className="min-w-0">
              <p className="text-sm text-gray-800 truncate">
                {mentor?.fullName ?? "—"}
              </p>
              <p className="text-xs text-gray-500">
                {mentor?.lecturerCode ?? "—"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisCard;
