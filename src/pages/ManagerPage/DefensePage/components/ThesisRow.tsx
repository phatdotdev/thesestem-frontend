import AvatarInitial from "../../../../components/UI/AvatarInitial";
import { truncateWords } from "../../../../utils/truncateWord";

const ThesisRow = ({
  added,
  isAssigned,
  onClick,
  thesis,
  selected,
}: {
  added: boolean;
  isAssigned?: boolean;
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

  const getStatusLabel = (status?: string) => {
    if (!status) return "Chưa cập nhật";

    const normalized = status.toUpperCase();

    if (normalized === "APPROVED") return "Đã duyệt";
    if (normalized === "PENDING") return "Chờ duyệt";
    if (normalized === "REJECTED") return "Từ chối";
    if (normalized === "IN_PROGRESS") return "Đang thực hiện";
    if (normalized === "COMPLETED") return "Hoàn thành";
    if (normalized === "DRAFT") return "Bản nháp";

    return status
      .toLowerCase()
      .split("_")
      .map((s: string) => s.charAt(0).toUpperCase() + s.slice(1))
      .join(" ");
  };

  const getStatusClass = (status?: string) => {
    const normalized = (status ?? "").toUpperCase();

    if (normalized === "APPROVED" || normalized === "COMPLETED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (normalized === "PENDING" || normalized === "IN_PROGRESS") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (normalized === "REJECTED") {
      return "bg-red-50 text-red-700 border-red-200";
    }

    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  const thesisStatusLabel = getStatusLabel(thesis?.status);
  const progressPercent = Number.isFinite(thesis?.progressPercent)
    ? thesis.progressPercent
    : 0;

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

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {isAssigned && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-semibold">
              Đã phân công
            </span>
          )}
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getStatusClass(
              thesis?.status,
            )}`}
          >
            {thesisStatusLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center flex-wrap gap-2 mt-2">
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          Tiến độ: {progressPercent}%
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">
          Mức truy cập: {thesis?.accessLevel ?? "—"}
        </span>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
        {/* STUDENT */}
        <div className="space-y-1">
          <p className="text-[11px] uppercase tracking-wide text-gray-400 font-semibold">
            Sinh viên
          </p>

          <div className="flex items-center gap-2">
            <AvatarInitial
              fullName={student?.fullName}
              size={32}
              className={isDisabled ? "grayscale" : ""}
            />

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
            <AvatarInitial
              fullName={mentor?.fullName}
              size={32}
              className={isDisabled ? "grayscale" : ""}
            />

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
