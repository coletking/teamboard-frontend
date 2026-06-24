# Frontend — File-by-File Guide (for defense)

Explains **every file** in `teamboard-frontend`: what it does, why it exists, and
the concept behind it. Use it to walk a reviewer through the app.

---

## Big picture

- **React 19 + Vite + TypeScript.** Vite is the dev server/bundler; React builds
  the UI from **components**; TypeScript types the whole app.
- **Routing:** React Router v7 — public routes (`/login`, `/signup`) and
  **protected** routes behind a guard.
- **Server state:** **TanStack React Query** caches API data, refetches, and
  invalidates after mutations — so we don't hand-roll loading/error/refetch logic.
- **Auth/session state:** a small React **Context** holding the logged-in user;
  the JWT lives in `localStorage`.
- **Styling:** Tailwind CSS v4 (utility classes).

### Folder convention (the structure you asked for)

```
api/                      # the shared HTTP client (axios) + React Query client
utils/                    # generic helpers (non-component)
components/               # general/shared components (Layout, Modal, ui/*)
features/<feature>/
  controllers/            # raw API-call logic for that feature
  services/               # React Query hooks / context (business logic)
  components/             # that feature's UI — ONE component per file
```

Each feature owns its `controllers` (calls), `services` (hooks) and `components`
(UI). This keeps related code together and makes a feature easy to find, extend
or remove. Every component file exports exactly one component.

### Data-flow in one line

`component → service (React Query hook) → controller (axios call) → api/client →
backend`, and the response flows back as typed data the component renders.

---

## Entry & routing

| File | What it does |
| ---- | ------------ |
| `index.html` | The single HTML page Vite serves; contains the `#root` div React mounts into. |
| `src/main.tsx` | Mounts `<App />` into `#root` and imports the global stylesheet. |
| `src/index.css` | Tailwind entry (`@import 'tailwindcss'`) plus a few base styles. |
| `src/App.tsx` | Sets up the **providers** (`QueryClientProvider`, `BrowserRouter`, `AuthProvider`) and declares the **routes**: public `/login` `/signup`; protected `/` (dashboard), `/projects`, `/projects/:id` nested under `ProtectedRoute` + `Layout`. |
| `src/vite.config.ts` | Vite config — enables the React and Tailwind plugins. |

---

## API & utils

| File | What it does |
| ---- | ------------ |
| `src/api/client.ts` | The **single axios instance** (`apiClient`) every controller uses. Adds a request interceptor that attaches the JWT, and a response interceptor that logs the user out on a 401. Also exports `tokenStore` (localStorage wrapper for the token). |
| `src/api/queryClient.ts` | Creates the React Query client with sensible defaults (retry once, no refetch on window focus, 30s stale time). |
| `src/utils/getErrorMessage.ts` | Extracts a human-readable message from an axios/API error (handles the array of validation messages NestJS can return). |
| `src/types/index.ts` | **Shared domain types** (`User`, `Project`, `Member`, `Task`, `DashboardStats`, role/status enums) mirroring the backend contract, so the whole app is typed end-to-end. |

---

## Shared components

| File | What it does |
| ---- | ------------ |
| `src/components/Layout.tsx` | The app shell for logged-in pages: top bar with brand, nav (Dashboard / Projects), the user's name and a log-out button, plus an `<Outlet />` for the routed page. |
| `src/components/ProtectedRoute.tsx` | Route guard. While the session is restoring it shows "Loading…"; if there's no user it redirects to `/login`; otherwise it renders the child route. |
| `src/components/Modal.tsx` | Generic modal shell: dims the background, closes on Escape or backdrop click, centers content. Composed by other modals. |
| `src/components/ConfirmModal.tsx` | The **nice delete confirmation** (replaces `window.confirm`). Reused for deleting projects/tasks and removing members. |
| `src/components/ui/Button.tsx` | Themed button with `primary` / `secondary` / `danger` variants. |
| `src/components/ui/Input.tsx` | Styled text input. |
| `src/components/ui/Textarea.tsx` | Styled multiline input. |
| `src/components/ui/Field.tsx` | Label + control wrapper for consistent form layout. |
| `src/components/ui/ErrorText.tsx` | Inline red error banner (renders nothing when empty). |
| `src/components/ui/Badge.tsx` | Small rounded label used for roles, counts and status. |

