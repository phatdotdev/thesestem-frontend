import SockJS from "sockjs-client/dist/sockjs.min.js";
import { Client } from "@stomp/stompjs";
import {
  refreshWsAccessToken,
  releaseWsAuthRefresh,
  retainWsAuthRefresh,
} from "./wsAuth";

let stompClient: Client | null = null;

export const connectNotificationWS = (
  userId: string,
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
    console.log("WS connected");

    stompClient?.subscribe(`/user/${userId}/queue/notifications`, (message) => {
      const data = JSON.parse(message.body);
      onReceive(data);
    });
  };

  retainWsAuthRefresh();
  stompClient.activate();
};

export const disconnectWS = () => {
  void stompClient?.deactivate();
  stompClient = null;
  releaseWsAuthRefresh();
};
