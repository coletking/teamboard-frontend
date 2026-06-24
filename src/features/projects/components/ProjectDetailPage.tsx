import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProject } from '../services/useProjects';
import { useTasks } from '../../tasks/services/useTasks';
import { TaskBoard } from '../../tasks/components/TaskBoard';
import { AddTaskModal } from '../../tasks/components/AddTaskModal';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ErrorText } from '../../../components/ui/ErrorText';
import type { TaskStatus } from '../../../types';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const project = useProject(id);
  const tasks = useTasks(id);

  const [addStatus, setAddStatus] = useState<TaskStatus | null>(null);

  if (project.isLoading) {
    return <p className="text-slate-500">Loading project…</p>;
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
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            to="/projects"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Projects
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{project.data.name}</h1>
            <Badge tone={isAdmin ? 'indigo' : 'slate'}>
              {project.data.myRole}
            </Badge>
          </div>
          {project.data.description && (
            <p className="text-sm text-slate-500">{project.data.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Link to={`/projects/${id}/members`}>
            <Button variant="secondary">
              Members ({project.data.members.length})
            </Button>
          </Link>
          <Button onClick={() => setAddStatus('todo')}>+ Add task</Button>
        </div>
      </div>

      <section>
        {tasks.isLoading && <p className="text-slate-500">Loading tasks…</p>}
        {tasks.isError && <ErrorText>{getErrorMessage(tasks.error)}</ErrorText>}
        {tasks.data && (
          <TaskBoard
            projectId={id}
            tasks={tasks.data}
            onAddToStage={setAddStatus}
          />
        )}
      </section>

      <AddTaskModal
        projectId={id}
        open={addStatus !== null}
        initialStatus={addStatus ?? 'todo'}
        onClose={() => setAddStatus(null)}
      />
    </div>
  );
}