---

## Auth feature (`src/features/auth/`)

| File | What it does |
| ---- | ------------ |
| `controllers/authController.ts` | Raw API calls: `signup`, `login`, `me`. No React here. |
| `services/AuthContext.tsx` | `AuthProvider` holds the session: on load it restores the user from the token via `/auth/me`; exposes `login`, `signup`, `logout`. `useAuth()` reads the context. |
| `components/AuthShell.tsx` | The centered card layout shared by login & signup. |
| `components/LoginPage.tsx` | Login form; on success stores the token and navigates home. |
| `components/SignupPage.tsx` | Signup form; same flow as login. |

---

## Dashboard feature (`src/features/dashboard/`)

| File | What it does |
| ---- | ------------ |
| `controllers/dashboardController.ts` | API call for `GET /dashboard`. |
| `services/useDashboard.ts` | React Query hook returning the stats. |
| `components/StatCard.tsx` | A single metric tile (label + big number). |
| `components/DashboardPage.tsx` | The landing page after login: headline stat cards (projects, total tasks, per-status counts) and a per-project table showing your role and task count. |

---

## Projects feature (`src/features/projects/`)

| File | What it does |
| ---- | ------------ |
| `controllers/projectsController.ts` | API calls for projects **and** members (list/get/create/update/delete, plus listMembers/invite/removeMember). |
| `services/useProjects.ts` | React Query hooks for projects: list, single, create, delete (invalidates the list and the dashboard). |
| `services/useMembers.ts` | React Query hooks for members: list, invite, remove. |
| `components/ProjectsPage.tsx` | Projects list page: the new-project form, a grid of project cards, and a `ConfirmModal` for deletion. |
| `components/NewProjectForm.tsx` | Inline form to create a project (creator becomes admin). |
| `components/ProjectCard.tsx` | One project tile: name, description, member count, and admin-only delete. |
| `components/ProjectDetailPage.tsx` | A project's page: header with your role badge, an "Add task" button, the drag-and-drop board, and the members sidebar. |
| `components/MembersPanel.tsx` | Lists members with their roles; for admins shows the invite form and remove buttons (owner can't be removed). |
| `components/InviteMemberForm.tsx` | Admin-only invite-by-email form; shows a notice (incl. the default password) when a new account is created. |

---

## Tasks feature (`src/features/tasks/`)

| File | What it does |
| ---- | ------------ |
| `controllers/tasksController.ts` | API calls for tasks (list/create/update/delete). |
| `services/useTasks.ts` | React Query hooks for tasks; mutations invalidate the project's task list and the dashboard. |
| `components/TaskBoard.tsx` | The Kanban board. Wraps the columns in a `@dnd-kit` `DndContext`; on drag-end it updates the dragged task's `status` to the column it was dropped on. Also owns the delete-confirm modal. |
| `components/TaskColumn.tsx` | A droppable status column (To Do / In Progress / Done) that highlights when a card hovers over it. |
| `components/TaskCard.tsx` | A draggable task card (via `useDraggable`); the whole card is the drag handle, with a ✕ to delete. |
| `components/AddTaskModal.tsx` | Modal form to add a task into a chosen stage (defaults to To Do). |

---

## Key concepts a reviewer may ask about

- **Why React Query over Redux?** The app is mostly **server** state; React Query
  gives caching, refetching and cache invalidation for free. The only true client
  state (the session) lives in a small Context.
- **How does drag-and-drop work?** `@dnd-kit`: columns are droppables keyed by
  status, cards are draggables; dropping a card fires an update mutation that
  PATCHes the task's status. A small drag-distance threshold keeps the ✕ button
  clickable.
- **How is access enforced in the UI?** The project detail fetch returns
  `myRole`; admin-only controls (invite, remove, project delete) are gated on it —
  but the **backend** is the real authority (members get 403).
- **Why the controllers/services/components split?** Controllers isolate HTTP,
  services isolate data/cache logic, components stay presentational — each layer is
  swappable and testable on its own.
- **How is auth wired?** Token in `localStorage`; an axios interceptor attaches it
  to every request and redirects to `/login` on 401; `ProtectedRoute` guards pages.
