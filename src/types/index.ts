// Shared domain types — mirror the backend DTOs/schemas so the API contract is
// typed end-to-end. In a monorepo these would live in a shared package.

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export type ProjectRole = 'admin' | 'member';

export interface ProjectMemberRef {
  user: string;
  role: ProjectRole;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: string;
  members: ProjectMemberRef[];
  createdAt: string;
  updatedAt: string;
  /** The current user's role, attached by the API on single-project fetch. */
  myRole?: ProjectRole;
}

/** A member with full user details (from the members endpoint). */
export interface Member {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
}

export interface InviteResult {
  member: Member;
  /** True when a brand-new account was created for the invitee. */
  created: boolean;
}

export const TASK_STATUSES = ['todo', 'in_progress', 'done'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  project: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardProjectSummary {
  id: string;
  name: string;
  role: ProjectRole;
  taskCount: number;
}

export interface DashboardStats {
  projectCount: number;
  taskCount: number;
  tasksByStatus: Record<TaskStatus, number>;
  projects: DashboardProjectSummary[];
}
