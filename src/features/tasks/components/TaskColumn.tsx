import { useDroppable } from '@dnd-kit/core';
import type { ReactNode } from 'react';
import { STATUS_LABELS, type TaskStatus } from '../../../types';

const COLUMN_ACCENT: Record<TaskStatus, string> = {
  todo: 'border-slate-300',
  in_progress: 'border-amber-300',
  done: 'border-emerald-300',
};

/** A droppable status column. Highlights while a card hovers over it. */
export function TaskColumn({
  status,
  count,
  onAdd,
  children,
}: {
  status: TaskStatus;
  count: number;
  onAdd: () => void;
  children: ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border-t-4 bg-slate-100/60 p-3 transition ${COLUMN_ACCENT[status]} ${
        isOver ? 'ring-2 ring-indigo-400' : ''
      }`}
    >
      <h3 className="mb-3 flex items-center justify-between px-1 text-sm font-semibold text-slate-700">
        <span className="flex items-center gap-2">
          {STATUS_LABELS[status]}
          <span className="rounded-full bg-white px-2 py-0.5 text-xs text-slate-500">
            {count}
          </span>
        </span>
        <button
          onClick={onAdd}
          className="rounded px-1.5 text-base leading-none text-indigo-600 hover:bg-white"
          title={`Add task to ${STATUS_LABELS[status]}`}
        >
          +
        </button>
      </h3>
      <div className="space-y-2">
        {children}
        {count === 0 && (
          <p className="px-1 py-6 text-center text-xs text-slate-400">
            Drop tasks here
          </p>
        )}
      </div>
    </div>
  );
}
