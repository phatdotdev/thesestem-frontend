import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";
import {
  refreshWsAccessToken,
  releaseWsAuthRefresh,
  retainWsAuthRefresh,
} from "./wsAuth";

let stompClient: Client | null = null;

export const connectChatWS = (
  groupId: string | null,
  onReceive: (data: any) => void,
) => {
  if (stompClient) {
    void stompClient.deactivate();
    stompClient = null;
    releaseWsAuthRefresh();
  }

  const socket = new SockJS(import.meta.env.VITE_WS_URL);

  const client = new Client({
    webSocketFactory: () => socket,
    beforeConnect: async () => {
      const refreshedToken = await refreshWsAccessToken();
      client.connectHeaders = refreshedToken
        ? { Authorization: `Bearer ${refreshedToken}` }
        : {};
    },
    reconnectDelay: 5000,
  });

  stompClient = client;

  stompClient.onConnect = () => {
    console.log("Chat WS connected");

    // group
    if (groupId) {
      stompClient?.subscribe(`/topic/group/${groupId}`, (message) => {
        onReceive(JSON.parse(message.body));
      });
    }

    // private
    stompClient?.subscribe("/user/queue/private", (message) => {
      onReceive(JSON.parse(message.body));
    });
  };

  retainWsAuthRefresh();
  stompClient.activate();
};

export const sendChatMessage = (
  content: string,
  groupId?: string,
  receiverId?: string,
) => {
  stompClient?.publish({
    destination: "/app/chat.send",
    body: JSON.stringify({
      content,
      groupId,
      receiverId,
    }),
  });
};

export const disconnectChatWS = () => {
  void stompClient?.deactivate();
  stompClient = null;
  releaseWsAuthRefresh();
};
