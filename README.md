# TeamBoard — Frontend (React + Vite + TypeScript)

The web client for **TeamBoard**. Users sign up / log in, create projects, and
manage each project's tasks on a simple status board.

Pairs with the backend at
[`teamboard-backend`](https://github.com/coletking/teamboard-backend).

---

## Tech stack

| Concern          | Choice                                    |
| ---------------- | ----------------------------------------- |
| Framework        | React 19 + Vite + TypeScript              |
| Routing          | React Router v7 (protected routes)        |
| Server state     | TanStack React Query                      |
| Auth state       | React Context + JWT in `localStorage`     |
| HTTP             | axios (shared instance + interceptors)    |
| Styling          | Tailwind CSS v4                           |

---

## Project structure

Organised by **feature**. Each feature has its own `controllers/` (raw API
calls), `services/` (React Query hooks / context) and `components/` (UI, one
component per file). Shared concerns live at the top level.

```
src/
├── main.tsx
├── App.tsx                  # providers + router (public vs protected routes)
├── index.css               # Tailwind entry
├── types/                  # shared domain types mirroring the API contract
├── api/
│   ├── client.ts           # axios instance, JWT interceptor, 401 handling, tokenStore
│   └── queryClient.ts      # React Query client
├── utils/
│   └── getErrorMessage.ts  # extract a readable message from API errors
├── components/             # shared: Layout, ProtectedRoute, Modal, ConfirmModal, ui/*
└── features/
    ├── auth/               # controllers + services (AuthContext) + components
    ├── dashboard/          # controllers + services + components (stats)
    ├── projects/           # controllers + services + components (+ members, invite)
    └── tasks/              # controllers + services + components (drag-drop board)
```

See [`FILE_GUIDE.md`](./FILE_GUIDE.md) for a file-by-file explanation.

### Features

- **Dashboard** (landing page) — project/task counts, status breakdown, and a
  per-project table with your role.
- **Projects & members** — create projects; admins invite teammates by email and
  remove them; members see only their assigned projects.
- **Task board** — add tasks via a modal; **drag-and-drop** (`@dnd-kit`) between
  To Do / In Progress / Done to change status.
- **Nice modals** — a reusable `ConfirmModal` replaces `window.confirm` for all
  destructive actions.

### State management

- **Server state** (projects, tasks) is owned by **React Query** — caching,
  refetching and cache invalidation on mutations live in each feature's
  `hooks.ts`.
- **Auth/session state** lives in a small **Context** (`AuthContext`); the JWT is
  persisted to `localStorage` and the session is restored on load via
  `GET /auth/me`.

### How auth works

1. Login/signup stores the JWT and sets the user in context.
2. `lib/api.ts` attaches `Authorization: Bearer <token>` to every request.
3. A `401` response clears the token and redirects to `/login`.
4. `ProtectedRoute` guards `/` and `/projects/:id`.

---

## Getting started

### Prerequisites

- Node.js 20+ and npm
- The backend running (see its README) — by default at `http://localhost:3000`

### 1. Install

```bash
npm install
```

### 2. Configure

```bash
cp .env.example .env
```

| Variable       | Default                        | Description           |
| -------------- | ------------------------------ | --------------------- |
| `VITE_API_URL` | `http://localhost:3000/api`    | Backend API base URL  |

> Make sure the backend's `CORS_ORIGIN` allows this app's origin
> (`http://localhost:5173` in dev).

### 3. Run

```bash
npm run dev        # http://localhost:5173
```

### Build / preview

```bash
npm run build
npm run preview
```

### Docker

```bash
docker build --build-arg VITE_API_URL=http://localhost:3000/api -t teamboard-frontend .
docker run -p 8080:80 teamboard-frontend   # http://localhost:8080
```

---

## Design notes & trade-offs

- **Feature folders** keep each domain's API calls, data hooks and UI together,
  so the app scales by adding folders rather than growing shared files.
- **React Query over Redux:** the app is mostly server state; React Query removes
  most manual global-state plumbing. A small Context covers the only true client
  state (the session).
- **JWT in `localStorage`** keeps the demo simple. The production-grade
  alternative is an httpOnly refresh-token cookie + short-lived access token;
  noted as a deliberate trade-off for scope.
- **Tailwind** keeps styles co-located and the bundle lean — the brief favours a
  clean, functional UI over visual design.
