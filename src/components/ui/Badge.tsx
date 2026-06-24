import type { ReactNode } from 'react';

type Tone = 'indigo' | 'slate' | 'amber' | 'emerald';

const TONES: Record<Tone, string> = {
  indigo: 'bg-indigo-100 text-indigo-700',
  slate: 'bg-slate-100 text-slate-600',
  amber: 'bg-amber-100 text-amber-700',
  emerald: 'bg-emerald-100 text-emerald-700',
};

/** Small rounded label used for roles, counts, status, etc. */
export function Badge({
  tone = 'slate',
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}
