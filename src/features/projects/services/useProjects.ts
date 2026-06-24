import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  projectsController,
  type ProjectPayload,
} from '../controllers/projectsController';

const LIST_KEY = ['projects'];

/** React Query hooks (the "service" layer) wrapping the projects controller. */

export function useProjects() {
  return useQuery({ queryKey: LIST_KEY, queryFn: projectsController.list });
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ['projects', id],
    queryFn: () => projectsController.get(id),
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectPayload) => projectsController.create(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => projectsController.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: LIST_KEY });
      qc.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}
