import { useState } from "react";
import { api } from "@/api/client";
import type { User } from "@/api/client";

const s = (style: React.CSSProperties) => style;

export function Login({ onSwitch, onLogin }: { onSwitch: () => void; onLogin: (u: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const { user } = await api.login({ email, password });
      onLogin(user);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div style={s({ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" })}>
      <div style={s({ background: "var(--bg-secondary)", borderRadius: 8, padding: 32, width: 480, boxShadow: "0 8px 24px rgba(0,0,0,.4)" })}>
        <h2 style={s({ textAlign: "center", fontWeight: 700, fontSize: 24, marginBottom: 8 })}>Welcome back!</h2>
        <p style={s({ textAlign: "center", color: "var(--text-muted)", marginBottom: 20, fontSize: 14 })}>We're so excited to see you again!</p>

        {[
          { label: "EMAIL", value: email, set: setEmail, type: "email" },
          { label: "PASSWORD", value: password, set: setPassword, type: "password" },
        ].map(({ label, value, set, type }) => (
          <div key={label} style={s({ marginBottom: 16 })}>
            <label style={s({ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: .5, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" })}>{label}</label>
            <input
              type={type}
              value={value}
              onChange={(e) => set(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              style={s({ width: "100%", height: 40, background: "var(--bg-primary)", borderRadius: 4, padding: "0 10px", fontSize: 16, color: "var(--text-primary)", border: "1px solid transparent" })}
            />
          </div>
        ))}

        {error && <p style={s({ color: "var(--danger)", fontSize: 13, marginBottom: 12 })}>{error}</p>}

        <button
          onClick={submit}
          disabled={!email || !password || loading}
          style={s({ width: "100%", height: 44, background: "var(--accent)", borderRadius: 4, color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer", opacity: (!email || !password || loading) ? .5 : 1 })}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>

        <p style={s({ marginTop: 8, fontSize: 14, color: "var(--text-muted)" })}>
          Need an account?{" "}
          <span onClick={onSwitch} style={s({ color: "var(--text-link)", cursor: "pointer" })}>Register</span>
        </p>
      </div>
    </div>
  );
}
