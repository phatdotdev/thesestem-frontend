const OrgTopbar = () => {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-6">
      <div>
        <p className="text-sm text-gray-500">Học kỳ đang hoạt động</p>
        <p className="font-semibold text-blue-600">HK1 · Năm học 2025–2026</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Quản trị viên
        </span>
        <div className="h-8 w-8 rounded-full bg-blue-500 text-white flex items-center justify-center">
          A
        </div>
      </div>
    </header>
  );
};

export default OrgTopbar;
