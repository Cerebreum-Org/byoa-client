import type { Message } from "./client";

let ws: WebSocket | null = null;
let currentRoomId: string | null = null;
let currentToken: string | null = null;
type MessageListener = (msg: Message) => void;
const listeners = new Set<MessageListener>();
let joinCallbacks: ((msgs: Message[]) => void)[] = [];

export async function connectSocket(token: string): Promise<void> {
  currentToken = token;
  // Connection is established per-room via joinRoom
}

let _cleanupTimer: ReturnType<typeof setTimeout> | null = null;

export function joinRoom(roomId: string, onMessages: (msgs: Message[]) => void): () => void {
  // Cancel any pending cleanup (handles React StrictMode double-invoke)
  if (_cleanupTimer !== null) {
    clearTimeout(_cleanupTimer);
    _cleanupTimer = null;
    // Already connected to this room — just update callback
    if (currentRoomId === roomId) {
      joinCallbacks = [onMessages];
      return () => {
        _cleanupTimer = setTimeout(() => {
          ws?.close(); ws = null; currentRoomId = null;
        }, 100);
      };
    }
  }

  // Close previous connection if switching rooms
  if (currentRoomId !== roomId && ws) {
    ws.close();
    ws = null;
  }

  currentRoomId = roomId;
  joinCallbacks = [onMessages];

  const url = `ws://localhost:3002?roomId=${roomId}${currentToken ? `&token=${currentToken}` : ""}`;
  ws = new WebSocket(url);

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "history") {
        joinCallbacks.forEach((cb) => cb(data.messages ?? []));
      } else if (data.type === "message") {
        listeners.forEach((l) => l(data.message));
      }
    } catch {}
  };

  ws.onerror = (e) => console.error("[ws] error", e);
  ws.onclose = () => { ws = null; };

  return () => {
    _cleanupTimer = setTimeout(() => {
      ws?.close(); ws = null; currentRoomId = null; _cleanupTimer = null;
    }, 100);
  };
}

export function sendMessage(content: string, senderId: string, senderName: string, senderType: "user" | "agent" = "user") {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "message", content, senderId, senderName, senderType }));
  }
}

export function sendTyping() {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "typing" }));
  }
}

export function onMessage(listener: MessageListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
