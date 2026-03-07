/**
 * BYOA API client — talks to the BYOA backend
 */

const BASE = "/api";

async function req<T>(method: string, path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : {},
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error ?? "Request failed");
  }
  return res.status === 204 ? (undefined as T) : res.json();
}

export const api = {
  // Auth
  signup: (data: { email: string; username: string; displayName: string; password: string }) =>
    req<{ user: User }>("POST", "/auth/signup", data),
  login: (data: { email: string; password: string }) =>
    req<{ user: User }>("POST", "/auth/login", data),
  logout: () => req<void>("POST", "/auth/logout"),
  me: () => req<User>("GET", "/auth/me"),

  // Workspaces
  getWorkspaces: () => req<Workspace[]>("GET", "/workspaces"),
  createWorkspace: (name: string) => req<Workspace>("POST", "/workspaces", { name }),

  // Rooms
  getRooms: (workspaceId: string) => req<Room[]>("GET", `/workspaces/${workspaceId}/rooms`),
  createRoom: (workspaceId: string, name: string) =>
    req<Room>("POST", `/workspaces/${workspaceId}/rooms`, { name }),

  // Messages
  getMessages: (roomId: string) => req<Message[]>("GET", `/rooms/${roomId}/messages`),

  // Agents
  getAgents: () => req<Agent[]>("GET", "/agents"),
  createAgent: (data: { name: string; webhookUrl: string; capabilities: string[] }) =>
    req<Agent>("POST", "/agents", data),
};

// Types
export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  iconUrl: string | null;
}

export interface Room {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
}

export interface Message {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderType: "user" | "agent";
  content: string;
  createdAt: string;
}

export interface Agent {
  id: string;
  name: string;
  webhookUrl: string;
  capabilities: string[];
  apiKey: string;
  active: boolean;
}
