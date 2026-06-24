import { Link } from 'react-router-dom';
import { Badge } from '../../../components/ui/Badge';
import type { Project } from '../../../types';

/**
 * One project tile in the grid. Shows the member count and a delete affordance
 * (delete is only attempted by admins; the API enforces it).
 */
export function ProjectCard({
  project,
  currentUserId,
  onDelete,
}: {
  project: Project;
  currentUserId: string | undefined;
  onDelete: (project: Project) => void;
}) {
  const isAdmin = project.owner === currentUserId;

  return (
    <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div>
        <div className="flex items-center justify-between gap-2">
          <Link
            to={`/projects/${project._id}`}
            className="font-semibold text-indigo-600 hover:underline"
          >
            {project.name}
          </Link>
          {isAdmin && <Badge tone="indigo">admin</Badge>}
        </div>
        <p className="mt-1 line-clamp-2 text-sm text-slate-500">
          {project.description || 'No description'}
        </p>
      </div>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-slate-400">
          {project.members.length} member
          {project.members.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-3">
          <Link
            to={`/projects/${project._id}`}
            className="font-medium text-indigo-600 hover:underline"
          >
            Open board →
          </Link>
          {isAdmin && (
            <button
              onClick={() => onDelete(project)}
              className="font-medium text-red-600 hover:underline"
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
