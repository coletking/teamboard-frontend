import { Link, useParams } from 'react-router-dom';
import { useProject } from '../services/useProjects';
import { MembersPanel } from './MembersPanel';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { ErrorText } from '../../../components/ui/ErrorText';

export function MembersPage() {
  const { id = '' } = useParams();
  const project = useProject(id);

  if (project.isLoading) {
    return <p className="text-slate-500">Loading…</p>;
  }
  if (project.isError || !project.data) {
    return (
      <div className="space-y-3">
        <ErrorText>
          {getErrorMessage(project.error, 'Project not found')}
        </ErrorText>
        <Link
          to="/projects"
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to projects
        </Link>
      </div>
    );
  }

  const isAdmin = project.data.myRole === 'admin';

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link
          to={`/projects/${id}`}
          className="text-sm text-indigo-600 hover:underline"
        >
          ← Back to board
        </Link>
        <h1 className="mt-2 text-2xl font-bold">
          {project.data.name} — Members
        </h1>
        <p className="text-sm text-slate-500">
          {isAdmin
            ? 'Invite teammates by email and manage who has access.'
            : 'People with access to this project.'}
        </p>
      </div>

      <MembersPanel projectId={id} isAdmin={isAdmin} />
    </div>
  );
}
