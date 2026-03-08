/**
 * socket.ts — thin wrapper over ws.ts's RoomSocket
 * Keeps the API surface that ChatArea/MessageBox expect.
 */
import { socket } from "./ws";
import type { PresenceUser } from "./ws";
import type { Message } from "./client";

let currentToken: string | null = null;
let currentUser: { id: string; displayName: string } | null = null;

export async function connectSocket(token: string): Promise<void> {
  currentToken = token;
}

export function setSocketUser(user: { id: string; displayName: string }) {
  currentUser = user;
}

export function joinRoom(roomId: string, onMessages: (msgs: Message[]) => void): () => void {
  socket.connect(roomId, {
    token: currentToken ?? undefined,
    senderId: currentUser?.id,
    senderName: currentUser?.displayName,
    senderType: "user",
  });

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

export function onPresence(listener: (users: PresenceUser[]) => void): () => void {
  return socket.subscribe((event) => {
    if (event.type === "presence") listener(event.users);
  });
}

export type { PresenceUser };
