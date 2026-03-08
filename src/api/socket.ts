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

export function joinRoom(roomId: string, onMessages: (msgs: Message[]) => void): () => void {
  // Close previous connection if switching rooms
  if (currentRoomId !== roomId && ws) {
    ws.close();
    ws = null;
  }

  currentRoomId = roomId;
  joinCallbacks = [onMessages];

  const url = `ws://localhost:3000/api/ws?roomId=${roomId}${currentToken ? `&token=${currentToken}` : ""}`;
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
    ws?.close();
    ws = null;
    currentRoomId = null;
  };
}

export function sendMessage(content: string) {
  if (ws?.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: "message", content }));
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
