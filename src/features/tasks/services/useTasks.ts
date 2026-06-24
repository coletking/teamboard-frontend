import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  tasksController,
  type CreateTaskPayload,
  type UpdateTaskPayload,
} from '../controllers/tasksController';

const tasksKey = (projectId: string) => ['projects', projectId, 'tasks'];

export function useTasks(projectId: string) {
  return useQuery({
    queryKey: tasksKey(projectId),
    queryFn: () => tasksController.listForProject(projectId),
    enabled: Boolean(projectId),
  });
}

export function useCreateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayload) =>
      tasksController.create(projectId, payload),
    onSuccess: () => invalidate(qc, projectId),
  });
}

export function useUpdateTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      tasksController.update(id, payload),
    onSuccess: () => invalidate(qc, projectId),
  });
}

export function useDeleteTask(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksController.remove(id),
    onSuccess: () => invalidate(qc, projectId),
  });
}

function invalidate(
  qc: ReturnType<typeof useQueryClient>,
  projectId: string,
): void {
  qc.invalidateQueries({ queryKey: tasksKey(projectId) });
  qc.invalidateQueries({ queryKey: ['dashboard'] });
}
