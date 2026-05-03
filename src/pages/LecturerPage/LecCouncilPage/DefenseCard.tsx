import {
  MapPin,
  ArrowRight,
  User,
  GraduationCap,
  CalendarDays,
  Timer,
  Presentation,
} from "lucide-react";
import type { DefenseResponse } from "../../../types/defense";
import { formatDateTimeVN } from "../../../utils/formatters";

type Props = {
  d: DefenseResponse;
  onClick?: (d: DefenseResponse) => void;
};

const DefenseCard = ({ d, onClick }: Props) => {
  const student = d?.thesis?.student;
  const mentor = d?.thesis?.mentor;
  const isDefended = (d?.scores?.length ?? 0) > 0;
  const hasSchedule = !!d.defenseTime;

  const defenseTime = hasSchedule
    ? formatDateTimeVN(d.defenseTime, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Chưa xếp giờ";

  return (
    <div
      onClick={() => onClick?.(d)}
      className="group relative cursor-pointer overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition-colors duration-200 hover:border-gray-300 dark:border-gray-700 dark:bg-gray-900/70 dark:hover:border-gray-600"
    >
      <div className="flex items-start gap-5">
        {/* 1. ICON LỊCH BẢO VỆ (Trạng thái) */}
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border transition-colors ${
            isDefended
              ? "bg-gray-100 border-gray-200 text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
              : "bg-gray-50 border-gray-200 text-gray-600 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400"
          }`}
        >
          {isDefended ? <Presentation size={24} /> : <CalendarDays size={24} />}
        </div>

        {/* 2. THÔNG TIN CHÍNH (Tên đề tài + SV/GV) */}
        <div className="min-w-0 flex-1 space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2">
              <h3 className="line-clamp-2 text-base font-semibold leading-6 text-gray-900 transition-colors group-hover:text-gray-900 dark:text-gray-100 dark:group-hover:text-white">
                {d.thesis?.title || "Chưa có tên đề tài"}
              </h3>
              <ArrowRight
                size={18}
                className="shrink-0 -translate-x-1 text-gray-300 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
              />
            </div>
            {d.thesis?.titleEn && (
              <p className="mt-0.5 line-clamp-1 text-xs italic text-gray-400 dark:text-gray-500">
                {d.thesis.titleEn}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Student */}
            <div
              className="
                      flex items-center gap-1.5
                      rounded-lg border
                      px-2.5 py-1
                      text-xs font-medium
                      bg-gray-50
                      text-gray-700
                      border-gray-200
                      dark:bg-gray-800
                      dark:text-gray-300
                      dark:border-gray-700
                    "
            >
              <GraduationCap size={13} />
              <span>
                Sinh viên thực hiện: {student?.fullName || "N/A"} -{" "}
                {student?.studentCode || "N/A"}
              </span>
            </div>

            {/* Mentor */}
            <div
              className="
                      flex items-center gap-1.5
                      rounded-lg border
                      px-2.5 py-1
                      text-xs font-medium
                      bg-gray-50
                      text-gray-700
                      border-gray-200
                      dark:bg-gray-800
                      dark:text-gray-300
                      dark:border-gray-700
                    "
            >
              <User size={13} />
              Giảng viên hướng dẫn: {mentor?.fullName || "N/A"}
            </div>

            {/* Time */}
            <div
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold ${
                isDefended
                  ? "border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
                  : "border-amber-100 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300"
              }`}
            >
              <Timer size={13} /> Thời gian bảo vệ: {defenseTime}
            </div>

            {/* Location */}
            <div
              className="
              flex items-center gap-1.5
              rounded-lg border
              px-2.5 py-1
              text-xs font-semibold
              bg-gray-50
              text-gray-700
              border-gray-200
              dark:bg-gray-800
              dark:text-gray-300
              dark:border-gray-700
            "
            >
              <MapPin size={13} /> Địa điểm: {d.location || "Chưa xếp phòng"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseCard;
