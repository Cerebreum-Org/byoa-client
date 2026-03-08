import { create } from "zustand";
import type { User, Workspace, Room, Message } from "@/api/client";

interface Store {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  rooms: Room[];
  activeRoom: Room | null;
  // Keyed by roomId so switching channels never wipes another room's history
  messagesByRoom: Record<string, Message[]>;

  setUser: (u: User | null) => void;
  setWorkspaces: (ws: Workspace[]) => void;
  setActiveWorkspace: (w: Workspace | null) => void;
  setRooms: (r: Room[]) => void;
  setActiveRoom: (r: Room | null) => void;
  setMessages: (roomId: string, m: Message[]) => void;
  appendMessage: (roomId: string, m: Message) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  workspaces: [],
  activeWorkspace: null,
  rooms: [],
  activeRoom: null,
  messagesByRoom: {},

  setUser: (user) => set({ user }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (activeRoom) => set({ activeRoom }),

  setMessages: (roomId, msgs) =>
    set((s) => ({ messagesByRoom: { ...s.messagesByRoom, [roomId]: msgs } })),

  appendMessage: (roomId, msg) =>
    set((s) => ({
      messagesByRoom: {
        ...s.messagesByRoom,
        [roomId]: [...(s.messagesByRoom[roomId] ?? []), msg],
      },
    })),
}));
