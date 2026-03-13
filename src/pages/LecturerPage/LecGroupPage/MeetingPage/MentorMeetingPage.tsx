import { useMemo, useState } from "react";
import { LuCalendarClock, LuMapPin, LuVideo } from "react-icons/lu";
import Badge from "../../../../components/UI/Badge";
import { LucideCheckCircle2, LucideXCircle } from "lucide-react";

type MeetingStatus = "ALL" | "UPCOMING" | "COMPLETED" | "CANCELLED";

interface Meeting {
  id: string;
  title: string;
  description: string;
  datetime: string;
  location?: string;
  isOnline: boolean;
  status: MeetingStatus;
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Họp tiến độ lần 1",
    description: "Báo cáo tiến độ và thảo luận khó khăn gặp phải.",
    datetime: "2026-03-10T14:00:00",
    isOnline: true,
    status: "UPCOMING",
  },
  {
    id: "2",
    title: "Review chương 1",
    description: "Giảng viên góp ý chương tổng quan.",
    datetime: "2026-02-01T09:00:00",
    location: "Phòng A204",
    isOnline: false,
    status: "COMPLETED",
  },
  {
    id: "3",
    title: "Họp khẩn",
    description: "Giải quyết vấn đề kỹ thuật.",
    datetime: "2026-02-20T16:30:00",
    isOnline: true,
    status: "CANCELLED",
  },
];

const MentorMeetingPage = () => {
  const [filter, setFilter] = useState<MeetingStatus>("ALL");

  const filteredMeetings = useMemo(() => {
    if (filter === "ALL") return mockMeetings;
    return mockMeetings.filter((m) => m.status === filter);
  }, [filter]);

  const getStatusBadge = (status: MeetingStatus) => {
    switch (status) {
      case "UPCOMING":
        return <Badge label="Sắp diễn ra" variant="primary" size="sm" dot />;
      case "COMPLETED":
        return <Badge label="Đã kết thúc" variant="success" size="sm" dot />;
      case "CANCELLED":
        return <Badge label="Đã hủy" variant="danger" size="sm" dot />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl p-8 space-y-8">
      {/* HEADER */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
            Danh sách cuộc họp
          </h1>
          <p className="text-gray-500 mt-2">
            Quản lý và theo dõi các buổi họp với sinh viên.
          </p>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600">
          <LuCalendarClock size={22} />
        </div>
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
          label="Đã kết thúc"
          onClick={() => setFilter("COMPLETED")}
          variant={filter === "COMPLETED" ? "success" : "outline"}
        />
        <Badge
          label="Đã hủy"
          onClick={() => setFilter("CANCELLED")}
          variant={filter === "CANCELLED" ? "danger" : "outline"}
        />
      </div>

      {/* LIST */}
      {filteredMeetings.length === 0 ? (
        <div className="text-center py-16 border border-dashed rounded-3xl bg-gray-50">
          <LucideCheckCircle2
            className="mx-auto mb-4 text-gray-400"
            size={36}
          />
          <p className="font-semibold text-gray-600 text-lg">
            Không có cuộc họp nào
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMeetings.map((meeting) => (
            <div
              key={meeting.id}
              className="group bg-white border border-gray-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-800 group-hover:text-blue-600 transition">
                  {meeting.title}
                </h3>
                {getStatusBadge(meeting.status)}
              </div>

              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {meeting.description}
              </p>

              <div className="mt-5 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <LuCalendarClock size={16} />
                  <span>
                    {new Date(meeting.datetime).toLocaleString("vi-VN")}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {meeting.isOnline ? (
                    <>
                      <LuVideo size={16} />
                      <span>Họp Online</span>
                    </>
                  ) : (
                    <>
                      <LuMapPin size={16} />
                      <span>{meeting.location}</span>
                    </>
                  )}
                </div>
              </div>

              {meeting.status === "UPCOMING" && (
                <div className="mt-6 flex gap-3">
                  <button className="flex-1 px-4 py-2 text-sm rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition">
                    Tham gia
                  </button>
                  <button className="flex-1 px-4 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-100 transition">
                    Chỉnh sửa
                  </button>
                </div>
              )}

              {meeting.status === "CANCELLED" && (
                <div className="mt-6 flex items-center gap-2 text-sm text-red-500">
                  <LucideXCircle size={16} />
                  <span>Cuộc họp đã bị hủy</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MentorMeetingPage;
