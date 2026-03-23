import { Send, Users } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  sender: string;
  content: string;
  isMe: boolean;
  time: string;
}

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "Minh",
    content: "Ê deadline bài tập tuần mấy vậy?",
    isMe: false,
    time: "09:10",
  },
  {
    id: 2,
    sender: "Mình",
    content: "Tuần sau nha, thầy nói rồi á",
    isMe: true,
    time: "09:11",
  },
  {
    id: 3,
    sender: "Lan",
    content: "Có cần nộp PDF không mọi người?",
    isMe: false,
    time: "09:12",
  },
];

const ChatGroupPage = () => {
  const [messages, setMessages] = useState(initialMessages);
  const [text, setText] = useState("");

  const sendMessage = () => {
    if (!text.trim()) return;

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        sender: "Mình",
        content: text,
        isMe: true,
        time: new Date().toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ]);

    setText("");
  };

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col rounded-xl border dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* HEADER */}
      <div className="flex items-center justify-between border-b dark:border-gray-700 px-4 py-3">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
          <div>
            <h2 className="font-semibold dark:text-gray-100">Lập trình Java</h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nhóm 01 · 18 thành viên
            </p>
          </div>
        </div>
        <button className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
          ⋮
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.isMe ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-4 py-2 text-sm shadow
                ${
                  m.isMe
                    ? "bg-green-600 dark:bg-green-500 text-white rounded-br-none"
                    : "bg-white dark:bg-gray-900 dark:text-gray-100 rounded-bl-none"
                }`}
            >
              {!m.isMe && (
                <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-300">
                  {m.sender}
                </p>
              )}
              <p>{m.content}</p>
              <p className="mt-1 text-right text-[10px] opacity-70">{m.time}</p>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="flex items-center gap-2 border-t dark:border-gray-700 px-4 py-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Nhập tin nhắn..."
          className="flex-1 rounded-lg border dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        />
        <button
          onClick={sendMessage}
          className="rounded-lg bg-green-600 dark:bg-green-500 p-2 text-white hover:bg-green-700 dark:hover:bg-green-600"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default ChatGroupPage;
