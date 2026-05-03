import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";
import {
  refreshWsAccessToken,
  releaseWsAuthRefresh,
  retainWsAuthRefresh,
} from "./wsAuth";

let stompClient: Client | null = null;

export const connectNotificationWS = (onReceive: (data: any) => void) => {
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
    console.log("Notification WS connected");

    stompClient?.subscribe("/user/queue/notifications", (message) => {
      const data = JSON.parse(message.body);

      console.log("Notification received:", data);

      onReceive(data);
    });
  };

  stompClient.onStompError = (frame) => {
    console.error("Notification WS error:", frame);
  };

  stompClient.onWebSocketClose = () => {
    console.log("Notification WS closed");
  };

  retainWsAuthRefresh();

  stompClient.activate();
};

export const disconnectNotificationWS = () => {
  void stompClient?.deactivate();

  stompClient = null;

  releaseWsAuthRefresh();
};
