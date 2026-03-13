export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  avatar?: string;
  content: string;
  createdAt: string;
}

export interface MessageGroup {
  senderId: string;
  senderName: string;
  avatar?: string;
  time: string;
  messages: ChatMessage[];
}
