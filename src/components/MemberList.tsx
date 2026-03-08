import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Circle } from "lucide-react";

const STUB_MEMBERS = [
  { id: "1", name: "Hypereum", online: true },
  { id: "2", name: "g0rd0", online: true },
  { id: "3", name: "Sync", online: true },
];

export function MemberList() {
  return (
    <div className="flex flex-col bg-zinc-800 w-60 h-full p-3 shrink-0">
      <p className="text-xs text-zinc-500 font-semibold uppercase tracking-wide mb-2">
        Members — {STUB_MEMBERS.length}
      </p>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1">
          {STUB_MEMBERS.map((m) => (
            <div key={m.id} className="flex items-center gap-2 p-1 rounded hover:bg-zinc-700 cursor-pointer">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-zinc-600 text-zinc-100">
                    {m.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {m.online && (
                  <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
                )}
              </div>
              <span className="text-sm text-zinc-300">{m.name}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
