import { useMemo, useState } from "react";
import Badge from "../../../../components/UI/Badge";
import { Calendar, Plus } from "lucide-react";
import { useGetGroupMeetingsQuery } from "../../../../services/groupApi";
import { useParams } from "react-router-dom";
import type { MeetingResponse } from "../../../../types/group";
import Button from "../../../../components/UI/Button";
import MeetingForm from "./MeetingForm";
import MeetingCard from "./MeetingCard";
import EmptyState from "../../../../components/UI/EmptyState";

type MeetingStatus = "ALL" | "UPCOMING" | "ONGOING" | "COMPLETED";

const MentorMeetingPage = () => {
  const { "group-id": id } = useParams();

  const { data: meetingsResponse, refetch } = useGetGroupMeetingsQuery(
    id || "",
  );

  const meetings: MeetingResponse[] = meetingsResponse?.data || [];

  const [filter, setFilter] = useState<MeetingStatus>("ALL");

  /** modal */
  const [openForm, setOpenForm] = useState(false);
  const [selectedMeeting, setSelectedMeeting] =
    useState<MeetingResponse | null>(null);

  /**
   * status
   */
  const getMeetingStatus = (meeting: MeetingResponse): MeetingStatus => {
    const now = new Date().getTime();
    const start = new Date(meeting.startAt).getTime();
    const end = new Date(meeting.endAt).getTime();

    if (now < start) return "UPCOMING";
    if (now >= start && now <= end) return "ONGOING";
    return "COMPLETED";
  };

  /**
   * filter
   */
  const filteredMeetings = useMemo(() => {
    if (filter === "ALL") return meetings;

    return meetings.filter((meeting) => getMeetingStatus(meeting) === filter);
  }, [filter, meetings]);

  /**
   * badge
   */
  const getStatusBadge = (meeting: MeetingResponse) => {
    const status = getMeetingStatus(meeting);

    switch (status) {
      case "UPCOMING":
        return <Badge label="Sắp diễn ra" variant="primary" size="sm" dot />;

      case "ONGOING":
        return <Badge label="Đang diễn ra" variant="success" size="sm" dot />;

      case "COMPLETED":
        return <Badge label="Đã diễn ra" variant="outline" size="sm" dot />;

      default:
        return null;
    }
  };

  /**
   * create
   */
  const handleCreate = () => {
    setSelectedMeeting(null);
    setOpenForm(true);
  };

  /**
   * edit
   */
  const handleEdit = (meeting: MeetingResponse) => {
    setSelectedMeeting(meeting);
    setOpenForm(true);
  };

  /**
   * close
   */
  const handleClose = () => {
    setOpenForm(false);
    setSelectedMeeting(null);
    refetch();
  };

  return (
    <div className="mt-6 space-y-8 rounded-3xl border border-gray-200/80 bg-white/95 p-6 text-gray-800 shadow-sm dark:border-gray-700 dark:bg-gray-900/95 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
            <Calendar size={24} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              Cuộc họp hướng dẫn
            </h1>

            <p className="text-sm text-gray-500 dark:text-gray-400">
              Quản lý và theo dõi các cuộc họp hướng dẫn sinh viên.
            </p>
          </div>
        </div>

        <Button
          label="Thêm cuộc họp"
          icon={Plus}
          variant="outline"
          size="sm"
          onClick={handleCreate}
        />
      </div>

      {/* FILTER */}
      <div className="flex flex-wrap gap-3">
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
          variant={filter === "COMPLETED" ? "primary" : "outline"}
        />
      </div>

      {/* LIST */}
      {filteredMeetings.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Không có cuộc họp nào"
          description="Lịch trình của bạn đang trống. Hãy tạo cuộc họp mới để bắt đầu."
          action={
            <Button
              label="Tạo cuộc họp"
              onClick={() => {
                {
                  setSelectedMeeting(null);
                  setOpenForm(true);
                }
              }}
              icon={Plus}
              className="bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium"
              size="sm"
            />
          }
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((meeting) => {
            return (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                onClick={handleEdit}
                getStatusBadge={getStatusBadge}
              />
            );
          })}
        </div>
      )}

      {/* FORM */}
      <MeetingForm
        open={openForm}
        onClose={handleClose}
        initialData={selectedMeeting}
      />
    </div>
  );
};

export default MentorMeetingPage;
