const AssignmentRow = ({
  title,
  time,
  room,
}: {
  title: string;
  time: string;
  room: string;
}) => (
  <div className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm transition-all duration-150 group">
    <div className="flex items-center gap-2.5">
      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 group-hover:bg-indigo-500 transition-colors" />
      <span className="text-sm text-gray-700">{title}</span>
    </div>
    <div className="flex items-center gap-1.5 text-xs text-gray-400">
      <span>{time}</span>
      <span className="text-gray-200">·</span>
      <span className="font-mono bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded text-gray-500">
        {room}
      </span>
    </div>
  </div>
);
export default AssignmentRow;
