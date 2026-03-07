import type { Message } from "./client";

type WSEvent =
  | { type: "message"; message: Message }
  | { type: "presence"; users: string[] };

type Listener = (event: WSEvent) => void;

class RoomSocket {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private listeners = new Set<Listener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(roomId: string) {
    if (this.ws && this.roomId === roomId) return;
    this.disconnect();
    this.roomId = roomId;

    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    this.ws = new WebSocket(`${proto}//${location.host}/api/ws?roomId=${roomId}`);

    this.ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WSEvent;
        this.listeners.forEach((l) => l(event));
      } catch { /* ignore */ }
    };

    this.ws.onclose = () => {
      this.reconnectTimer = setTimeout(() => this.connect(roomId), 3000);
    };
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.roomId = null;
  }

  send(payload: { content: string; senderId: string; senderName: string }) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "message", ...payload, senderType: "user" }));
    }
  }

  get connected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

export const socket = new RoomSocket();
