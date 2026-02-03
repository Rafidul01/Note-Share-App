'use client';

import { useEffect, useState } from 'react';
import { Note } from '@/entities/note/model/note.types';
import { SharedNoteCard } from '@/entities/note/ui/shared-note-card/shared-note-card';
import { getSharedNotes } from '@/features/note/actions/get-shared-notes';
import { NoteDetailModal } from '@/features/note/components/note-detail-modal';

export default function SharedNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadSharedNotes();
  }, []);

  const loadSharedNotes = async () => {
    try {
      setLoading(true);
      const sharedNotes = await getSharedNotes();
      setNotes(sharedNotes);
    } catch (error) {
      console.error('Failed to load shared notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (note: Note) => {
    setSelectedNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedNote(null);
  };

  const handleTagClick = (tagId: string) => {
    console.log('Tag clicked:', tagId);
    // TODO: Implement tag filtering
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shared with Me</h1>
          <p className="text-gray-600 mt-1">
            Notes that others have shared with you
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="text-sm text-blue-900 font-medium">Read-only access</p>
          <p className="text-sm text-blue-700 mt-1">
            These notes are shared with you. You can view them but cannot edit or delete them.
          </p>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No shared notes</h3>
          <p className="mt-1 text-sm text-gray-500">
            When someone shares a note with you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <SharedNoteCard
              key={note.id}
              note={note}
              onClick={handleViewDetails}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      )}

      {selectedNote && (
        <NoteDetailModal
          note={selectedNote}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          isSharedNote={true}
        />
      )}
    </div>
  );
}
