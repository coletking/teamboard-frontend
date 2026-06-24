import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import type { Task } from '../../../types';

export function TaskCard({
  task,
  onDelete,
}: {
  task: Task;
  onDelete: (task: Task) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: task._id, data: { status: task.status } });

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-grab touch-none rounded-lg border border-slate-200 bg-white p-3 shadow-sm active:cursor-grabbing"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        <button
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => onDelete(task)}
          className="text-xs text-slate-400 hover:text-red-600"
          title="Delete task"
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p className="mt-1 text-xs text-slate-500">{task.description}</p>
      )}
    </div>
  );
}
