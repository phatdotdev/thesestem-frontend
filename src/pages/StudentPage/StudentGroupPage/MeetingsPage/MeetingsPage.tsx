import { CalendarClock, Video, MapPin, ExternalLink } from "lucide-react";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Badge from "../../../../components/UI/Badge";
import EmptyState from "../../../../components/UI/EmptyState";
import { useGetGroupMeetingsQuery } from "../../../../services/groupApi";
import type { MeetingResponse } from "../../../../types/group";
import {
  formatDateRangeVN,
  formatDateTimeVN,
} from "../../../../utils/formatters";

type MeetingStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED";

const MeetingsPage = () => {
  const { ["group-id"]: id } = useParams();
  const { data: meetingsResponse } = useGetGroupMeetingsQuery(id || "");
  const [filter, setFilter] = useState<MeetingStatus>("ALL");

  const meetings: MeetingResponse[] = meetingsResponse?.data || [];

  const getMeetingStatus = (meeting: MeetingResponse): MeetingStatus => {
    const now = Date.now();
    const start = new Date(meeting.startAt).getTime();
    const end = new Date(meeting.endAt).getTime();

    if (now < start) return "UPCOMING";
    if (now <= end) return "ONGOING";
    return "COMPLETED";
  };

  const filteredMeetings = useMemo(() => {
    if (filter === "ALL") return meetings;

    return meetings.filter((meeting) => getMeetingStatus(meeting) === filter);
  }, [filter, meetings]);

  return (
    <div className="mt-6 space-y-8 rounded-3xl border border-gray-200/80 bg-white/95 p-6 text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <CalendarClock size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Lịch họp nhóm
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Theo dõi các cuộc họp do giảng viên thiết lập cho nhóm.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge
            label="Tất cả"
            onClick={() => setFilter("ALL")}
            variant={filter === "ALL" ? "primary" : "outline"}
          />
          <Badge
            label="Sắp diễn ra"
            onClick={() => setFilter("UPCOMING")}
            variant={filter === "UPCOMING" ? "primary" : "outline"}
          />
          <Badge
            label="Đang diễn ra"
            onClick={() => setFilter("ONGOING")}
            variant={filter === "ONGOING" ? "success" : "outline"}
          />
          <Badge
            label="Đã diễn ra"
            onClick={() => setFilter("COMPLETED")}
            variant={filter === "COMPLETED" ? "outline" : "ghost"}
          />
        </div>
      </div>

      {/* MEETING LIST */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          icon={CalendarClock}
          title="Không có cuộc họp nào"
          description="Giảng viên chưa thêm lịch họp cho nhóm ở thời điểm hiện tại."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredMeetings.map((meeting) => {
            const meetingStatus = getMeetingStatus(meeting);
            const hasUrl = !!meeting.url;

            return (
              <div
                key={meeting.id}
                className="rounded-2xl border border-gray-200/80 dark:border-gray-700 bg-white/95 dark:bg-gray-900/95 p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="line-clamp-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                    {meeting.title}
                  </h3>

                  {meetingStatus === "UPCOMING" && (
                    <Badge
                      label="Sắp diễn ra"
                      variant="primary"
                      size="sm"
                      dot
                    />
                  )}
                  {meetingStatus === "ONGOING" && (
                    <Badge
                      label="Đang diễn ra"
                      variant="success"
                      size="sm"
                      dot
                    />
                  )}
                  {meetingStatus === "COMPLETED" && (
                    <Badge label="Đã diễn ra" variant="outline" size="sm" dot />
                  )}
                </div>

                {meeting.description && (
                  <p className="mt-1 line-clamp-2 text-sm text-gray-500 dark:text-gray-400">
                    {meeting.description}
                  </p>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <CalendarClock className="h-4 w-4" />
                    {formatDateRangeVN(meeting.startAt, meeting.endAt) ||
                      formatDateTimeVN(meeting.startAt)}
                  </div>

                  {hasUrl ? (
                    <a
                      href={meeting.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg bg-green-600 dark:bg-green-500 px-3 py-1.5 text-sm text-white hover:bg-green-700 dark:hover:bg-green-600"
                    >
                      <Video className="h-4 w-4" />
                      Vào phòng họp
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-gray-700 dark:text-gray-300">
                      <MapPin className="h-4 w-4" />
                      Họp trực tiếp
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MeetingsPage;
