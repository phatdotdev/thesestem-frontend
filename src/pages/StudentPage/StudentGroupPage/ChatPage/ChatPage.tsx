import { MessageCircleMore, Send, Users, Wifi, WifiOff } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetGroupByIdQuery } from "../../../../services/groupApi";
import { useGetUserAccountQuery } from "../../../../services/userApi";
import {
  connectChatWS,
  disconnectChatWS,
  sendChatMessage,
} from "../../../../websocket/chatWS";
import { useGetGroupMessagesQuery } from "../../../../services/communicationApi";

type ChatMessageItem = {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
  groupId?: string;
  optimistic?: boolean;
};

const isSameIncomingMessage = (
  message: ChatMessageItem,
  incoming: ChatMessageItem,
) => {
  if (message.id === incoming.id) {
    return true;
  }

  if (
    message.senderId !== incoming.senderId ||
    message.content !== incoming.content
  ) {
    return false;
  }

  const messageAt = toDate(message.createdAt).getTime();
  const incomingAt = toDate(incoming.createdAt).getTime();

  if (Number.isNaN(messageAt) || Number.isNaN(incomingAt)) {
    return message.createdAt === incoming.createdAt;
  }

  return Math.abs(messageAt - incomingAt) <= 1000;
};

const normalizeDateString = (value: string) => {
  return value.replace(/(\.\d{3})\d+/, "$1").trim();
};

const toDate = (value: string) => {
  return new Date(normalizeDateString(value));
};

const formatTime = (isoOrDate: string) => {
  const date = toDate(isoOrDate);
  if (Number.isNaN(date.getTime())) {
    return new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const isHttpUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const renderMessageContent = (content: string, isMe: boolean) => {
  const parts = content.split(/(https?:\/\/[^\s]+)/g);

  return parts.map((part, index) => {
    if (!isHttpUrl(part)) {
      return <span key={`text-${index}`}>{part}</span>;
    }

    return (
      <a
        key={`link-${index}`}
        href={part}
        target="_blank"
        rel="noopener noreferrer"
        className={`break-all underline ${
          isMe
            ? "text-green-100 hover:text-white"
            : "text-blue-600 hover:text-blue-700"
        }`}
      >
        {part}
      </a>
    );
  });
};

const getInitials = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "TV";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
};

const asRecord = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return null;
};

