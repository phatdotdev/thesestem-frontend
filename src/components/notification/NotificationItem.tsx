interface Props {
  title: string;

  content: string;

  time: string;
}

const NotificationItem = ({ title, content, time }: Props) => {
  return (
    <div className="p-3 border-b hover:bg-gray-50 cursor-pointer">
      <div className="font-semibold text-sm">{title}</div>

      <div className="text-sm text-gray-600">{content}</div>

      <div className="text-xs text-gray-400">
        {new Date(time).toLocaleString()}
      </div>
    </div>
  );
};

export default NotificationItem;
