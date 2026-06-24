import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import { useDeleteTask, useUpdateTask } from '../services/useTasks';
import { TaskColumn } from './TaskColumn';
import { TaskCard } from './TaskCard';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { useState } from 'react';
import { TASK_STATUSES, type Task, type TaskStatus } from '../../../types';

/**
 * The Kanban board. Renders the three status columns and wires up drag-and-drop:
 * dropping a card on a column updates the task's status via the API.
 */
export function TaskBoard({
  projectId,
  tasks,
  onAddToStage,
}: {
  projectId: string;
  tasks: Task[];
  onAddToStage: (status: TaskStatus) => void;
}) {
  const updateTask = useUpdateTask(projectId);
  const deleteTask = useDeleteTask(projectId);
  const [toDelete, setToDelete] = useState<Task | null>(null);

  // Require a small drag distance so clicking the ✕ doesn't start a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;
    const newStatus = over.id as TaskStatus;
    const task = tasks.find((t) => t._id === active.id);
    if (!task || task.status === newStatus) return;
    updateTask.mutate({ id: task._id, payload: { status: newStatus } });
  }

  async function confirmDelete() {
    if (!toDelete) return;
    await deleteTask.mutateAsync(toDelete._id);
    setToDelete(null);
  }

  return (
    <>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="grid gap-4 md:grid-cols-3">
          {TASK_STATUSES.map((status) => {
            const columnTasks = tasks.filter((t) => t.status === status);
            return (
              <TaskColumn
                key={status}
                status={status}
                count={columnTasks.length}
                onAdd={() => onAddToStage(status)}
              >
                {columnTasks.map((task) => (
                  <TaskCard key={task._id} task={task} onDelete={setToDelete} />
                ))}
              </TaskColumn>
            );
          })}
        </div>
      </DndContext>

      <ConfirmModal
        open={Boolean(toDelete)}
        title="Delete task"
        message={`Delete "${toDelete?.title}"?`}
        loading={deleteTask.isPending}
        onConfirm={confirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
