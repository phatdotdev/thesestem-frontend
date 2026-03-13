const SectionCard = ({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) => {
  return (
    <section className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-6 space-y-6 transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </div>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
};
export default SectionCard;
