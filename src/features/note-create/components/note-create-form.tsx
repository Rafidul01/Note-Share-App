'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNoteAction } from '../actions/create-note';
import { useToast } from '@/shared/ui/toast/toast-provider';
import { useNotesStore } from '@/shared/store/notes-store';

interface NoteCreateFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function NoteCreateForm({ onSuccess, onCancel }: NoteCreateFormProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const addNote = useNotesStore((state) => state.addNote);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setLoading(true);

    try {
      const result = await createNoteAction({ title, content, tags });

      if (result.success && result.note) {
        showToast('Note created successfully!', 'success');
        
        // Add note to store immediately (no page reload needed)
        addNote(result.note);
        
        // Reset form
        setTitle('');
        setContent('');
        setTags([]);
        setLoading(false);
        
        if (onSuccess) {
          onSuccess();
        }
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
        <label htmlFor="title" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
          placeholder="Enter note title..."
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Content
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none resize-y"
          placeholder="Write your note content here..."
          disabled={loading}
        />
      </div>

      <div>
        <label htmlFor="tags" className="block text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">
          Tags (Optional)
        </label>
        <div className="flex gap-2 mb-2">
          <input
            id="tags"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                  setTags([...tags, tagInput.trim()]);
                  setTagInput('');
                }
              }
            }}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
            placeholder="Type a tag and press Enter..."
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => {
              if (tagInput.trim() && !tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()]);
                setTagInput('');
              }
            }}
            disabled={loading || !tagInput.trim()}
            className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            Add
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => setTags(tags.filter((_, i) => i !== index))}
                  className="hover:text-blue-600 dark:hover:text-blue-400"
                  disabled={loading}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 justify-end">
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-6 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
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
