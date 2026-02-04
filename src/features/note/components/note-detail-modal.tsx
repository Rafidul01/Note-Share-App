'use client';

import { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/modal/modal';
import { Note } from '@/entities/note/model/note.types';
import { useToast } from '@/shared/ui/toast/toast-provider';
import { useNotesStore } from '@/shared/store/notes-store';
import { deleteNoteAction } from '@/features/note-delete/actions/delete-note';
import { updateNoteAction } from '@/features/note-edit/actions/update-note';
import { shareNoteAction } from '@/features/note-share/actions/share-note';
import { revokeAccessAction } from '@/features/note-share/actions/revoke-access';
import { searchUsersAction } from '@/features/note-share/actions/search-users';

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
  isSharedNote?: boolean;
}

export function NoteDetailModal({ note: initialNote, isOpen, onClose, isSharedNote = false }: NoteDetailModalProps) {
  const { showToast } = useToast();
  const deleteNote = useNotesStore((state) => state.deleteNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const myNotes = useNotesStore((state) => state.myNotes);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmail, setShareEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [userSuggestions, setUserSuggestions] = useState<Array<{ uid: string; email: string; displayName: string }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Get the latest note from store
  const note = initialNote ? myNotes.find(n => n.id === initialNote.id) || initialNote : null;
  
  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTagInput, setEditTagInput] = useState('');
  const [editTags, setEditTags] = useState<string[]>([]);

  // Initialize edit form when note changes or editing starts
  useEffect(() => {
    if (note && isEditing) {
      setEditTitle(note.title);
      setEditContent(note.content);
      setEditTags(note.tags.map(tag => tag.name));
    }
  }, [note, isEditing]);

  if (!note) return null;

  const handleShare = () => {
    setShowShareModal(true);
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
    if (!note || !shareEmail.trim()) {
      showToast('Please enter an email address', 'error');
      return;
    }

    setIsSharing(true);

    try {
      const result = await shareNoteAction(note.id, shareEmail.trim());

      if (result.success) {
        showToast('Note shared successfully!', 'success');
        setShareEmail('');
        setShowShareModal(false);
        setUserSuggestions([]);
        setShowSuggestions(false);
        // Refresh the note to show updated sharedWith list
        // The store will be updated when user closes and reopens the modal
      } else {
        showToast(result.error || 'Failed to share note', 'error');
      }
    } catch (error) {
      showToast('An error occurred while sharing the note', 'error');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRevokeAccess = async (userUid: string) => {
    if (!note) return;

    try {
      const result = await revokeAccessAction(note.id, userUid);

      if (result.success) {
        // Update the note in store to remove the user from sharedWith
        const updatedSharedWith = note.sharedWith.filter(u => u.uid !== userUid);
        updateNote(note.id, { sharedWith: updatedSharedWith });
        showToast('Access revoked successfully!', 'success');
      } else {
        showToast(result.error || 'Failed to revoke access', 'error');
      }
    } catch (error) {
      showToast('An error occurred while revoking access', 'error');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditTags(note.tags.map(tag => tag.name));
  };

  const handleSaveEdit = async () => {
    if (!editTitle.trim() || !editContent.trim()) {
      showToast('Title and content are required', 'error');
      return;
    }

    setIsSaving(true);

    try {
      const result = await updateNoteAction({
        id: note.id,
        title: editTitle,
        content: editContent,
        tags: editTags,
      });

      if (result.success) {
        // Update the note in the store
        updateNote(note.id, {
          title: editTitle,
          content: editContent,
          tags: editTags.map((tagName, index) => ({
            id: note.tags[index]?.id || `temp-${index}`,
            name: tagName,
            color: note.tags[index]?.color || '#BFDBFE',
            userId: note.owner.uid,
            createdAt: note.tags[index]?.createdAt || new Date(),
          })),
          updatedAt: new Date(),
        });
        
        showToast('Note updated successfully!', 'success');
        setIsEditing(false);
      } else {
        showToast(result.error || 'Failed to update note', 'error');
      }
    } catch (error) {
      showToast('An error occurred while updating the note', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddEditTag = () => {
    if (editTagInput.trim() && !editTags.includes(editTagInput.trim())) {
      setEditTags([...editTags, editTagInput.trim()]);
      setEditTagInput('');
    }
  };

  const handleRemoveEditTag = (index: number) => {
    setEditTags(editTags.filter((_, i) => i !== index));
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!note) return;

    setIsDeleting(true);
    
    try {
      const result = await deleteNoteAction(note.id);
      
      if (result.success) {
        deleteNote(note.id);
        showToast('Note deleted successfully!', 'success');
        setShowDeleteConfirm(false);
        onClose();
      } else {
        showToast(result.error || 'Failed to delete note', 'error');
      }
    } catch (error) {
      showToast('An error occurred while deleting the note', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  const handleAddTag = () => {
    showToast('Add tag feature coming soon!', 'info');
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <div className="space-y-6">
        {/* Header with actions */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="text-2xl sm:text-3xl font-bold text-gray-900 w-full border-b-2 border-blue-500 focus:outline-none"
              placeholder="Note title..."
            />
          ) : (
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex-1">{note.title}</h1>
          )}
          {!isSharedNote && !isEditing && (
            <div className="flex gap-2 self-end sm:self-start">
              <button
                onClick={handleEdit}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Edit note"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                title="Share note"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                title="Delete note"
              >
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Metadata */}
        {!isEditing && (
          <div className="flex items-center gap-4 text-sm text-gray-500 pb-4 border-b">
            <div className="flex items-center gap-1">
              <svg
                className="w-4 h-4"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Created {formatDate(note.createdAt)}</span>
            </div>
            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
              <div className="flex items-center gap-1">
                <span>• Updated {formatDate(note.updatedAt)}</span>
              </div>
            )}
          </div>
        )}

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
          </div>
          {isEditing ? (
            <div>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={editTagInput}
                  onChange={(e) => setEditTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddEditTag();
                    }
                  }}
                  className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                  placeholder="Type a tag and press Enter..."
                />
                <button
                  type="button"
                  onClick={handleAddEditTag}
                  disabled={!editTagInput.trim()}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50 transition-colors"
                >
                  Add
                </button>
              </div>
              {editTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {editTags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveEditTag(index)}
                        className="hover:text-blue-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {note.tags.length > 0 ? (
                note.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-3 py-1.5 rounded-full text-sm font-medium transition-all hover:scale-105 cursor-pointer"
                    style={{
                      backgroundColor: tag.color || '#e5e7eb',
                      color: '#374151',
                    }}
                  >
                    {tag.name}
                  </span>
                ))
              ) : (
                <p className="text-sm text-gray-500 italic">No tags yet</p>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Content</h3>
          {isEditing ? (
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              rows={10}
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none resize-y"
              placeholder="Write your note content here..."
            />
          ) : (
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {note.content}
              </p>
            </div>
          )}
        </div>

        {/* Images Section */}
        {!isEditing && note.images && note.images.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">Images</h3>
            <div className="grid grid-cols-2 gap-3">
              {note.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Note image ${index + 1}`}
                  className="rounded-lg w-full h-48 object-cover"
                />
              ))}
            </div>
          </div>
        )}

        {/* Shared With Section */}
        {!isEditing && !isSharedNote && note.sharedWith && note.sharedWith.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Shared With ({note.sharedWith.length})
            </h3>
            <div className="space-y-2">
              {note.sharedWith.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">
                      {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {user.displayName || 'Unknown User'}
                    </p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <button
                    className="text-xs text-red-600 hover:text-red-700"
                    onClick={() => handleRevokeAccess(user.uid)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner Info */}
        {!isEditing && (
          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              {isSharedNote ? 'Shared by' : 'Created by'}{' '}
              <span className="font-medium">{note.owner.displayName || note.owner.email}</span>
            </p>
          </div>
        )}

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-3 justify-end pt-4 border-t">
            <button
              onClick={handleCancelEdit}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Note</h3>
            <p className="text-sm text-gray-600 mb-4">
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
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
                disabled={isSharing}
                autoComplete="off"
              />
              
              {/* Autocomplete Suggestions */}
              {showSuggestions && userSuggestions.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {userSuggestions.map((user) => (
                    <button
                      key={user.uid}
                      onClick={() => handleSelectUser(user.email)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-medium text-blue-600">
                            {user.displayName?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          {user.displayName && (
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {user.displayName}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
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
                  setShowShareModal(false);
                  setShareEmail('');
                  setUserSuggestions([]);
                  setShowSuggestions(false);
                }}
                disabled={isSharing}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Note</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Are you sure you want to delete "{note.title}"? This action cannot be undone.
                </p>
                <div className="flex gap-3 justify-end">
                  <button
                    onClick={cancelDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={confirmDelete}
                    disabled={isDeleting}
                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
