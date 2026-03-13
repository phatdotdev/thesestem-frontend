import { useRef, useState } from "react";
import { LuBold, LuItalic, LuPaperclip, LuSmile, LuSend } from "react-icons/lu";

interface MessageComposerProps {
  onSend?: (content: string) => void;
}

const MessageComposer = ({ onSend }: MessageComposerProps) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleSend = () => {
    if (!message.trim()) return;
    onSend?.(message.trim());
    setMessage("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  return (
    <div className="border-t dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-2 text-gray-600 dark:text-gray-300">
        <button className="hover:text-indigo-600">
          <LuBold size={16} />
        </button>
        <button className="hover:text-indigo-600">
          <LuItalic size={16} />
        </button>
        <button className="hover:text-indigo-600">
          <LuPaperclip size={16} />
        </button>
        <button className="hover:text-indigo-600">
          <LuSmile size={16} />
        </button>
      </div>

      {/* Input */}
      <div className="relative bg-gray-100 dark:bg-gray-800 rounded-xl px-4 py-3">
        <textarea
          ref={textareaRef}
          rows={1}
          value={message}
          placeholder="Nhập tin nhắn mới"
          onChange={(e) => {
            setMessage(e.target.value);
            autoResize();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          className="
            w-full resize-none bg-transparent outline-none
            text-sm leading-6 pr-10
          "
        />

        {/* Send */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`
            absolute bottom-3 right-3 transition
            ${
              message.trim()
                ? "text-indigo-600 hover:scale-110"
                : "text-gray-400 cursor-not-allowed"
            }
          `}
        >
          <LuSend size={18} />
        </button>
      </div>
    </div>
  );
};

export default MessageComposer;
