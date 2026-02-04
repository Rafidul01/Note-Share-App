'use client';

import { useState, useEffect } from 'react';
import { NoteCreateModal } from '@/features/note-create/components/note-create-modal';
import { NoteDetailModal } from '@/features/note/components/note-detail-modal';
import { NoteCard } from '@/entities/note/ui/note-card/note-card';
import { Note } from '@/entities/note/model/note.types';
import { useToast } from '@/shared/ui/toast/toast-provider';
import { useNotesStore } from '@/shared/store/notes-store';
import { getNotesAction } from '@/features/note/actions/get-notes';

export default function NotesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { showToast } = useToast();
  
  // Get notes from Zustand store
  const { myNotes, myNotesLoading, setMyNotes, setMyNotesLoading, setMyNotesError } = useNotesStore();

  // Fetch notes on mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    setMyNotesLoading(true);
    const result = await getNotesAction();
    
    if (result.success && result.notes) {
      setMyNotes(result.notes);
      setMyNotesError(null);
    } else {
      setMyNotesError(result.error || 'Failed to load notes');
      showToast(result.error || 'Failed to load notes', 'error');
    }
    
    setMyNotesLoading(false);
  };

  const toggleCreateModal = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCloseDetailModal = () => {
    setSelectedNote(null);
  };

  const handleShare = (noteId: string) => {
    showToast('Share feature coming soon!', 'info');
    console.log('Share note:', noteId);
  };

  const handleTagClick = (tagId: string) => {
    showToast('Tag filter coming soon!', 'info');
    console.log('Filter by tag:', tagId);
  };

  if (myNotesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading your notes...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
      </div>

      {/* Empty State */}
      {myNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">No notes yet</h2>
          <p className="text-gray-500 mb-6">Create your first note to get started!</p>
        </div>
      )}

      {/* Notes Grid */}
      {myNotes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onClick={handleNoteClick}
              onShare={handleShare}
              onTagClick={handleTagClick}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={toggleCreateModal}
        className="fixed bottom-8 right-8 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-200 flex items-center justify-center z-40"
        aria-label={isCreateModalOpen ? "Close modal" : "Create new note"}
      >
        <svg
          className={`w-6 h-6 transition-transform duration-300 ${
            isCreateModalOpen ? 'rotate-45' : 'rotate-0'
          }`}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* Modals */}
      <NoteCreateModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)}
      />
      
      <NoteDetailModal
        note={selectedNote}
        isOpen={!!selectedNote}
        onClose={handleCloseDetailModal}
      />
    </div>
  );
}
