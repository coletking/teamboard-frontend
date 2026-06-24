import type { ReactNode } from 'react';

/** Inline error banner; renders nothing when there is no message. */
export function ErrorText({ children }: { children: ReactNode }) {
  if (!children) return null;
  return (
    <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
      {children}
    </p>
  );
}
