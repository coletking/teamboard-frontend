import { useState, type FormEvent } from 'react';
import { useCreateTask } from '../services/useTasks';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Modal } from '../../../components/Modal';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Field } from '../../../components/ui/Field';
import { ErrorText } from '../../../components/ui/ErrorText';
import { STATUS_LABELS, TASK_STATUSES, type TaskStatus } from '../../../types';

/** Modal form to add a task; the task lands in the chosen stage (default To Do). */
export function AddTaskModal({
  projectId,
  open,
  onClose,
}: {
  projectId: string;
  open: boolean;
  onClose: () => void;
}) {
  const createTask = useCreateTask(projectId);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createTask.mutateAsync({ title, description, status });
      setTitle('');
      setDescription('');
      setStatus('todo');
      onClose();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create task'));
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <ErrorText>{error}</ErrorText>
        <Field label="Title">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            minLength={2}
            placeholder="e.g. Design homepage"
            autoFocus
          />
        </Field>
        <Field label="Description (optional)">
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </Field>
        <Field label="Stage">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? 'Adding…' : 'Add task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
