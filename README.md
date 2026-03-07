# byoa-client

> BYOA front-end — Discord-like UI wired to the BYOA backend.
> Forked from Stoat (formerly Revolt), stripped to UI primitives, rewired to the BYOA API.

**License: AGPL-3.0** (inherited from Stoat fork)

## Stack

- Vite + React 19
- Zustand (state)
- Native WebSockets (real-time)
- BYOA API (`/api/*` proxied to backend)

## Dev

```bash
# Start the backend first (from ../byoa)
cd ../byoa && pnpm dev

# Then the client
npm install
npm run dev
# → http://localhost:5173
```

## How it connects to the backend

`vite.config.ts` proxies all `/api` and `/ws` requests to `http://localhost:3000` (the BYOA backend). In production, put both behind the same nginx/Cloudflare.
