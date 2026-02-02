'use client';

import { useRouter } from 'next/navigation';
import { NoteCreateForm } from '@/features/note-create/components/note-create-form';

export default function NewNotePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/notes');
  };

  const handleSuccess = () => {
    // The form already handles navigation to the note detail page
    // So we don't need to do anything here
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Note</h1>
      <NoteCreateForm onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  );
}
