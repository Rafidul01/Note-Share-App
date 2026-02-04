'use client';

import { useState, useEffect, useRef } from 'react';
import { NoteCreateModal } from '@/features/note-create/components/note-create-modal';
import { NoteDetailModal } from '@/features/note/components/note-detail-modal';
import { NoteCard } from '@/entities/note/ui/note-card/note-card';
import { Note } from '@/entities/note/model/note.types';
import { useToast } from '@/shared/ui/toast/toast-provider';
import { useNotesStore } from '@/shared/store/notes-store';
import { getNotesAction } from '@/features/note/actions/get-notes';
import { shareNoteAction } from '@/features/note-share/actions/share-note';
import { searchUsersAction } from '@/features/note-share/actions/search-users';

export default function NotesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [shareNoteId, setShareNoteId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<Array<{ uid: string; email: string; displayName: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
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

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadNotes();
    setIsRefreshing(false);
    setPullDistance(0);
    showToast('Notes refreshed!', 'success');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isRefreshing || myNotesLoading) return;
    
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
    setShareNoteId(noteId);
    setShareEmail('');
    setUserSuggestions([]);
    setShowSuggestions(false);
  };

  const handleSearchUsers = async (query: string) => {
    setShareEmail(query);
    
    if (query.length < 2) {
      setUserSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    
    try {
      const result = await searchUsersAction(query);
      
      if (result.success && result.users) {
        setUserSuggestions(result.users);
        setShowSuggestions(result.users.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectUser = (email: string) => {
    setShareEmail(email);
    setShowSuggestions(false);
    setUserSuggestions([]);
  };

  const handleShareSubmit = async () => {
    if (!shareNoteId || !shareEmail.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    setIsSharing(true);

    try {
      const result = await shareNoteAction(shareNoteId, shareEmail.trim());

      if (result.success) {
        showToast('Note shared successfully!', 'success');
        setShareNoteId(null);
        setShareEmail('');
        setUserSuggestions([]);
        setShowSuggestions(false);
      } else {
        showToast(result.error || 'Failed to share note', 'error');
      }
    } catch (error) {
      showToast('An error occurred while sharing the note', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleTagClick = (tagId: string) => {
    showToast('Tag filter coming soon!', 'info');
    console.log('Filter by tag:', tagId);
  };

  if (myNotesLoading && !isRefreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-900 dark:text-gray-100">Loading your notes...</div>
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
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Notes</h1>
      </div>

      {/* Empty State */}
      {myNotes.length === 0 && (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
          <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No notes yet</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Create your first note to get started!</p>
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

      {/* Share Modal */}
      {shareNoteId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Share Note</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Enter the email address of the person you want to share this note with.
            </p>
            <div className="relative mb-4">
              <input
                type="email"
                value={shareEmail}
                onChange={(e) => handleSearchUsers(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !showSuggestions) {
                    handleShareSubmit();
                  }
                }}
                onFocus={() => {
                  if (userSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                placeholder="user@example.com"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-4 py-2 focus:border-blue-500 focus:outline-none"
                disabled={isSharing}
                autoComplete="off"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && userSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
                  {userSuggestions.map((user) => (
                    <button
                      key={user.uid}
                      onClick={() => handleSelectUser(user.email)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600 dark:text-blue-300">
                            {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {user.displayName && (
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {user.displayName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              
              {isSearching && (
                <div className="absolute right-3 top-3">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShareNoteId(null);
                  setShareEmail('');
                  setUserSuggestions([]);
                  setShowSuggestions(false);
                }}
                disabled={isSharing}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleShareSubmit}
                disabled={isSharing || !shareEmail.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isSharing ? 'Sharing...' : 'Share'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
