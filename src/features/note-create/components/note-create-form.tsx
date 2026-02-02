'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNoteAction } from '../actions/create-note';
import { useToast } from '@/shared/ui/toast/toast-provider';

interface NoteCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NoteCreateForm({ onSuccess, onCancel }: NoteCreateFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await createNoteAction({ title, content });

      if (result.success && result.noteId) {
        showToast('Note created successfully!', 'success');
        setTitle('');
        setContent('');
        
        if (onSuccess) {
          onSuccess();
        }
        
        setTimeout(() => {
          router.push(`/notes/${result.noteId}`);
        }, 500);
      } else {
        showToast(result.error || 'Failed to create note', 'error');
        setLoading(false);
      }
    } catch (error) {
      showToast('An error occurred while creating the note', 'error');
      setLoading(false);
    }
  };

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-2">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Enter note title..."
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none resize-y"
          placeholder="Write your note content here..."
          disabled={loading}
        />
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Creating...' : 'Create Note'}
        </button>
      </div>
    </form>
  );
}
