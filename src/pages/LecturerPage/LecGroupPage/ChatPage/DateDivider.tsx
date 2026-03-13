interface Props {
  date: string;
}

const DateDivider = ({ date }: Props) => {
  return (
    <div className="flex items-center gap-4 my-4">
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
      <span className="text-xs text-gray-500">{date}</span>
      <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
    </div>
  );
};

export default DateDivider;
