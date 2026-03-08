import { useStore } from "@/store";
import { api } from "@/api/client";
import { socket } from "@/api/ws";
import { Hash, Plus, ChevronDown, Circle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Room } from "@/api/client";

export function ChannelSidebar() {
  const { activeWorkspace, rooms, activeRoom, setActiveRoom, setMessages, user } = useStore();

  const select = async (room: Room) => {
    setActiveRoom(room);
    socket.connect(room.id);
    const msgs = await api.getMessages(room.id);
    setMessages(room.id, msgs);
  };

  const createRoom = async () => {
    if (!activeWorkspace) return;
    const name = prompt("Channel name:");
    if (!name) return;
    const room = await api.createRoom(activeWorkspace.id, name.toLowerCase().replace(/\s+/g, "-"));
    useStore.getState().setRooms([...rooms, room]);
  };

  return (
    <div className="flex flex-col bg-zinc-800 w-60 h-full shrink-0">
      {/* Header */}
      <div className="electron-drag h-12 flex items-center justify-between px-4 border-b border-zinc-700 cursor-pointer hover:bg-zinc-700/50 transition-colors shrink-0">
        <span className="font-semibold text-zinc-100 truncate">
          {activeWorkspace?.name ?? "Select a workspace"}
        </span>
        <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
      </div>

      {/* Channel list */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="flex items-center justify-between px-2 mb-1">
          <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wide">Text Channels</span>
          {activeWorkspace && (
            <button onClick={createRoom} className="text-zinc-500 hover:text-zinc-200 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>

        {rooms.map((room) => {
          const active = room.id === activeRoom?.id;
          return (
            <div
              key={room.id}
              onClick={() => select(room)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded mx-0 cursor-pointer transition-colors ${
                active
                  ? "bg-zinc-700 text-zinc-100"
                  : "text-zinc-400 hover:bg-zinc-700/50 hover:text-zinc-200"
              }`}
            >
              <Hash className="w-4 h-4 shrink-0" />
              <span className={`text-sm truncate ${active ? "font-medium" : ""}`}>{room.name}</span>
            </div>
          );
        })}
      </ScrollArea>

      {/* User panel */}
      {user && (
        <>
          <Separator className="bg-zinc-700" />
          <div className="h-[52px] bg-zinc-900 flex items-center px-2 gap-2 shrink-0">
            <div className="relative">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="text-xs bg-indigo-600 text-white font-bold">
                  {user.displayName[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Circle className="absolute -bottom-0.5 -right-0.5 h-3 w-3 fill-green-500 text-green-500" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-zinc-100 truncate">{user.displayName}</div>
              <div className="text-[11px] text-zinc-500">@{user.username}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
