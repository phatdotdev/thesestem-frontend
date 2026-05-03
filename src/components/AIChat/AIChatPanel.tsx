import { useEffect, useRef, useState } from "react";
import { Send, Bot, FileText, X, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { FileAssetResponse } from "../../types/thesis";
import { useAnalyzeFileMutation } from "../../services/llmApi";

type ChatMessage = {
  id: number;
  role: "assistant" | "user";
  content: string;
};

const initialMessages: ChatMessage[] = [
  {
    id: 1,
    role: "assistant",
    content:
      "Xin chào, tôi có thể hỗ trợ bạn phân tích luận văn hoặc trả lời câu hỏi về nội dung tài liệu.",
  },
];

type AIChatPanelProps = {
  file?: FileAssetResponse | null;
  open?: boolean;
  onClose?: () => void;
};

const quickPrompts = [
  "Tóm tắt tài liệu này trong 5 ý chính",
  "Liệt kê mục tiêu, phương pháp và kết quả chính",
  "Nêu các điểm mạnh và điểm cần cải thiện",
  "Đề xuất 5 câu hỏi phản biện cho luận văn này",
];

export default function AIChatRightPanelLayout({
  file,
  open = false,
  onClose,
}: AIChatPanelProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [analyzeFile, { isLoading }] = useAnalyzeFileMutation();
  const abortControllerRef = useRef<AbortController | null>(null);
  const pendingPromiseRef = useRef<Promise<any> | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileName = file?.name || "Chưa có file";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!open) return null;

  const sendPrompt = async (prompt: string) => {
    const trimmed = prompt.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    // Show newest question immediately for better Q&A flow.
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    if (!file?.id) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            "Chưa có file để phân tích. Vui lòng chọn hoặc nộp file trước.",
        },
      ]);
      return;
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const promise = analyzeFile({
        fileId: file.id,
        userPrompt: trimmed,
      }).unwrap();
      pendingPromiseRef.current = promise;

      const response = await promise;

      // Only process if request wasn't cancelled
      if (abortControllerRef.current === controller) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 2,
            role: "assistant",
            content:
              response?.data ||
              response?.message ||
              "Tôi chưa nhận được nội dung trả lời.",
          },
        ]);
      }
    } catch (error: any) {
      // Only show error if request wasn't cancelled by user
      if (
        abortControllerRef.current === controller &&
        error?.name !== "AbortError"
      ) {
        console.error("Analyze file failed", error);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 3,
            role: "assistant",
            content:
              "Không thể phân tích file lúc này. Vui lòng thử lại sau vài giây.",
          },
        ]);
      }
    } finally {
      // Clean up reference
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
      pendingPromiseRef.current = null;
    }
  };

  const handleSend = async () => {
    await sendPrompt(input);
  };

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/30 backdrop-blur-[1px] z-40"
      />

      <aside className="fixed right-0 top-0 h-screen w-[600px] max-w-[92vw] border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex flex-col z-50 shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <Bot size={18} className="text-gray-600 dark:text-gray-300" />
            </div>

            <div className="min-w-0">
              <p className="font-semibold text-gray-800 dark:text-gray-100">
                AI Assistant
              </p>
              <p className="text-xs text-gray-500 truncate">
                Phân tích luận văn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            aria-label="Đóng AI chat"
          >
            <X size={16} className="mx-auto" />
          </button>
        </div>

        {/* Context Info */}
        <div className="p-3 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <FileText size={14} />
            <span className="truncate">Đang phân tích: {fileName}</span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-auto p-4 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed
                  ${
                    m.role === "user"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  }
                `}
              >
                {m.role === "assistant" ? (
                  <div className="space-y-2 [&_h1]:text-base [&_h1]:font-semibold [&_h2]:text-sm [&_h2]:font-semibold [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_code]:rounded [&_code]:bg-black/10 dark:[&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-900 [&_pre]:text-gray-100 [&_pre]:p-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-700 [&_th]:px-2 [&_th]:py-1 [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-700 [&_td]:px-2 [&_td]:py-1">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {m.content}
                    </ReactMarkdown>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{m.content}</p>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] px-4 py-2 rounded-2xl text-sm leading-relaxed bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                Đang phân tích file...
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendPrompt(prompt)}
                disabled={isLoading}
                className="text-xs px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !isLoading) handleSend();
              }}
              placeholder="Hỏi AI về luận văn..."
              disabled={isLoading}
              className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 outline-none disabled:opacity-60"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={() => {
                  if (abortControllerRef.current) {
                    abortControllerRef.current.abort();
                    abortControllerRef.current = null;
                  }
                }}
                className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 transition flex items-center gap-2"
              >
                <Loader2 size={16} className="animate-spin" />
                <span className="text-xs font-medium">Hủy</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-2 rounded-xl bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                <Send size={16} />
              </button>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
