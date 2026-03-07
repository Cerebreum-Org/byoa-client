import { Socket, Channel } from "phoenix";
import type { Message } from "./client";

let socket: Socket | null = null;
let channel: Channel | null = null;
let currentRoomId: string | null = null;
type MessageListener = (msg: Message) => void;
const listeners = new Set<MessageListener>();

export async function connectSocket(token: string): Promise<void> {
  if (socket) return;
  socket = new Socket("/socket", { params: { token } });
  socket.connect();
}

export function joinRoom(roomId: string, onMessages: (msgs: Message[]) => void): () => void {
  if (!socket) throw new Error("Socket not connected");
  if (currentRoomId === roomId && channel) return () => {};

  // Leave previous room
  channel?.leave();
  currentRoomId = roomId;

  channel = socket.channel(`room:${roomId}`, {});

  channel.join()
    .receive("ok", (resp: { messages: Message[] }) => onMessages(resp.messages))
    .receive("error", (e: unknown) => console.error("Join error", e));

  channel.on("message:new", (msg: Message) => {
    listeners.forEach((l) => l(msg));
  });

  return () => {
    channel?.leave();
    channel = null;
    currentRoomId = null;
    return;
  };
}

export function sendMessage(content: string) {
  channel?.push("message:send", { content });
}

export function sendTyping() {
  channel?.push("typing:start", {});
}

export function onMessage(listener: MessageListener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
