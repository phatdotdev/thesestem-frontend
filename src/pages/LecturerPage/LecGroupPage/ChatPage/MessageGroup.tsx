import { type MessageGroup as Group } from "../../../../types/message";

interface Props {
  group: Group;
}

const MessageGroup = ({ group }: Props) => {
  return (
    <div className="flex gap-3">
      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
        {group.avatar}
      </div>

      {/* Messages */}
      <div className="flex-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold">{group.senderName}</span>
          <span className="text-xs text-gray-500">{group.time}</span>
        </div>

        <div className="mt-1 space-y-1">
          {group.messages.map((msg) => (
            <p key={msg.id} className="text-sm leading-6">
              {msg.content}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MessageGroup;
