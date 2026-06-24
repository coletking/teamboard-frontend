import { apiClient } from '../../../api/client';
import type { Member, InviteResult, Project } from '../../../types';

export interface ProjectPayload {
  name: string;
  description?: string;
}

export const projectsController = {
  list: () => apiClient.get<Project[]>('/projects').then((r) => r.data),

  get: (id: string) =>
    apiClient.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (payload: ProjectPayload) =>
    apiClient.post<Project>('/projects', payload).then((r) => r.data),

  update: (id: string, payload: Partial<ProjectPayload>) =>
    apiClient.patch<Project>(`/projects/${id}`, payload).then((r) => r.data),

  remove: (id: string) =>
    apiClient.delete(`/projects/${id}`).then((r) => r.data),

  listMembers: (projectId: string) =>
    apiClient
      .get<Member[]>(`/projects/${projectId}/members`)
      .then((r) => r.data),

  invite: (projectId: string, email: string) =>
    apiClient
      .post<InviteResult>(`/projects/${projectId}/members`, { email })
      .then((r) => r.data),

  removeMember: (projectId: string, userId: string) =>
    apiClient
      .delete(`/projects/${projectId}/members/${userId}`)
      .then((r) => r.data),
};
