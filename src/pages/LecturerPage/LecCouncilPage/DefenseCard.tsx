import {
  CalendarCheck,
  Clock,
  MapPin,
  ArrowRight,
  User,
  GraduationCap,
} from "lucide-react";
import type { DefenseResponse } from "../../../types/defense";

type Props = {
  d: DefenseResponse;
  onClick?: (d: DefenseResponse) => void;
};

const DefenseCard = ({ d, onClick }: Props) => {
  const student = d?.thesis?.student;
  const mentor = d?.thesis?.mentor;
  const hasSchedule = !!d.defenseTime;

  return (
    <div
      onClick={() => onClick?.(d)}
      className="group cursor-pointer bg-white border border-gray-200 rounded-2xl overflow-hidden 
      hover:shadow-lg hover:border-gray-300 transition-all duration-200 active:scale-[0.98]"
    >
      <div className="p-4 space-y-4 relative">
        {/* ARROW */}
        <ArrowRight
          size={16}
          className="absolute top-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
        />

        {/* TITLE */}
        <div className="pr-6">
          <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition">
            {d.thesis?.title || "Chưa có tên đề tài"}
          </h3>

          {d.thesis?.titleEn && (
            <p className="text-[11px] text-gray-400 italic truncate">
              {d.thesis.titleEn}
            </p>
          )}
        </div>

        {/* INFO GRID */}
        <div className="grid grid-cols-4 gap-3 text-sm">
          {/* STUDENT */}
          <div className="flex items-start gap-2">
            <User size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-400">Sinh viên</p>
              <p className="font-medium text-gray-800 truncate">
                {student?.fullName || "Chưa có"}
              </p>
              {student?.studentCode && (
                <p className="text-[11px] text-gray-400">
                  {student.studentCode}
                </p>
              )}
            </div>
          </div>

          {/* MENTOR */}
          <div className="flex items-start gap-2">
            <GraduationCap size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-400">GV hướng dẫn</p>
              <p className="font-medium text-gray-800 truncate">
                {mentor?.fullName || "Chưa có"}
              </p>
            </div>
          </div>

          {/* TIME */}
          <div className="flex items-start gap-2">
            <Clock size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-400">Thời gian</p>
              <p className="font-medium text-gray-800">
                {hasSchedule
                  ? new Date(d.defenseTime!).toLocaleString("vi-VN")
                  : "Chưa có"}
              </p>
            </div>
          </div>

          {/* LOCATION */}
          <div className="flex items-start gap-2">
            <MapPin size={14} className="text-gray-400 mt-0.5" />
            <div>
              <p className="text-[11px] text-gray-400">Địa điểm</p>
              <p className="font-medium text-gray-800 truncate">
                {d.location || "Chưa có"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefenseCard;
