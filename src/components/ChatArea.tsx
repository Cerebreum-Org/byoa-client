import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { joinRoom, sendMessage, onMessage } from "@/api/socket";
import { formatDistanceToNow } from "date-fns";
import { Hash } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Message } from "@/api/client";

export function ChatArea() {
  const { activeRoom, messages, appendMessage, setMessages } = useStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeRoom) return;
    const leave = joinRoom(activeRoom.id, (msgs: Message[]) => setMessages(msgs));
    return () => { leave(); };
  }, [activeRoom?.id, setMessages]);

  useEffect(() => {
    return onMessage((msg) => appendMessage(msg));
  }, [appendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const send = () => {
    if (!input.trim() || !activeRoom) return;
    sendMessage(input.trim());
    setInput("");
  };

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
    <div className="flex flex-col flex-1 bg-zinc-900 min-w-0 h-full">
      {/* Header */}
      <div className="h-12 flex items-center px-4 gap-2 bg-zinc-800 border-b border-zinc-700 shrink-0">
        <Hash className="text-zinc-400 w-5 h-5" />
        <span className="font-semibold text-zinc-100">{activeRoom.name}</span>
        {activeRoom.description && (
          <>
            <div className="w-px h-5 bg-zinc-600 mx-1" />
            <span className="text-sm text-zinc-400">{activeRoom.description}</span>
          </>
        )}
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 px-4 py-4">
        {messages.length === 0 && (
          <div className="pb-4 border-b border-zinc-700 mb-4">
            <div className="text-4xl font-bold text-zinc-100 mb-1">#{activeRoom.name}</div>
            <div className="text-sm text-zinc-400">This is the beginning of <strong className="text-zinc-200">#{activeRoom.name}</strong>.</div>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const grouped = prev?.senderId === msg.senderId && prev?.senderType === msg.senderType &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 rounded px-2 group hover:bg-zinc-800/50 ${grouped ? "pl-14 py-0.5" : "py-1"}`}
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
                    <span className="text-[11px] text-zinc-500">
                      {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                )}
                <p className="text-sm text-zinc-200 leading-relaxed break-words">{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </ScrollArea>

      {/* Input */}
      <div className="px-4 pb-6 shrink-0">
        <div className="bg-zinc-700 rounded-lg flex items-center px-4 gap-3">
          <input
            className="flex-1 h-11 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none"
            placeholder={`Message #${activeRoom.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          />
        </div>
      </div>
    </div>
  );
}
