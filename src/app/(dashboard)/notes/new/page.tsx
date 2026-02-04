'use client';

import { useRouter } from 'next/navigation';
import { NoteCreateForm } from '@/features/note-create/components/note-create-form';

export default function NewNotePage() {
  const router = useRouter();

  const handleCancel = () => {
    router.push('/notes');
  };

  const handleSuccess = () => {
    // Navigate back to notes list after successful creation
    router.push('/notes');
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100">Create New Note</h1>
      <NoteCreateForm onCancel={handleCancel} onSuccess={handleSuccess} />
    </div>
  );
}
