import { useStore } from "@/store";
import { ServerList } from "@/components/ServerList";
import { ChannelSidebar } from "@/components/ChannelSidebar";
import { ChatArea } from "@/components/ChatArea";
import { api } from "@/api/client";
import { useEffect } from "react";

export function App() {
  const { setWorkspaces, setActiveWorkspace, setRooms } = useStore();

  useEffect(() => {
    api.getWorkspaces().then(async (workspaces) => {
      setWorkspaces(workspaces);
      if (workspaces.length > 0) {
        setActiveWorkspace(workspaces[0]);
        const rooms = await api.getRooms(workspaces[0].id);
        setRooms(rooms);
      }
    });
  }, [setWorkspaces, setActiveWorkspace, setRooms]);

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <ServerList />
      <ChannelSidebar />
      <ChatArea />
    </div>
  );
}
