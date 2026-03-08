import { useEffect, useRef, useState, useCallback } from "react";
import { useStore } from "@/store";
import { joinRoom, onMessage, onPresence } from "@/api/socket";
import { formatDistanceToNow } from "date-fns";
import { Hash } from "lucide-react";
import { MessageBox } from "@/components/MessageBox";
import { ReplyBar } from "@/components/ReplyBar";
import { TypingIndicator } from "@/components/TypingIndicator";
import { JumpToBottom } from "@/components/JumpToBottom";
import type { Message } from "@/api/client";

interface ReplyTarget {
  id: string;
  senderName: string;
  content: string;
}

export function ChatArea() {
  const { activeRoom, messagesByRoom, appendMessage, setMessages, setPresenceUsers } = useStore();
  const messages = activeRoom ? (messagesByRoom[activeRoom.id] ?? []) : [];
  const [reply, setReply] = useState<ReplyTarget | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [typingUsers] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeRoom) return;
    setReply(null);
    const leave = joinRoom(activeRoom.id, (msgs: Message[]) => setMessages(activeRoom.id, msgs));
    return () => { leave(); };
  }, [activeRoom?.id, setMessages]);

  useEffect(() => {
    const roomId = activeRoom?.id ?? "";
    return onMessage((msg) => appendMessage(roomId, msg));
  }, [activeRoom?.id, appendMessage]);

  useEffect(() => {
    return onPresence((users) => setPresenceUsers(users));
  }, [setPresenceUsers]);

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, atBottom]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAtBottom(distFromBottom < 80);
  }, []);

  const jumpToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setAtBottom(true);
  }, []);

  if (!activeRoom) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-900 text-zinc-400 gap-3">
        <div className="text-5xl">👋</div>
        <div className="text-xl font-semibold text-zinc-100">No channel selected</div>
        <div className="text-sm">Pick a channel from the sidebar to start chatting</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 bg-zinc-900 min-w-0 h-full relative">
      {/* Header */}
      <div className="h-12 flex items-center px-4 gap-2 bg-zinc-800 border-b border-zinc-700 shrink-0 electron-drag">
        <Hash className="text-zinc-400 w-5 h-5 electron-no-drag" />
        <span className="font-semibold text-zinc-100 electron-no-drag">{activeRoom.name}</span>
        {activeRoom.description && (
          <>
            <div className="w-px h-5 bg-zinc-600 mx-1" />
            <span className="text-sm text-zinc-400">{activeRoom.description}</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 px-4 py-4 overflow-y-auto"
        onScroll={handleScroll}
      >
        {messages.length === 0 && (
          <div className="pb-4 border-b border-zinc-700 mb-4">
            <div className="text-4xl font-bold text-zinc-100 mb-1">#{activeRoom.name}</div>
            <div className="text-sm text-zinc-400">
              This is the beginning of <strong className="text-zinc-200">#{activeRoom.name}</strong>.
            </div>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const grouped =
            prev?.senderId === msg.senderId &&
            prev?.senderType === msg.senderType &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

          const ownerUsername = (msg as Message & { ownerUsername?: string }).ownerUsername;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 rounded px-2 group hover:bg-zinc-800/50 ${grouped ? "pl-14 py-0.5" : "py-1"}`}
              onDoubleClick={() => setReply({ id: msg.id, senderName: msg.senderName, content: msg.content })}
            >
              {!grouped && (
                <div className={`w-10 h-10 rounded-full shrink-0 mt-0.5 flex items-center justify-center text-sm font-bold ${msg.senderType === "agent" ? "bg-indigo-600" : "bg-zinc-700"}`}>
                  {msg.senderType === "agent" ? "⚡" : msg.senderName[0]?.toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                {!grouped && (
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <span className={`font-semibold text-sm ${msg.senderType === "agent" ? "text-indigo-400" : "text-zinc-100"}`}>
                      {msg.senderName}
                    </span>
                    {msg.senderType === "agent" && (
                      <span className="text-[10px] bg-indigo-600 text-white px-1 rounded font-semibold tracking-wide">AGENT</span>
                    )}
                    {msg.senderType === "agent" && ownerUsername && (
                      <span className="text-[11px] text-zinc-500">for @{ownerUsername}</span>
                    )}
                    <span className="text-[11px] text-zinc-500">
                      {msg.createdAt ? formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true }) : ""}
                    </span>
                  </div>
                )}
                <p className="text-sm text-zinc-200 leading-relaxed break-words">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <JumpToBottom visible={!atBottom} onClick={jumpToBottom} />
      <TypingIndicator typingUsers={typingUsers} />
      {reply && <ReplyBar reply={reply} onCancel={() => setReply(null)} />}
      <MessageBox replyTo={reply} onReplyCancel={() => setReply(null)} />
    </div>
  );
}
