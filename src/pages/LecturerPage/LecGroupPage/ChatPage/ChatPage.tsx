import { useState } from "react";
import { Search, Send, MoreVertical, User } from "lucide-react";

interface Message {
  id: string;
  sender: "mentor" | "student";
  content: string;
  time: string;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  messages: Message[];
}

const mockConversations: Conversation[] = [
  {
    id: "1",
    name: "Nguyễn Văn A",
    lastMessage: "Em đã cập nhật chương 2 rồi ạ.",
    messages: [
      {
        id: "1",
        sender: "student",
        content: "Thầy ơi em có vài thắc mắc về phần BPMN.",
        time: "09:10",
      },
      {
        id: "2",
        sender: "mentor",
        content: "Em gửi cụ thể vấn đề cho thầy xem nhé.",
        time: "09:12",
      },
      {
        id: "3",
        sender: "student",
        content: "Em đã cập nhật chương 2 rồi ạ.",
        time: "09:30",
      },
    ],
  },
  {
    id: "2",
    name: "Nhóm AI Thesis",
    lastMessage: "Deadline tuần này là thứ 6 nhé.",
    messages: [
      {
        id: "1",
        sender: "mentor",
        content: "Deadline tuần này là thứ 6 nhé.",
        time: "08:00",
      },
    ],
  },
];

const MentorChatPage = () => {
  const [selectedId, setSelectedId] = useState("1");
  const [newMessage, setNewMessage] = useState("");

  const selectedConversation = mockConversations.find(
    (c) => c.id === selectedId,
  );

  const handleSend = () => {
    if (!newMessage.trim()) return;
    alert("Mock gửi tin nhắn: " + newMessage);
    setNewMessage("");
  };

  return (
    <div className="bg-white border border-gray-200 shadow rounded-2xl h-[72vh] flex overflow-hidden">
      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        <>
          {/* MESSAGES */}
          <div className="flex-1 p-4 max-h-140 overflow-y-auto space-y-4 bg-gray-50">
            {selectedConversation?.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${
                  msg.sender === "mentor" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl text-sm ${
                    msg.sender === "mentor"
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white border rounded-bl-none"
                  }`}
                >
                  <p>{msg.content}</p>
                  <p className="text-[10px] mt-1 opacity-70 text-right">
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-4 border-t flex items-center gap-3">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 border rounded-full px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transition"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </>
      </div>
    </div>
  );
};

export default MentorChatPage;
