import type { Message } from "./client";

type WSEvent =
  | { type: "history"; messages: Message[] }
  | { type: "message"; message: Message }
  | { type: "presence"; users: string[] };

type Listener = (event: WSEvent) => void;

class RoomSocket {
  private ws: WebSocket | null = null;
  private roomId: string | null = null;
  private token: string | undefined;
  private listeners = new Set<Listener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;

  connect(roomId: string, token?: string) {
    if (this.ws && this.roomId === roomId) return;
    this.disconnect();
    this.roomId = roomId;
    this.token = token;
    this._open();
  }

  private _open() {
    const roomId = this.roomId!;
    const proto = location.protocol === "https:" ? "wss:" : "ws:";
    const params = new URLSearchParams({ roomId: roomId });
    if (this.token) params.set("token", this.token);
    this.ws = new WebSocket(`${proto}//${location.host}/api/ws?${params}`);

    this.ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as WSEvent;
        this.listeners.forEach((l) => l(event));
      } catch { /* ignore */ }
    };

    this.ws.onclose = () => {
      this.ws = null;
      this.reconnectTimer = setTimeout(() => {
        if (this.roomId === roomId) this._open();
      }, 3000);
    };

    this.ws.onerror = (e) => console.error("[ws] error", e);
  }

  disconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.ws?.close();
    this.ws = null;
    this.roomId = null;
  }

  send(payload: { content: string; senderId: string; senderName: string; senderType: "user" | "agent" }) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "message", ...payload }));
    }
  }

  sendTyping() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: "typing" }));
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
