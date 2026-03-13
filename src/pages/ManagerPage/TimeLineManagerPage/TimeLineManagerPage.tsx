import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

const TimelineManager = () => {
  const timelines = [
    {
      id: 1,
      name: "Đăng ký GVHD & chọn đề tài",
      startDate: "2026-03-01",
      endDate: "2026-03-15",
      enabled: true,
    },
    {
      id: 2,
      name: "Thực hiện luận văn",
      startDate: "2026-03-16",
      endDate: "2026-05-30",
      enabled: true,
    },
  ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Mốc thời gian luận văn</h2>
        <button
          className="
          flex items-center gap-1
          rounded-md bg-blue-600 px-3 py-2
          text-sm text-white hover:bg-blue-700
        "
        >
          <MdAdd size={18} />
          Thêm mốc
        </button>
      </div>

      {/* Timeline list */}
      {timelines.map((item, index) => (
        <div
          key={item.id}
          className="rounded-lg border bg-white p-4 shadow-sm dark:bg-gray-900"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="font-medium">
                {index + 1}. {item.name}
              </p>
              <p className="text-sm text-gray-500">
                {item.startDate} → {item.endDate}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button className="text-blue-600 hover:underline">
                <MdEdit size={18} />
              </button>
              <button className="text-red-600 hover:underline">
                <MdDelete size={18} />
              </button>
            </div>
          </div>

          <div className="mt-2">
            <span
              className={`inline-block rounded px-2 py-1 text-xs
                ${
                  item.enabled
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {item.enabled ? "Đang mở" : "Chưa mở"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TimelineManager;
