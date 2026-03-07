import { useStore } from "@/store";
import { api } from "@/api/client";
import { socket } from "@/api/ws";
import type { Room } from "@/api/client";

const s = (style: React.CSSProperties) => style;

export function ChannelSidebar() {
  const { activeWorkspace, rooms, activeRoom, setActiveRoom, setMessages, user } = useStore();

  const select = async (room: Room) => {
    setActiveRoom(room);
    socket.connect(room.id);
    const msgs = await api.getMessages(room.id);
    setMessages(msgs);
  };

  const createRoom = async () => {
    if (!activeWorkspace) return;
    const name = prompt("Channel name:");
    if (!name) return;
    const room = await api.createRoom(activeWorkspace.id, name.toLowerCase().replace(/\s+/g, "-"));
    useStore.getState().setRooms([...rooms, room]);
  };

  return (
    <div style={s({ width: "var(--sidebar-width)", background: "var(--bg-secondary)", display: "flex", flexDirection: "column", flexShrink: 0 })}>
      {/* Server name header */}
      <div style={s({ padding: "0 16px", height: 48, display: "flex", alignItems: "center", borderBottom: "1px solid var(--bg-floating)", fontWeight: 600, fontSize: 15, cursor: "pointer" })}>
        {activeWorkspace?.name ?? "Select a workspace"}
      </div>

      {/* Channel list */}
      <div style={s({ flex: 1, overflowY: "auto", padding: "8px 0" })}>
        <div style={s({ padding: "16px 8px 4px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" })}>
          <span style={s({ fontSize: 11, fontWeight: 700, letterSpacing: .5, color: "var(--text-muted)", textTransform: "uppercase" })}>Text Channels</span>
          {activeWorkspace && (
            <button onClick={createRoom} style={s({ color: "var(--text-muted)", fontSize: 18, lineHeight: 1, padding: "0 4px" })} title="Add channel">+</button>
          )}
        </div>

        {rooms.map((room) => (
          <div
            key={room.id}
            onClick={() => select(room)}
            style={s({
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "1px 8px",
              margin: "1px 8px",
              borderRadius: 4,
              cursor: "pointer",
              color: room.id === activeRoom?.id ? "var(--channel-active)" : "var(--channel-default)",
              background: room.id === activeRoom?.id ? "rgba(255,255,255,.08)" : "transparent",
              fontSize: 15,
              fontWeight: room.id === activeRoom?.id ? 500 : 400,
            })}
          >
            <span style={s({ color: "var(--text-muted)", fontSize: 18, width: 18, textAlign: "center" })}>#</span>
            {room.name}
          </div>
        ))}
      </div>

      {/* User panel */}
      {user && (
        <div style={s({ height: 52, background: "var(--bg-floating)", display: "flex", alignItems: "center", padding: "0 8px", gap: 8 })}>
          <div style={s({ width: 32, height: 32, borderRadius: "50%", background: "var(--accent)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, flexShrink: 0 })}>
            {user.displayName[0].toUpperCase()}
          </div>
          <div style={s({ flex: 1, minWidth: 0 })}>
            <div style={s({ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" })}>{user.displayName}</div>
            <div style={s({ fontSize: 11, color: "var(--text-muted)" })}>@{user.username}</div>
          </div>
        </div>
      )}
    </div>
  );
}
