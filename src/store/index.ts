import { create } from "zustand";
import type { User, Workspace, Room, Message } from "@/api/client";

interface Store {
  user: User | null;
  workspaces: Workspace[];
  activeWorkspace: Workspace | null;
  rooms: Room[];
  activeRoom: Room | null;
  messages: Message[];

  setUser: (u: User | null) => void;
  setWorkspaces: (ws: Workspace[]) => void;
  setActiveWorkspace: (w: Workspace | null) => void;
  setRooms: (r: Room[]) => void;
  setActiveRoom: (r: Room | null) => void;
  setMessages: (m: Message[]) => void;
  appendMessage: (m: Message) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  workspaces: [],
  activeWorkspace: null,
  rooms: [],
  activeRoom: null,
  messages: [],

  setUser: (user) => set({ user }),
  setWorkspaces: (workspaces) => set({ workspaces }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  setRooms: (rooms) => set({ rooms }),
  setActiveRoom: (activeRoom) => set({ activeRoom }),
  setMessages: (messages) => set({ messages }),
  appendMessage: (m) => set((s) => ({ messages: [...s.messages, m] })),
}));
