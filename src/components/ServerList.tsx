import { useStore } from "@/store";
import { api } from "@/api/client";
import type { Workspace } from "@/api/client";

const css: Record<string, React.CSSProperties> = {
  rail: {
    width: "var(--server-width)",
    background: "var(--bg-floating)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 12,
    gap: 8,
    overflowY: "auto",
    flexShrink: 0,
  },
  icon: (active: boolean): React.CSSProperties => ({
    width: 48,
    height: 48,
    borderRadius: active ? 16 : 24,
    background: active ? "var(--accent)" : "var(--bg-secondary)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    fontWeight: 700,
    color: active ? "#fff" : "var(--text-secondary)",
    cursor: "pointer",
    transition: "border-radius .15s, background .15s",
    flexShrink: 0,
    userSelect: "none",
  }),
  divider: {
    width: 32,
    height: 2,
    background: "var(--border)",
    borderRadius: 1,
  },
};

export function ServerList() {
  const { workspaces, activeWorkspace, setActiveWorkspace, setRooms } = useStore();

  const select = async (w: Workspace) => {
    setActiveWorkspace(w);
    const rooms = await api.getRooms(w.id);
    setRooms(rooms);
  };

  const createWs = async () => {
    const name = prompt("Workspace name:");
    if (!name) return;
    const ws = await api.createWorkspace(name);
    useStore.getState().setWorkspaces([...workspaces, ws]);
    select(ws);
  };

  return (
    <nav style={css.rail}>
      {workspaces.map((w) => (
        <div
          key={w.id}
          style={css.icon(w.id === activeWorkspace?.id)}
          onClick={() => select(w)}
          title={w.name}
        >
          {w.iconUrl ? <img src={w.iconUrl} alt={w.name} style={{ width: 48, height: 48, borderRadius: "inherit", objectFit: "cover" }} /> : w.name[0].toUpperCase()}
        </div>
      ))}
      <div style={css.divider} />
      <div
        style={{ ...css.icon(false), color: "var(--online)", fontSize: 24 }}
        onClick={createWs}
        title="Add workspace"
      >
        +
      </div>
    </nav>
  );
}
