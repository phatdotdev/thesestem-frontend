import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
  CalendarDays,
  MessageCircleMore,
  Send,
  Sparkles,
  X,
} from "lucide-react";
import {
  useGetCurrentSemesterQuery,
  useGetSemestersQuery,
} from "../../services/semApi";
import { useAdviseSemesterMutation } from "../../services/llmApi";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const formatDate = (value?: string) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const buildSemesterSummary = (semester?: {
  name?: string;
  status?: string;
  startDate?: string;
  endDate?: string;
  year?: { name?: string };
}) => {
  if (!semester) {
    return "Hiện tại chưa có học kỳ đang hoạt động. Bạn vẫn có thể hỏi mình về quy trình quản lý học kỳ, đăng ký sinh viên, giảng viên hoặc luận văn.";
  }

  return `Học kỳ hiện tại: ${semester.name || "-"} - ${semester.year?.name || "-"}`;
};

const quickPrompts = ["Xu hướng luận văn của học kỳ này là gì?"];

const getPromptFromHistory = (
  messages: ChatMessage[],
  currentQuestion: string,
) => {
  const history = messages
    .map((message) => `${message.role}: ${message.content}`)
    .join("\n");

  return `${history}\nuser: ${currentQuestion}`;
};

// Typing indicator – 3 animated dots
const TypingIndicator = () => (
  <div className="flex justify-start">
    <div className="flex items-center gap-1 rounded-2xl bg-gray-100 px-4 py-3 dark:bg-gray-800">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-2 w-2 rounded-full bg-gray-400 dark:bg-gray-500"
          style={{
            animation: "typing-bounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.2}s`,
          }}
        />
      ))}
    </div>
  </div>
);

// Markdown renderer for assistant messages
const MarkdownMessage = ({ content }: { content: string }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      // Paragraphs
      p: ({ children }) => (
        <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
      ),
      // Headings
      h1: ({ children }) => (
        <h1 className="mb-2 text-base font-bold">{children}</h1>
      ),
      h2: ({ children }) => (
        <h2 className="mb-1.5 text-sm font-bold">{children}</h2>
      ),
      h3: ({ children }) => (
        <h3 className="mb-1 text-sm font-semibold">{children}</h3>
      ),
      // Lists
      ul: ({ children }) => (
        <ul className="mb-2 ml-4 list-disc space-y-0.5 last:mb-0">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="mb-2 ml-4 list-decimal space-y-0.5 last:mb-0">
          {children}
        </ol>
      ),
      li: ({ children }) => <li className="leading-relaxed">{children}</li>,
      // Inline code
      code: ({ inline, children }: any) =>
        inline ? (
          <code className="rounded bg-gray-200 px-1 py-0.5 font-mono text-xs dark:bg-gray-700">
            {children}
          </code>
        ) : (
          <pre className="my-2 overflow-x-auto rounded-lg bg-gray-200 p-3 font-mono text-xs dark:bg-gray-700">
            <code>{children}</code>
          </pre>
        ),
      // Bold / Italic
      strong: ({ children }) => (
        <strong className="font-semibold">{children}</strong>
      ),
      em: ({ children }) => <em className="italic">{children}</em>,
      // Blockquote
      blockquote: ({ children }) => (
        <blockquote className="my-2 border-l-2 border-blue-400 pl-3 text-gray-600 dark:text-gray-400">
          {children}
        </blockquote>
      ),
      // Table (remark-gfm)
      table: ({ children }) => (
        <div className="my-2 overflow-x-auto">
          <table className="w-full border-collapse text-xs">{children}</table>
        </div>
      ),
      th: ({ children }) => (
        <th className="border border-gray-300 bg-gray-200 px-2 py-1 text-left font-semibold dark:border-gray-600 dark:bg-gray-700">
          {children}
        </th>
      ),
      td: ({ children }) => (
        <td className="border border-gray-300 px-2 py-1 dark:border-gray-600">
          {children}
        </td>
      ),
      // Horizontal rule
      hr: () => <hr className="my-2 border-gray-300 dark:border-gray-600" />,
      // Links
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline hover:text-blue-700"
        >
          {children}
        </a>
      ),
    }}
  >
    {content}
  </ReactMarkdown>
);

