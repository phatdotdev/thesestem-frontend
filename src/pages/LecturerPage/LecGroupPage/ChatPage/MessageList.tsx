import type { ChatMessage } from "../../../../types/message";
import DateDivider from "./DateDivider";
import MessageGroup from "./MessageGroup";
import { type MessageGroup as Group } from "../../../../types/message";

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    senderId: "u1",
    senderName: "Phát",
    content: "Mọi người nhớ họp lúc 2h chiều nha",
    createdAt: "10:12",
  },
  {
    id: "2",
    senderId: "u1",
    senderName: "Phát",
    content: "Nhớ chuẩn bị slide luôn đó",
    createdAt: "10:12",
  },
  {
    id: "3",
    senderId: "u2",
    senderName: "An",
    content: "Ok ông 👍",
    createdAt: "10:15",
  },
];

const groupMessages = (messages: ChatMessage[]): Group[] => {
  const groups: Group[] = [];

  messages.forEach((msg) => {
    const last = groups[groups.length - 1];

    if (last && last.senderId === msg.senderId) {
      last.messages.push(msg);
    } else {
      groups.push({
        senderId: msg.senderId,
        senderName: msg.senderName,
        avatar: msg.senderName[0],
        time: msg.createdAt,
        messages: [msg],
      });
    }
  });

  return groups;
};

const MessageList = () => {
  const groups = groupMessages(mockMessages);

  return (
    <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
      <DateDivider date="Hôm nay" />

      {groups.map((group, idx) => (
        <MessageGroup key={idx} group={group} />
      ))}
    </div>
  );
};

export default MessageList;
