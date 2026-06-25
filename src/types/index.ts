export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
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

  myRole?: ProjectRole;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: ProjectRole;
}

export interface InviteResult {
  member: Member;

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
