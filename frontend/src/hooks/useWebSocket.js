import { useEffect, useRef, useCallback } from "react";
import { WS_URL } from "../utils/constants";

/**
 * useWebSocket — manages a persistent WebSocket connection.
 * Reconnects automatically on disconnect.
 * @param {function} onMessage - called with parsed JSON payload on each message
 * @param {boolean} enabled - pause connection when false
 */
export function useWebSocket(onMessage, enabled = true) {
  const ws = useRef(null);
  const reconnectTimer = useRef(null);

  const connect = useCallback(() => {
    if (!enabled) return;

    try {
      const socket = new WebSocket(WS_URL);

      socket.onopen = () => {
        console.log("🔌 WebSocket connected");
        clearInterval(reconnectTimer.current);
        // Send periodic ping to keep connection alive
        reconnectTimer.current = setInterval(() => {
          if (socket.readyState === WebSocket.OPEN) socket.send("ping");
        }, 25000);
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data !== "pong") onMessage(data);
        } catch {
          // ignore malformed messages
        }
      };

      socket.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Reconnecting in 3s…");
        clearInterval(reconnectTimer.current);
        reconnectTimer.current = setTimeout(connect, 3000);
      };

      socket.onerror = () => socket.close();

      ws.current = socket;
    } catch (err) {
      console.error("WebSocket connection failed:", err);
    }
  }, [enabled, onMessage]);

  useEffect(() => {
    connect();
    return () => {
      clearTimeout(reconnectTimer.current);
      clearInterval(reconnectTimer.current);
      ws.current?.close();
    };
  }, [connect]);
}
