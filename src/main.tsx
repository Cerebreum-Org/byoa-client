import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { App } from "@/pages/App";
import { api } from "@/api/client";
import { useStore } from "@/store";

function Root() {
  const { user, setUser } = useStore();
  const [page, setPage] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.me()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setUser]);

  if (loading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-primary)", color: "var(--text-muted)" }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return page === "login"
      ? <Login onSwitch={() => setPage("register")} />
      : <Register onSwitch={() => setPage("login")} />;
  }

  return <App />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Root />
  </StrictMode>
);
