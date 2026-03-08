import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { App } from "@/pages/App";
import { api } from "@/api/client";
import { connectSocket } from "@/api/socket";
import { useStore } from "@/store";
import type { User } from "@/api/client";

function Root() {
  const { user, setUser } = useStore();
  const [page, setPage] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);

  const boot = async (u: User) => {
    setUser(u);
    // Connect Phoenix socket with short-lived token
    const { token } = await api.wsToken();
    await connectSocket(token);
  };

  useEffect(() => {
    api.me()
      .then(boot)
      .catch(() => {})
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

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
