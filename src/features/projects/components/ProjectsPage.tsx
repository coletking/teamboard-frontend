import { useState } from 'react';
import { useDeleteProject, useProjects } from '../services/useProjects';
import { useAuth } from '../../auth/services/AuthContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { NewProjectForm } from './NewProjectForm';
import { ProjectCard } from './ProjectCard';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ErrorText } from '../../../components/ui/ErrorText';
import type { Project } from '../../../types';

export function ProjectsPage() {
  const { user } = useAuth();
  const { data: projects, isLoading, isError, error } = useProjects();
  const deleteProject = useDeleteProject();
  const [toDelete, setToDelete] = useState<Project | null>(null);

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteProject.mutateAsync(toDelete._id);
    setToDelete(null);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Projects</h1>
        <p className="text-sm text-slate-500">
          Create a project, invite teammates, then manage tasks together.
        </p>
      </div>

      <NewProjectForm />

      <section className="space-y-3">
        {isLoading && <p className="text-slate-500">Loading projects…</p>}
        {isError && <ErrorText>{getErrorMessage(error)}</ErrorText>}
        {projects && projects.length === 0 && (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No projects yet. Create your first one above.
          </p>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {projects?.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              currentUserId={user?.id}
              onDelete={setToDelete}
            />
          ))}
        </div>
      </section>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete project"
        message={`Delete "${toDelete?.name}" and all of its tasks? This cannot be undone.`}
        loading={deleteProject.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </div>
  );
}