const getString = (
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined => {
  for (const key of keys) {
    const value = obj[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
};

const getArray = (
  obj: Record<string, unknown>,
  keys: string[],
): unknown[] | null => {
  for (const key of keys) {
    const value = obj[key];
    if (Array.isArray(value)) {
      return value;
    }
  }

  return null;
};

const normalizeIncomingMessage = (payload: unknown): ChatMessageItem | null => {
  const rootRecord = asRecord(payload);
  if (!rootRecord) return null;

  const dataRecord = asRecord(rootRecord.data);
  const source = dataRecord ?? rootRecord;

  const senderRecord = asRecord(source.sender);
  const content = getString(source, ["content", "message", "text"]);
  if (!content) return null;

  return {
    id:
      getString(source, ["id", "messageId"]) ??
      `remote-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    senderId:
      getString(source, ["senderId"]) ??
      (senderRecord ? getString(senderRecord, ["id"]) : undefined) ??
      "",
    senderName:
      getString(source, ["senderName"]) ??
      (senderRecord
        ? getString(senderRecord, ["fullName", "name", "username"])
        : undefined) ??
      "Thành viên",
    content,
    createdAt: normalizeDateString(
      getString(source, ["createdAt", "time", "timestamp"]) ??
        new Date().toISOString(),
    ),
    groupId: getString(source, ["groupId"]),
  };
};

const normalizeHistoryMessages = (payload: unknown): ChatMessageItem[] => {
  if (Array.isArray(payload)) {
    return payload
      .map((item) => normalizeIncomingMessage(item))
      .filter((item): item is ChatMessageItem => item !== null);
  }

  const rootRecord = asRecord(payload);
  if (!rootRecord) {
    return [];
  }

  const dataRecord = asRecord(rootRecord.data);
  const source = dataRecord ?? rootRecord;

  const list =
    getArray(source, ["content", "messages", "items"]) ??
    (Array.isArray(source.data) ? source.data : null);

  if (!list) {
    return [];
  }

  return list
    .map((item) => normalizeIncomingMessage(item))
    .filter((item): item is ChatMessageItem => item !== null);
};

const ChatGroupPage = () => {
  const { data: accountResponse } = useGetUserAccountQuery();
  const { ["group-id"]: groupIdFromRoute } = useParams();
  const groupId = groupIdFromRoute ?? null;

  const [messages, setMessages] = useState<ChatMessageItem[]>([]);
  const [text, setText] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const { data: groupResponse } = useGetGroupByIdQuery(groupId ?? "", {
    skip: !groupId,
  });
  const { data: groupMessagesResponse } = useGetGroupMessagesQuery(
    groupId ?? "",
    {
      skip: !groupId,
    },
  );

  const group = groupResponse?.data;
  const currentUserId = accountResponse?.data?.id ?? "";

  useEffect(() => {
    if (!groupId) return;

    connectChatWS(groupId, (payload: unknown) => {
      const incoming = normalizeIncomingMessage(payload);
      if (!incoming) return;

      if (incoming.groupId && incoming.groupId !== groupId) {
        return;
      }

      setMessages((prev) => {
        if (prev.some((item) => isSameIncomingMessage(item, incoming))) {
          return prev;
        }

        return [...prev, incoming];
      });
    });
    setIsConnected(true);

    return () => {
      disconnectChatWS();
      setIsConnected(false);
    };
  }, [groupId]);

  useEffect(() => {
    if (!groupId) {
      setMessages([]);
      return;
    }

    const historyMessages = normalizeHistoryMessages(
      groupMessagesResponse?.data,
    );
    if (historyMessages.length === 0) {
      return;
    }

    setMessages((prev) => {
      if (prev.length === 0) {
        return historyMessages;
      }

      const merged = [...historyMessages];
      for (const message of prev) {
        if (!merged.some((item) => isSameIncomingMessage(item, message))) {
          merged.push(message);
        }
      }

      return merged;
    });
  }, [groupId, groupMessagesResponse]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const orderedMessages = useMemo(
    () =>
      [...messages].sort(
        (a, b) => toDate(a.createdAt).getTime() - toDate(b.createdAt).getTime(),
      ),
    [messages],
  );

  const sendMessage = () => {
    if (!text.trim() || !groupId) return;

    const content = text.trim();
    setText("");

    sendChatMessage(content, groupId);
  };

  const canSend = !!text.trim() && !!groupId;

  return (
    <div className="mt-6 relative flex h-[calc(100vh-220px)] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-gray-900 dark:to-teal-900/20" />

      <div className="relative z-10 flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-700">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            <Users className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-gray-800 dark:text-gray-100">
              {group?.name || "Chat nhóm"}
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {group?.students?.length ?? 0} thành viên
            </p>
          </div>
        </div>

        <div
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
            isConnected
              ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
              : "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/30 dark:text-rose-300"
          }`}
        >
          {isConnected ? (
            <Wifi className="h-3.5 w-3.5" />
          ) : (
            <WifiOff className="h-3.5 w-3.5" />
          )}
          {isConnected ? "Đang kết nối" : "Mất kết nối"}
        </div>
      </div>

      <div className="relative z-10 flex-1 space-y-4 overflow-y-auto bg-gray-50/70 p-4 dark:bg-gray-800/60">
        {orderedMessages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <MessageCircleMore className="h-9 w-9 text-gray-300 dark:text-gray-600" />
            <p>Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện.</p>
          </div>
        ) : (
          orderedMessages.map((message) => {
            const isMe = !!currentUserId && message.senderId === currentUserId;

            return (
              <div
                key={message.id}
                className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {!isMe && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[10px] font-semibold text-gray-600 dark:bg-gray-700 dark:text-gray-200">
                    {getInitials(message.senderName)}
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm ring-1 ${
                    isMe
                      ? "rounded-br-sm bg-emerald-600 text-white ring-emerald-500 dark:bg-emerald-500"
                      : "rounded-bl-sm bg-white text-gray-800 ring-gray-200 dark:bg-gray-900 dark:text-gray-100 dark:ring-gray-700"
                  }`}
                >
                  {!isMe && (
                    <p className="mb-1 text-[11px] font-semibold text-gray-600 dark:text-gray-300">
                      {message.senderName}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap break-words leading-relaxed">
                    {renderMessageContent(message.content, isMe)}
                  </p>
                  <p className="mt-1.5 text-right text-[10px] opacity-70">
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="relative z-10 border-t border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
        <div className="flex items-end gap-2 rounded-xl border border-gray-200 bg-gray-50 p-2 dark:border-gray-700 dark:bg-gray-800">
          <input
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Nhập tin nhắn..."
            disabled={!groupId}
            className="h-9 flex-1 rounded-lg border border-transparent bg-transparent px-3 text-sm text-gray-800 outline-none placeholder:text-gray-400 focus:border-emerald-300 focus:bg-white dark:text-gray-100 dark:placeholder:text-gray-500 dark:focus:border-emerald-700 dark:focus:bg-gray-900"
          />
          <button
            onClick={sendMessage}
            disabled={!canSend}
            className="inline-flex h-9 items-center gap-1 rounded-lg bg-emerald-600 px-3 text-sm font-medium text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            <Send className="h-4 w-4" />
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGroupPage;
