import { useRef, useState, useEffect, useCallback } from "react";
import { useStore } from "@/store";
import { sendMessage } from "@/api/socket";
import { Paperclip, Smile } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onReplyCancel?: () => void;
  replyTo?: { id: string; senderName: string; content: string } | null;
}

export function MessageBox({ replyTo, onReplyCancel }: Props) {
  const { activeRoom, user, appendMessage } = useStore();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 200)}px`;
  }, [value]);

  useEffect(() => {
    textareaRef.current?.focus();
  }, [activeRoom?.id]);

  const send = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || !activeRoom || !user) return;

    // Optimistic: append immediately so the user sees it right away
    const optimistic = {
      id: `optimistic-${Date.now()}`,
      roomId: activeRoom.id,
      senderId: user.id,
      senderName: user.displayName,
      senderType: "user" as const,
      content: trimmed,
      createdAt: new Date().toISOString(),
    };
    appendMessage(optimistic);

    sendMessage(trimmed, user.id, user.displayName, "user");
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    onReplyCancel?.();
  }, [value, activeRoom, user, appendMessage, onReplyCancel]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  if (!activeRoom) return null;

  return (
    <div className="px-4 pb-6 shrink-0">
      <div className={cn(
        "bg-zinc-700 rounded-lg flex flex-col",
        replyTo && "rounded-t-none"
      )}>
        <div className="flex items-end px-3 gap-2">
          <button className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0 pb-2.5">
            <Paperclip className="w-5 h-5" />
          </button>
          <textarea
            ref={textareaRef}
            rows={1}
            className="flex-1 bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 outline-none resize-none py-2.5 leading-relaxed max-h-[200px] overflow-y-auto"
            placeholder={`Message #${activeRoom.name}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
          />
          <button className="text-zinc-400 hover:text-zinc-200 transition-colors shrink-0 pb-2.5">
            <Smile className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
