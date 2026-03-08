import { useStore } from "@/store";
import { ServerList } from "@/components/ServerList";
import { ChannelSidebar } from "@/components/ChannelSidebar";
import { ChatArea } from "@/components/ChatArea";
import { MemberList } from "@/components/MemberList";
import { api } from "@/api/client";
import { useEffect } from "react";

export function App() {
  const { setWorkspaces, setActiveWorkspace, setRooms, setActiveRoom } = useStore();

  useEffect(() => {
    api.getWorkspaces().then(async (workspaces) => {
      setWorkspaces(workspaces);
      if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0]);
        const rooms = await api.getRooms(workspaces[0].id);
        setRooms(rooms);
        if (rooms.length > 0) setActiveRoom(rooms[0]);
      }
    });
  }, [setWorkspaces, setActiveWorkspace, setRooms, setActiveRoom]);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-900 text-zinc-100">
      <ServerList />
      <ChannelSidebar />
      <div className="flex flex-1 overflow-hidden">
        <ChatArea />
        <MemberList />
      </div>
    </div>
  );
}
