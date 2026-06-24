import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useProject } from '../services/useProjects';
import { useTasks } from '../../tasks/services/useTasks';
import { TaskBoard } from '../../tasks/components/TaskBoard';
import { AddTaskModal } from '../../tasks/components/AddTaskModal';
import { MembersPanel } from './MembersPanel';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { ErrorText } from '../../../components/ui/ErrorText';

export function ProjectDetailPage() {
  const { id = '' } = useParams();
  const project = useProject(id);
  const tasks = useTasks(id);
  const [addOpen, setAddOpen] = useState(false);

  if (project.isLoading) {
    return <p className="text-slate-500">Loading project…</p>;
  }
  if (project.isError || !project.data) {
    return (
      <div className="space-y-3">
        <ErrorText>{getErrorMessage(project.error, 'Project not found')}</ErrorText>
        <Link to="/projects" className="text-sm text-indigo-600 hover:underline">
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
          <Link to="/projects" className="text-sm text-indigo-600 hover:underline">
            ← Projects
          </Link>
          <div className="mt-2 flex items-center gap-2">
            <h1 className="text-2xl font-bold">{project.data.name}</h1>
            <Badge tone={isAdmin ? 'indigo' : 'slate'}>{project.data.myRole}</Badge>
          </div>
          {project.data.description && (
            <p className="text-sm text-slate-500">{project.data.description}</p>
          )}
        </div>
        <Button onClick={() => setAddOpen(true)}>+ Add task</Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* Board */}
        <section>
          {tasks.isLoading && <p className="text-slate-500">Loading tasks…</p>}
          {tasks.isError && <ErrorText>{getErrorMessage(tasks.error)}</ErrorText>}
          {tasks.data && <TaskBoard projectId={id} tasks={tasks.data} />}
        </section>

        {/* Members sidebar */}
        <aside>
          <MembersPanel projectId={id} isAdmin={isAdmin} />
        </aside>
      </div>

      <AddTaskModal
        projectId={id}
        open={addOpen}
        onClose={() => setAddOpen(false)}
      />
    </div>
  );
}
