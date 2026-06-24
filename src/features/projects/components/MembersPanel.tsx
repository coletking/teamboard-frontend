import { useState } from 'react';
import { useMembers, useRemoveMember } from '../services/useMembers';
import { useAuth } from '../../auth/services/AuthContext';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { InviteMemberForm } from './InviteMemberForm';
import { Badge } from '../../../components/ui/Badge';
import { ConfirmModal } from '../../../components/ConfirmModal';
import { ErrorText } from '../../../components/ui/ErrorText';
import type { Member } from '../../../types';

export function MembersPanel({
  projectId,
  isAdmin,
}: {
  projectId: string;
  isAdmin: boolean;
}) {
  const { user } = useAuth();
  const { data: members, isLoading, isError, error } = useMembers(projectId);
  const removeMember = useRemoveMember(projectId);
  const [toRemove, setToRemove] = useState<Member | null>(null);

  async function confirmRemove() {
    if (!toRemove) return;
    await removeMember.mutateAsync(toRemove.id);
    setToRemove(null);
  }

  return (
    <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="font-semibold">Members</h2>

      {isLoading && <p className="text-sm text-slate-500">Loading members…</p>}
      {isError && <ErrorText>{getErrorMessage(error)}</ErrorText>}

      <ul className="space-y-2">
        {members?.map((m) => (
          <li
            key={m.id}
            className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2"
          >
            <div>
              <p className="text-sm font-medium text-slate-800">
                {m.name}
                {m.id === user?.id && (
                  <span className="ml-1 text-xs text-slate-400">(you)</span>
                )}
              </p>
              <p className="text-xs text-slate-500">{m.email}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone={m.role === 'admin' ? 'indigo' : 'slate'}>
                {m.role}
              </Badge>
              {isAdmin && m.role !== 'admin' && (
                <button
                  onClick={() => setToRemove(m)}
                  className="text-xs font-medium text-red-600 hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>

      {isAdmin && (
        <div className="border-t border-slate-100 pt-4">
          <InviteMemberForm projectId={projectId} />
        </div>
      )}

      <ConfirmModal
        open={Boolean(toRemove)}
        title="Remove member"
        message={`Remove ${toRemove?.name} from this project?`}
        confirmLabel="Remove"
        loading={removeMember.isPending}
        onConfirm={confirmRemove}
        onClose={() => setToRemove(null)}
      />
    </div>
  );
}
