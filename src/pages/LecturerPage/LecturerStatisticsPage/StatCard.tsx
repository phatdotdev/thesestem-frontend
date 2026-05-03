const StatCard = ({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number | string;
  icon: any;
}) => (
  <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-900">
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>

      <Icon size={20} className="text-gray-400 dark:text-gray-500" />
    </div>

    <h2 className="mt-3 text-2xl font-semibold text-gray-800 dark:text-white">
      {value ?? 0}
    </h2>
  </div>
);
export default StatCard;
