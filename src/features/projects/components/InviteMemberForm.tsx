import { useState, type FormEvent } from 'react';
import { useInviteMember } from '../services/useMembers';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { ErrorText } from '../../../components/ui/ErrorText';

/**
 * Admin-only form to invite a teammate by email. Surfaces a notice with the
 * default password when a brand-new account is created for the invitee.
 */
export function InviteMemberForm({ projectId }: { projectId: string }) {
  const invite = useInviteMember(projectId);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setNotice('');
    try {
      const result = await invite.mutateAsync(email);
      setEmail('');
      setNotice(
        result.created
          ? `Invited ${result.member.email}. A new account was created — they can log in with the default password (TeamBoard123!).`
          : `Added ${result.member.email} to the project.`,
      );
    } catch (err) {
      setError(getErrorMessage(err, 'Could not invite user'));
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <ErrorText>{error}</ErrorText>
      {notice && (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {notice}
        </p>
      )}
      <div className="flex gap-2">
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="teammate@example.com"
        />
        <Button type="submit" disabled={invite.isPending}>
          {invite.isPending ? 'Inviting…' : 'Invite'}
        </Button>
      </div>
    </form>
  );
}
