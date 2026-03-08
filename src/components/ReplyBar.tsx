import { X } from "lucide-react";

interface ReplyTarget {
  id: string;
  senderName: string;
  content: string;
}

interface Props {
  reply: ReplyTarget;
  onCancel: () => void;
}

export function ReplyBar({ reply, onCancel }: Props) {
  return (
    <div className="mx-4 px-3 py-1.5 bg-zinc-700 rounded-t-lg flex items-center gap-2 text-sm border-b border-zinc-600 animate-in slide-in-from-bottom-2 duration-200">
      <span className="text-zinc-400 text-xs shrink-0">Replying to</span>
      <span className="font-semibold text-zinc-200 shrink-0">{reply.senderName}</span>
      <span className="text-zinc-400 truncate flex-1 text-xs">{reply.content}</span>
      <button
        onClick={onCancel}
        className="text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
