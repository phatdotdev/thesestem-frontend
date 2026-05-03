import { CalendarClock, MapPin, Video, ExternalLink } from "lucide-react";
import type { MeetingResponse } from "../../../../types/group";
import {
  formatDateRangeVN,
  formatDateTimeVN,
} from "../../../../utils/formatters";

interface Props {
  meeting: MeetingResponse;
  onClick: (meeting: MeetingResponse) => void;
  getStatusBadge: (meeting: MeetingResponse) => React.ReactNode;
}

const MeetingCard = ({ meeting, onClick, getStatusBadge }: Props) => {
  const isOngoing =
    meeting.startAt <= new Date().toISOString() &&
    meeting.endAt >= new Date().toISOString();
  const hasUrl = !!meeting.url;

  return (
    <div
      onClick={() => onClick(meeting)}
      className="group relative cursor-pointer bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md dark:hover:shadow-blue-950/30 transition-all duration-150"
    >
      {/* top accent — xanh khi ongoing, xám khi không */}
      <div
        className={`h-1 w-full transition-colors ${isOngoing ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`}
      />

      <div className="p-5">
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
            {meeting.title}
          </h3>
          {getStatusBadge(meeting)}
        </div>

        {/* DESCRIPTION */}
        {meeting.description && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {meeting.description}
          </p>
        )}

        {/* META */}
        <div className="mt-4 space-y-2">
          {/* Time */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <CalendarClock
              size={13}
              className="shrink-0 text-gray-400 dark:text-gray-500"
            />
            <span>
              {formatDateRangeVN(meeting.startAt, meeting.endAt) ||
                formatDateTimeVN(meeting.startAt)}
            </span>
          </div>

          {/* Location type */}
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            {hasUrl ? (
              <>
                <Video size={13} className="shrink-0 text-blue-400" />
                <span className="text-blue-500 dark:text-blue-400 font-medium">
                  Họp online
                </span>
              </>
            ) : (
              <>
                <MapPin size={13} className="shrink-0 text-gray-400" />
                <span>Họp trực tiếp</span>
              </>
            )}
          </div>
        </div>

        {/* JOIN BUTTON — hiện khi có URL, nổi bật hơn khi ONGOING */}
        {hasUrl && (
          <div className="mt-4 pt-3.5 border-t border-gray-100 dark:border-gray-800">
            <a
              href={meeting.url!}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className={`flex items-center justify-center gap-2 w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150
                ${
                  isOngoing
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200 dark:shadow-blue-950/50 active:scale-[0.98]"
                    : "bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-700"
                }`}
            >
              <Video size={14} />
              {isOngoing ? "Tham gia cuộc họp" : "Xem link họp"}
              <ExternalLink size={12} className="opacity-60" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MeetingCard;
