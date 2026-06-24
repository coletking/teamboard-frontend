import { Link } from 'react-router-dom';
import { useDashboard } from '../services/useDashboard';
import { useAuth } from '../../auth/services/AuthContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { StatCard } from './StatCard';
import { Badge } from '../../../components/ui/Badge';
import { ErrorText } from '../../../components/ui/ErrorText';
import { STATUS_LABELS, type TaskStatus } from '../../../types';

const STATUS_ACCENT: Record<TaskStatus, string> = {
  todo: 'text-slate-700',
  in_progress: 'text-amber-600',
  done: 'text-emerald-600',
};

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useDashboard();

  if (isLoading) return <p className="text-slate-500">Loading dashboard…</p>;
  if (isError) return <ErrorText>{getErrorMessage(error)}</ErrorText>;
  if (!data) return null;

  const statuses = Object.keys(STATUS_LABELS) as TaskStatus[];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {user?.name} 👋</h1>
        <p className="text-sm text-slate-500">
          Here's a snapshot of your projects and tasks.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Projects"
          value={data.projectCount}
          accent="text-indigo-600"
        />
        <StatCard label="Total tasks" value={data.taskCount} />
        {statuses.map((s) => (
          <StatCard
            key={s}
            label={STATUS_LABELS[s]}
            value={data.tasksByStatus[s]}
            accent={STATUS_ACCENT[s]}
          />
        ))}
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold">Your projects</h2>
        {data.projects.length === 0 ? (
          <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500">
            No projects yet.{' '}
            <Link
              to="/projects"
              className="font-medium text-indigo-600 hover:underline"
            >
              Create one →
            </Link>
          </p>
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-4 py-2 font-medium">Project</th>
                  <th className="px-4 py-2 font-medium">Role</th>
                  <th className="px-4 py-2 font-medium">Tasks</th>
                  <th className="px-4 py-2"></th>
                </tr>
              </thead>
              <tbody>
                {data.projects.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {p.name}
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={p.role === 'admin' ? 'indigo' : 'slate'}>
                        {p.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{p.taskCount}</td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/projects/${p.id}`}
                        className="font-medium text-indigo-600 hover:underline"
                      >
                        Open →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
