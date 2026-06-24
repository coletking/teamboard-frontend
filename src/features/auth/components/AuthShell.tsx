import type { ReactNode } from 'react';

export function AuthShell({
  title,
  children,
  footer,
}: {
  title: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="flex min-h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-indigo-600">TeamBoard</h1>
          <p className="mt-1 text-sm text-slate-500">{title}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {children}
        </div>
        <p className="text-center text-sm text-slate-500">{footer}</p>
      </div>
    </div>
  );
}
