import { useEffect, useRef } from "react";
import {
  connectNotificationWS,
  disconnectNotificationWS,
} from "../websocket/notificationWS";

const useNotificationSocket = (
  onReceive: (data: any) => void,
  enabled = true,
) => {
  const onReceiveRef = useRef(onReceive);

  useEffect(() => {
    onReceiveRef.current = onReceive;
  }, [onReceive]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    connectNotificationWS((data) => onReceiveRef.current(data));

    return () => {
      disconnectNotificationWS();
    };
  }, [enabled]);
};

export default useNotificationSocket;
