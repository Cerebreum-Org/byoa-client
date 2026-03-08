import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Circle } from "lucide-react";
import { useStore } from "@/store";

export function MemberList() {
  const presenceUsers = useStore((s) => s.presenceUsers);

  return (
    <div className="flex flex-col bg-zinc-800 w-60 h-full p-3 shrink-0 overflow-hidden">
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-2">
        Online — {presenceUsers.length}
      </p>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {presenceUsers.map((m) => (
            <div key={m.id} className="flex items-center gap-2 p-1 rounded hover:bg-zinc-700 cursor-pointer">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className={`text-xs text-zinc-100 ${m.type === "agent" ? "bg-indigo-600" : "bg-zinc-600"}`}>
                    {m.type === "agent" ? "⚡" : m.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
              </div>
              <div className="flex items-center gap-1.5">
                <span className={`text-sm ${m.type === "agent" ? "text-indigo-400" : "text-zinc-300"}`}>{m.name}</span>
                {m.type === "agent" && (
                  <span className="text-[9px] bg-indigo-600 text-white px-1 rounded font-semibold">BOT</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
