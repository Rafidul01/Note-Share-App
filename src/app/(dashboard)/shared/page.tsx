'use client';

import { useEffect, useState, useRef } from 'react';
import { Note } from '@/entities/note/model/note.types';
import { SharedNoteCard } from '@/entities/note/ui/shared-note-card/shared-note-card';
import { getSharedNotesAction } from '@/features/note/actions/get-shared-notes';
import { NoteDetailModal } from '@/features/note/components/note-detail-modal';
import { useNotesStore } from '@/shared/store/notes-store';
import { useToast } from '@/shared/ui/toast/toast-provider';

export default function SharedNotesPage() {
  const { showToast } = useToast();
  const { sharedNotes, sharedNotesLoading, setSharedNotes, setSharedNotesLoading, setSharedNotesError } = useNotesStore();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSharedNotes();
  }, []);

  const loadSharedNotes = async () => {
    setSharedNotesLoading(true);
    const result = await getSharedNotesAction();
    
    if (result.success && result.notes) {
      setSharedNotes(result.notes);
      setSharedNotesError(null);
    } else {
      setSharedNotesError(result.error || 'Failed to load shared notes');
      showToast(result.error || 'Failed to load shared notes', 'error');
    }
    
    setSharedNotesLoading(false);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadSharedNotes();
    setIsRefreshing(false);
    setPullDistance(0);
    showToast('Shared notes refreshed!', 'success');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || sharedNotesLoading) return;
    
    const touchY = e.touches[0].clientY;
    const distance = touchY - touchStartY.current;
    
    if (window.scrollY === 0 && distance > 0) {
      setPullDistance(Math.min(distance, 120));
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance > 80 && !isRefreshing) {
      handleRefresh();
    } else {
      setPullDistance(0);
    }
  };

  const handleViewDetails = (note: Note) => {
    setSelectedNote(note);
  };

  const handleCloseModal = () => {
    setSelectedNote(null);
  };

  const handleTagClick = (tagId: string) => {
    console.log('Tag clicked:', tagId);
    // TODO: Implement tag filtering
  };

  if (sharedNotesLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-900 dark:text-gray-100">Loading shared notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scrollContainerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative"
    >
      {/* Pull to Refresh Indicator */}
      {pullDistance > 0 && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center transition-all duration-200 z-10"
          style={{ 
            height: `${pullDistance}px`,
            opacity: pullDistance / 120
          }}
        >
          <div className="flex flex-col items-center">
            <div className={`transition-transform duration-200 ${pullDistance > 80 ? 'rotate-180' : ''}`}>
              <svg 
                className="w-6 h-6 text-blue-600 dark:text-blue-400" 
                fill="none" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {pullDistance > 80 ? 'Release to refresh' : 'Pull to refresh'}
            </p>
          </div>
        </div>
      )}

      {/* Refreshing Spinner */}
      {isRefreshing && (
        <div className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      )}

      <div style={{ marginTop: isRefreshing ? '40px' : '0px', transition: 'margin-top 0.2s' }}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Shared with Me</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Notes that others have shared with you
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {sharedNotes.length} {sharedNotes.length === 1 ? 'note' : 'notes'}
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
        <svg
          className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0"
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
          <p className="text-sm text-blue-900 dark:text-blue-200 font-medium">Read-only access</p>
          <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
            These notes are shared with you. You can view them but cannot edit or delete them.
          </p>
        </div>
      </div>

      {sharedNotes.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600"
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
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">No shared notes</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            When someone shares a note with you, it will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sharedNotes.map((note) => (
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
          isOpen={!!selectedNote}
          onClose={handleCloseModal}
          isSharedNote={true}
        />
      )}
      </div>
    </div>
  );
}