const ManagerPopChat = () => {
  const { data: currentSemesterResponse } = useGetCurrentSemesterQuery();
  const { data: semestersResponse } = useGetSemestersQuery();
  const [adviseSemester, { isLoading: isAdvising }] =
    useAdviseSemesterMutation();

  const semester = currentSemesterResponse?.data;
  const semesters = semestersResponse?.data ?? [];

  const semesterSummary = useMemo(
    () => buildSemesterSummary(semester),
    [semester],
  );

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      role: "assistant",
      content: semesterSummary,
    },
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, isAdvising]);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length > 1) return prev;
      return [
        {
          id: 1,
          role: "assistant",
          content: semesterSummary,
        },
      ];
    });
  }, [semesterSummary]);

  useEffect(() => {
    if (selectedSemesterId) return;
    if (!semester?.id) return;
    setSelectedSemesterId(semester.id);
  }, [semester?.id, selectedSemesterId]);

  const handleSend = async () => {
    const content = input.trim();
    if (!content || !selectedSemesterId || isAdvising) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content,
    };

    const snapshot = [...messages, userMessage];
    const userPrompt = getPromptFromHistory(messages, content);

    setMessages(snapshot);
    setInput("");

    try {
      const response = await adviseSemester({
        semesterId: selectedSemesterId,
        userPrompt,
      }).unwrap();

      const assistantMessage: ChatMessage = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          response?.data ||
          response?.message ||
          "Mình chưa nhận được nội dung tư vấn từ hệ thống.",
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Advise semester failed", error);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: "Không thể lấy tư vấn lúc này. Vui lòng thử lại sau.",
        },
      ]);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <>
      {/* Keyframe for typing dots */}
      <style>{`
        @keyframes typing-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-105"
        aria-label="Mở tư vấn học kỳ"
      >
        <MessageCircleMore size={22} />
      </button>

      {open && (
        <div className="fixed bottom-6 right-6 z-50 flex h-[640px] max-h-[calc(100dvh-1.5rem)] w-[380px] max-w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl dark:border-gray-700 dark:bg-gray-900">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-4 text-white dark:border-gray-700">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 rounded-2xl bg-white/15 p-2">
                <Sparkles size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold">Tư vấn học kỳ</p>
                <p className="text-xs text-white/85">
                  Hỗ trợ quy trình vận hành cho quản lý cơ quan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl bg-white/10 p-2 transition hover:bg-white/20"
              aria-label="Đóng tư vấn học kỳ"
            >
              <X size={16} />
            </button>
          </div>

          {/* Semester info + selector */}
          <div className="border-b border-gray-200 px-4 py-3 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <CalendarDays size={14} />
              <span className="truncate">{semesterSummary}</span>
            </div>

            <div className="mt-2">
              <select
                value={selectedSemesterId}
                onChange={(e) => setSelectedSemesterId(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-2.5 py-2 text-xs text-gray-700 outline-none focus:border-blue-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
              >
                {!selectedSemesterId && (
                  <option value="">Chọn học kỳ để tư vấn</option>
                )}
                {semesters.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} - {s.year?.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Message list */}
          <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                    message.role === "user"
                      ? "bg-blue-600 text-white whitespace-pre-wrap"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
                  }`}
                >
                  {message.role === "assistant" ? (
                    <MarkdownMessage content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator shown while waiting for response */}
            {isAdvising && <TypingIndicator />}

            <div ref={bottomRef} />
          </div>

          {/* Quick prompts */}
          <div className="flex flex-wrap gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => handleQuickPrompt(prompt)}
                disabled={isAdvising}
                className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs text-gray-600 transition hover:border-blue-300 hover:bg-blue-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:border-blue-500 dark:hover:bg-gray-700"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-gray-200 px-4 py-3 dark:border-gray-700">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
              disabled={isAdvising}
              placeholder="Hỏi về học kỳ, lịch, luận văn..."
              className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-400 disabled:opacity-60 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || !selectedSemesterId || isAdvising}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Gửi câu hỏi"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ManagerPopChat;
