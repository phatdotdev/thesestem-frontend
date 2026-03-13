import { CalendarClock, Video, MapPin, User } from "lucide-react";

const meetings = [
  {
    id: 1,
    title: "Lập trình Java",
    lecturer: "ThS. Nguyễn Văn A",
    date: "2026-04-15",
    start: "08:00",
    end: "09:30",
    type: "online",
    link: "https://meet.google.com/abc-xyz",
  },
  {
    id: 2,
    title: "Công nghệ phần mềm",
    lecturer: "ThS. Trần Thị B",
    date: "2026-04-15",
    start: "13:30",
    end: "15:00",
    type: "offline",
    room: "Phòng B204",
  },
];

const MeetingsPage = () => {
  return (
    <div className="space-y-6 mt-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-semibold">
          <CalendarClock className="h-5 w-5 text-green-600" />
          Lịch họp
        </h1>

        <button className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-100">
          Hôm nay
        </button>
      </div>

      {/* MEETING LIST */}
      <div className="space-y-4">
        {meetings.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border bg-white p-4 shadow-sm hover:shadow-md transition"
          >
            {/* TIME */}
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-green-600">
                ⏰ {m.start} – {m.end}
              </span>
              <span className="text-xs text-gray-500">{m.date}</span>
            </div>

            {/* TITLE */}
            <h3 className="mt-1 text-lg font-semibold">{m.title}</h3>

            {/* LECTURER */}
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {m.lecturer}
            </p>

            {/* LOCATION */}
            <div className="mt-3 flex items-center justify-between">
              {m.type === "online" ? (
                <p className="flex items-center gap-1 text-sm text-blue-600">
                  <Video className="h-4 w-4" />
                  Online (Google Meet)
                </p>
              ) : (
                <p className="flex items-center gap-1 text-sm text-gray-700">
                  <MapPin className="h-4 w-4" />
                  {m.room}
                </p>
              )}

              {m.type === "online" && (
                <a
                  href={m.link}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-lg bg-green-600 px-3 py-1.5 text-sm text-white hover:bg-green-700"
                >
                  Vào phòng họp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MeetingsPage;
