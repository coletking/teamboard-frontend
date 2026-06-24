import { apiClient } from '../../../api/client';
import type { Task, TaskStatus } from '../../../types';

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
}

/** Raw HTTP calls for tasks. */
export const tasksController = {
  listForProject: (projectId: string) =>
    apiClient.get<Task[]>(`/projects/${projectId}/tasks`).then((r) => r.data),

  create: (projectId: string, payload: CreateTaskPayload) =>
    apiClient
      .post<Task>(`/projects/${projectId}/tasks`, payload)
      .then((r) => r.data),

  update: (id: string, payload: UpdateTaskPayload) =>
    apiClient.patch<Task>(`/tasks/${id}`, payload).then((r) => r.data),

  remove: (id: string) => apiClient.delete(`/tasks/${id}`).then((r) => r.data),
};
