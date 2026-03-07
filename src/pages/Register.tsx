import { useState } from "react";
import { api } from "@/api/client";
import type { User } from "@/api/client";

const s = (style: React.CSSProperties) => style;

const FIELDS = [
  { key: "email", label: "EMAIL", type: "email", placeholder: "you@example.com" },
  { key: "username", label: "USERNAME", type: "text", placeholder: "yourhandle" },
  { key: "displayName", label: "DISPLAY NAME", type: "text", placeholder: "Your Name" },
  { key: "password", label: "PASSWORD", type: "password", placeholder: "••••••••" },
] as const;

export function Register({ onSwitch, onLogin }: { onSwitch: () => void; onLogin: (u: User) => void }) {
  const [form, setForm] = useState({ email: "", username: "", displayName: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [k]: e.target.value }));

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const { user } = await api.signup(form);
      onLogin(user);
    } catch (e) {
      setError((e as Error).message);
    }
    setLoading(false);
  };

  return (
    <div style={s({ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)" })}>
      <div style={s({ background: "var(--bg-secondary)", borderRadius: 8, padding: 32, width: 480, boxShadow: "0 8px 24px rgba(0,0,0,.4)" })}>
        <h2 style={s({ textAlign: "center", fontWeight: 700, fontSize: 24, marginBottom: 8 })}>Create an account</h2>

        {FIELDS.map(({ key, label, type, placeholder }) => (
          <div key={key} style={s({ marginBottom: 16 })}>
            <label style={s({ display: "block", fontSize: 12, fontWeight: 700, letterSpacing: .5, color: "var(--text-muted)", marginBottom: 8, textTransform: "uppercase" })}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              value={form[key]}
              onChange={set(key)}
              style={s({ width: "100%", height: 40, background: "var(--bg-primary)", borderRadius: 4, padding: "0 10px", fontSize: 16, color: "var(--text-primary)", border: "1px solid transparent" })}
            />
          </div>
        ))}

        {error && <p style={s({ color: "var(--danger)", fontSize: 13, marginBottom: 12 })}>{error}</p>}

        <button
          onClick={submit}
          disabled={Object.values(form).some((v) => !v) || loading}
          style={s({ width: "100%", height: 44, background: "var(--accent)", borderRadius: 4, color: "#fff", fontWeight: 600, fontSize: 16, cursor: "pointer", opacity: (Object.values(form).some((v) => !v) || loading) ? .5 : 1 })}
        >
          {loading ? "Creating account..." : "Continue"}
        </button>

        <p style={s({ marginTop: 8, fontSize: 14, color: "var(--text-muted)" })}>
          Already have an account?{" "}
          <span onClick={onSwitch} style={s({ color: "var(--text-link)", cursor: "pointer" })}>Log in</span>
        </p>
      </div>
    </div>
  );
}
