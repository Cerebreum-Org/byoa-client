/**
 * socket.ts — thin wrapper over ws.ts's RoomSocket
 * Keeps the API surface that ChatArea/MessageBox expect.
 */
import { socket } from "./ws";
import type { Message } from "./client";

let currentToken: string | null = null;

export async function connectSocket(token: string): Promise<void> {
  currentToken = token;
}

export function joinRoom(roomId: string, onMessages: (msgs: Message[]) => void): () => void {
  socket.connect(roomId, currentToken ?? undefined);

  // ws.ts will deliver "history" events — subscribe and forward
  const unsub = socket.subscribe((event) => {
    if (event.type === "history") {
      onMessages(event.messages ?? []);
    }
  });

  return unsub;
}

export function sendMessage(
  content: string,
  senderId: string,
  senderName: string,
  senderType: "user" | "agent" = "user"
) {
  socket.send({ content, senderId, senderName, senderType });
}

export function sendTyping() {
  socket.sendTyping();
}

export function onMessage(listener: (msg: Message) => void): () => void {
  return socket.subscribe((event) => {
    if (event.type === "message") listener(event.message);
  });
}
