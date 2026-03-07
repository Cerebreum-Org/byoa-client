import { useEffect, useRef, useState } from "react";
import { useStore } from "@/store";
import { socket } from "@/api/ws";
import { formatDistanceToNow } from "date-fns";

const s = (style: React.CSSProperties) => style;

export function ChatArea() {
  const { activeRoom, messages, appendMessage, user } = useStore();
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsub = socket.subscribe((event) => {
      if (event.type === "message") appendMessage(event.message);
    });
    return unsub;
  }, [appendMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [messages]);

  const send = () => {
    if (!input.trim() || !user || !socket.connected) return;
    socket.send({ content: input.trim(), senderId: user.id, senderName: user.displayName });
    setInput("");
  };

  if (!activeRoom) {
    return (
      <div style={s({ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)", flexDirection: "column", gap: 12 })}>
        <div style={s({ fontSize: 48 })}>👋</div>
        <div style={s({ fontSize: 20, fontWeight: 600, color: "var(--text-primary)" })}>No channel selected</div>
        <div style={s({ fontSize: 14 })}>Pick a channel from the sidebar to start chatting</div>
      </div>
    );
  }

  return (
    <div style={s({ flex: 1, display: "flex", flexDirection: "column", background: "var(--bg-primary)", minWidth: 0 })}>
      {/* Header */}
      <div style={s({ height: 48, borderBottom: "1px solid var(--bg-floating)", display: "flex", alignItems: "center", padding: "0 16px", gap: 8, flexShrink: 0 })}>
        <span style={s({ color: "var(--text-muted)", fontSize: 22, fontWeight: 300 })}>#</span>
        <span style={s({ fontWeight: 600, fontSize: 15 })}>{activeRoom.name}</span>
        {activeRoom.description && (
          <>
            <div style={s({ width: 1, height: 20, background: "var(--border)", margin: "0 4px" })} />
            <span style={s({ fontSize: 13, color: "var(--text-muted)" })}>{activeRoom.description}</span>
          </>
        )}
      </div>

      {/* Messages */}
      <div style={s({ flex: 1, overflowY: "auto", padding: "16px 0 8px" })}>
        {messages.length === 0 && (
          <div style={s({ padding: "0 16px 16px", borderBottom: "1px solid var(--border)", marginBottom: 16 })}>
            <div style={s({ fontSize: 36, marginBottom: 8 })}>#{activeRoom.name}</div>
            <div style={s({ fontSize: 15, color: "var(--text-secondary)" })}>This is the beginning of <strong>#{activeRoom.name}</strong>.</div>
          </div>
        )}

        {messages.map((msg, i) => {
          const prev = messages[i - 1];
          const grouped = prev?.senderId === msg.senderId && prev?.senderType === msg.senderType &&
            new Date(msg.createdAt).getTime() - new Date(prev.createdAt).getTime() < 5 * 60 * 1000;

          return (
            <div key={msg.id} style={s({ padding: grouped ? "1px 16px 1px 72px" : "4px 16px", display: "flex", gap: 16 })}>
              {!grouped && (
                <div style={s({ width: 40, height: 40, borderRadius: "50%", flexShrink: 0, marginTop: 2, background: msg.senderType === "agent" ? "#5865f2" : "var(--bg-tertiary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700 })}>
                  {msg.senderType === "agent" ? "⚡" : msg.senderName[0]?.toUpperCase()}
                </div>
              )}
              <div style={s({ flex: 1, minWidth: 0 })}>
                {!grouped && (
                  <div style={s({ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 })}>
                    <span style={s({ fontWeight: 500, fontSize: 15, color: msg.senderType === "agent" ? "#5865f2" : "var(--text-primary)" })}>{msg.senderName}</span>
                    {msg.senderType === "agent" && <span style={s({ fontSize: 10, background: "#5865f2", color: "#fff", padding: "0 4px", borderRadius: 3, fontWeight: 600, letterSpacing: .3 })}>AGENT</span>}
                    <span style={s({ fontSize: 11, color: "var(--text-muted)" })}>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</span>
                  </div>
                )}
                <p style={s({ fontSize: 15, color: "var(--text-primary)", wordBreak: "break-word", lineHeight: 1.375 })}>{msg.content}</p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={s({ padding: "0 16px 24px", flexShrink: 0 })}>
        <div style={s({ background: "var(--bg-input)", borderRadius: 8, display: "flex", alignItems: "center", padding: "0 16px", gap: 8 })}>
          <input
            style={s({ flex: 1, height: 44, fontSize: 15, color: "var(--text-primary)", background: "none" })}
            placeholder={`Message #${activeRoom.name}`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          />
        </div>
      </div>
    </div>
  );
}
