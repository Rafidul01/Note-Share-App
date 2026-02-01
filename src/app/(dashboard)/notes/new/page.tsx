import { NoteCreateForm } from '@/features/note-create/components/note-create-form';

export default function NewNotePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>
      <NoteCreateForm />
    </div>
  );
}
