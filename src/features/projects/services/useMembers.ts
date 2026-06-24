import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsController } from '../controllers/projectsController';

const membersKey = (projectId: string) => ['projects', projectId, 'members'];

export function useMembers(projectId: string) {
  return useQuery({
    queryKey: membersKey(projectId),
    queryFn: () => projectsController.listMembers(projectId),
    enabled: Boolean(projectId),
  });
}

export function useInviteMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => projectsController.invite(projectId, email),
    onSuccess: () => qc.invalidateQueries({ queryKey: membersKey(projectId) }),
  });
}

export function useRemoveMember(projectId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) =>
      projectsController.removeMember(projectId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: membersKey(projectId) }),
  });
}
