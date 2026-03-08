import { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { App } from "@/pages/App";
import { api } from "@/api/client";
import { connectSocket, setSocketUser } from "@/api/socket";
import { useStore } from "@/store";
import type { User } from "@/api/client";

// Mark body as electron for CSS targeting
if ((window as any).electronAPI) {
  document.body.classList.add("is-electron");
}

function Root() {
  const { user, setUser } = useStore();
  const [page, setPage] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);

  const boot = async (u: User) => {
    setUser(u);
    setSocketUser({ id: u.id, displayName: u.displayName });
    try {
      const { token } = await api.wsToken();
      await connectSocket(token);
    } catch {
      // Backend unavailable — running in offline/dev mode
    }
  };

  useEffect(() => {
    api.me()
      .then(boot)
      .catch(() =>
        api.login({ email: "dev@byoa.local", password: "byoadev123" })
          .then((res) => boot(res.user))
          .catch(() => {
            const devUser = { id: "dev-user", email: "dev@byoa.local", username: "hypereum", displayName: "Hypereum", avatarUrl: null };
            setUser(devUser);
            setSocketUser({ id: devUser.id, displayName: devUser.displayName });
          })
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-900 text-zinc-500">
        Loading...
      </div>
    );
  }

  if (!user) {
    return page === "login"
      ? <Login onSwitch={() => setPage("register")} onLogin={boot} />
      : <Register onSwitch={() => setPage("login")} onLogin={boot} />;
  }

  return <App />;
}

const rootEl = document.getElementById("root")!;
const w = window as any;
if (!w.__byoa_root) { w.__byoa_root = createRoot(rootEl); }
w.__byoa_root.render(
  <Root />
);
