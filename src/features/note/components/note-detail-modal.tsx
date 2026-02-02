'use client';

import { useState } from 'react';
import { Modal } from '@/shared/ui/modal/modal';
import { Note } from '@/entities/note/model/note.types';
import { useToast } from '@/shared/ui/toast/toast-provider';

interface NoteDetailModalProps {
  note: Note | null;
  isOpen: boolean;
  onClose: () => void;
}

export function NoteDetailModal({ note, isOpen, onClose }: NoteDetailModalProps) {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);

  if (!note) return null;

  const handleShare = () => {
    showToast('Share feature coming soon!', 'info');
  };

  const handleEdit = () => {
    setIsEditing(true);
    showToast('Edit feature coming soon!', 'info');
  };

  const handleDelete = () => {
    showToast('Delete feature coming soon!', 'info');
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
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900 flex-1">{note.title}</h1>
          <div className="flex gap-2">
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
              className="p-2 rounded-lg hover:bg-red-50 transition-colors"
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
        </div>

        {/* Metadata */}
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

        {/* Tags Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">Tags</h3>
            <button
              onClick={handleAddTag}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Tag
            </button>
          </div>
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
        </div>

        {/* Content */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Content</h3>
          <div className="prose max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {note.content}
            </p>
          </div>
        </div>

        {/* Images Section */}
        {note.images && note.images.length > 0 && (
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
        {note.sharedWith && note.sharedWith.length > 0 && (
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
                    onClick={() => showToast('Revoke access coming soon!', 'info')}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Owner Info */}
        <div className="pt-4 border-t">
          <p className="text-xs text-gray-500">
            Created by <span className="font-medium">{note.owner.displayName || note.owner.email}</span>
          </p>
        </div>
      </div>
    </Modal>
  );
}
