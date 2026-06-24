import { useState, type FormEvent } from 'react';
import { useCreateProject } from '../services/useProjects';
import { getErrorMessage } from '../../../utils/getErrorMessage';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Field } from '../../../components/ui/Field';
import { ErrorText } from '../../../components/ui/ErrorText';

/** Inline form to create a new project (creator becomes its admin). */
export function NewProjectForm() {
  const createProject = useCreateProject();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    try {
      await createProject.mutateAsync({ name, description });
      setName('');
      setDescription('');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create project'));
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <h2 className="font-semibold">New project</h2>
      <ErrorText>{error}</ErrorText>
      <Field label="Name">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          placeholder="e.g. Website Redesign"
        />
      </Field>
      <Field label="Description (optional)">
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="What is this project about?"
        />
      </Field>
      <Button type="submit" disabled={createProject.isPending}>
        {createProject.isPending ? 'Creating…' : 'Create project'}
      </Button>
    </form>
  );
}
