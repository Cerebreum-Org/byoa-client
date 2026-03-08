// Stable entry point — never changes, never triggers HMR page reload
// All app logic lives in Root.tsx
import { createRoot } from "react-dom/client";
import "@/styles/global.css";
import { Root } from "./Root";

if ((window as any).electronAPI) {
  document.body.classList.add("is-electron");
}

createRoot(document.getElementById("root")!).render(<Root />);
