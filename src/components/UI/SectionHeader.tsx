const SectionHeader = ({
  icon,
  title,
  count,
  color = "indigo",
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
  color?: "indigo" | "teal";
}) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-2">
      <span
        className={`text-base ${
          color === "teal" ? "text-teal-500" : "text-indigo-500"
        }`}
      >
        {icon}
      </span>
      <h2 className="text-sm font-semibold text-gray-700">{title}</h2>
    </div>
    {count !== undefined && (
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          color === "teal"
            ? "bg-teal-50 text-teal-600"
            : "bg-indigo-50 text-indigo-600"
        }`}
      >
        {count}
      </span>
    )}
  </div>
);

export default SectionHeader;
