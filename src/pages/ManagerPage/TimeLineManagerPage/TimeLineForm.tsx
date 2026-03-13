
const TimelineForm = ({ data, onClose }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">
        {data ? "Cập nhật mốc thời gian" : "Thêm mốc thời gian"}
      </h3>

      <input
        type="text"
        placeholder="Tên mốc"
        className="w-full rounded border p-2"
      />

      <div className="grid grid-cols-2 gap-4">
        <input type="date" className="rounded border p-2" />
        <input type="date" className="rounded border p-2" />
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" />
        Kích hoạt mốc thời gian
      </label>

      <div className="flex justify-end gap-2">
        <button className="rounded px-4 py-2 text-sm">Hủy</button>
        <button className="rounded bg-blue-600 px-4 py-2 text-sm text-white">
          Lưu
        </button>
      </div>
    </div>
  );
};
