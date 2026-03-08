import { ArrowDown } from "lucide-react";

interface Props {
  visible: boolean;
  onClick: () => void;
  unreadCount?: number;
}

export function JumpToBottom({ visible, onClick, unreadCount }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-24 right-6 z-10 animate-in slide-in-from-bottom-2 duration-200">
      <button
        onClick={onClick}
        className="flex items-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-colors border border-zinc-600"
      >
        {unreadCount && unreadCount > 0 ? (
          <span className="bg-indigo-600 text-white text-[10px] font-bold px-1.5 rounded-full">
            {unreadCount}
          </span>
        ) : null}
        <span>Jump to present</span>
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
