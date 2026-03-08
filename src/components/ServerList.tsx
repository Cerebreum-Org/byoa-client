import { useStore } from "@/store";
import { api } from "@/api/client";
import { Plus } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Workspace } from "@/api/client";

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
    <TooltipProvider delay={300}>
      <nav className="electron-drag flex flex-col items-center bg-zinc-900 w-[72px] h-full py-3 gap-2 shrink-0 overflow-y-auto overflow-x-hidden">
        {/* Traffic light spacer — only visible in Electron on macOS */}
        <div className="electron-no-drag h-5 w-full shrink-0 is-electron:block hidden" />

        {workspaces.map((w) => {
          const active = w.id === activeWorkspace?.id;
          return (
            <Tooltip key={w.id}>
              <TooltipTrigger asChild>
                <div
                  className="electron-no-drag relative flex justify-center w-full group cursor-pointer"
                  onClick={() => select(w)}
                >
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-white rounded-r transition-all duration-150 ${active ? "h-8" : "h-0 group-hover:h-5"}`} />
                  <div className={`w-12 h-12 flex items-center justify-center font-bold text-lg transition-all duration-150 overflow-hidden ${active ? "rounded-2xl bg-indigo-600 text-white" : "rounded-full bg-zinc-700 text-zinc-300 group-hover:rounded-2xl group-hover:bg-indigo-600 group-hover:text-white"}`}>
                    {w.iconUrl
                      ? <img src={w.iconUrl} alt={w.name} className="w-full h-full object-cover" />
                      : w.name[0].toUpperCase()}
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{w.name}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}

        <div className="w-8 h-px bg-zinc-700 my-1 shrink-0" />

        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className="electron-no-drag w-12 h-12 rounded-full bg-zinc-700 hover:bg-green-600 hover:rounded-2xl flex items-center justify-center cursor-pointer transition-all duration-150 text-green-400 hover:text-white shrink-0"
              onClick={createWs}
            >
              <Plus className="w-5 h-5" />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Add Workspace</p>
          </TooltipContent>
        </Tooltip>
      </nav>
    </TooltipProvider>
  );
}
