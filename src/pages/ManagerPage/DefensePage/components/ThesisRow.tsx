import { getColor } from "../../../../utils/getColor";
import { getInitials } from "../../../../utils/getInitials";
import { truncateWords } from "../../../../utils/truncateWord";

const ThesisRow = ({
  added,
  onClick,
  thesis,
  selected,
}: {
  added: boolean;
  thesis: any;
  selected?: boolean;
  onClick?: () => void;
}) => {
  const student = thesis?.student;
  const mentor = thesis?.mentor;

  const unit =
    mentor?.department?.name ??
    mentor?.faculty?.name ??
    mentor?.college?.name ??
    "Chưa cập nhật";

  const isDisabled = added;

  return (
    <div
      onClick={!isDisabled ? onClick : undefined}
      className={`
        relative rounded-lg border transition-all duration-150 px-4 py-3 overflow-hidden
        
        ${
          isDisabled
            ? "bg-gray-50 border-gray-200 opacity-60 cursor-not-allowed"
            : selected
              ? "border-teal-400 bg-white shadow-md shadow-teal-50 cursor-pointer"
              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm cursor-pointer"
        }
      `}
    >
      {/* accent */}
      <div
        className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
          selected && !isDisabled ? "bg-teal-500" : "bg-transparent"
        }`}
      />

      {/* TITLE + STATUS */}
      <div className="flex justify-between items-start gap-2">
        <p
          className={`
            text-sm font-semibold leading-snug
            ${selected ? "text-teal-700" : "text-gray-800"}
            ${isDisabled ? "text-gray-400" : ""}
          `}
        >
          {truncateWords(thesis?.title ?? "Không có tiêu đề", 20)}
          {thesis?.titleEn && (
            <span className="text-gray-400 font-normal">
              {" "}
              • {truncateWords(thesis.titleEn, 15)}
            </span>
          )}
        </p>

        {/* BADGE */}
        {isDisabled && (
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 border">
            Đã phân công
          </span>
        )}
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        {/* STUDENT */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Sinh viên
          </p>

          <div className="flex items-center gap-2">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-semibold text-white
                ${getColor(student?.fullName)}
                shadow-sm
                ${isDisabled ? "grayscale" : ""}
              `}
            >
              {getInitials(student?.fullName)}
            </div>

            <div className="min-w-0">
              <p
                className={`text-sm truncate font-semibold ${
                  isDisabled ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {student?.fullName ?? "—"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {student?.studentCode ?? "—"}
              </p>
              <p className="text-xs text-blue-500 truncate">
                {student?.program?.name ?? ""}
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
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                text-xs font-semibold text-white
                ${getColor(mentor?.fullName)}
                shadow-sm
                ${isDisabled ? "grayscale" : ""}
              `}
            >
              {getInitials(mentor?.fullName)}
            </div>

            <div className="min-w-0">
              <p
                className={`text-sm truncate font-semibold ${
                  isDisabled ? "text-gray-400" : "text-gray-800"
                }`}
              >
                {mentor?.fullName ?? "—"}
              </p>
              <p className="text-xs text-gray-400 truncate">
                {mentor?.lecturerCode ?? "—"}
              </p>
              <p className="text-xs text-blue-500 truncate">
                {truncateWords(unit, 5)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThesisRow;
