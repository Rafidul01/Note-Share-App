'use client';

import { useState } from 'react';
import { Note } from '../../model/note.types';

interface NoteCardProps {
  note: Note;
  onShare?: (noteId: string) => void;
  onTagClick?: (tagId: string) => void;
  onClick?: (note: Note) => void;
}

export function NoteCard({ note, onShare, onTagClick, onClick }: NoteCardProps) {
  const [isShareHovered, setIsShareHovered] = useState(false);

  const handleCardClick = () => {
    if (onClick) {
      onClick(note);
    }
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onShare) {
      onShare(note.id);
    }
  };

  const handleTagClick = (e: React.MouseEvent, tagId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (onTagClick) {
      onTagClick(tagId);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer"
    >
      <div className="p-5">
        {/* Header with title and share button */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex-1 line-clamp-2">
            {note.title}
          </h3>
          <button
            onClick={handleShareClick}
            onMouseEnter={() => setIsShareHovered(true)}
            onMouseLeave={() => setIsShareHovered(false)}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Share note"
          >
            <svg
              className="w-5 h-5 text-gray-600 dark:text-gray-400"
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
        </div>

        {/* Content preview */}
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
          {note.content}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {note.tags.slice(0, 4).map((tag) => (
            <button
              key={tag.id}
              onClick={(e) => handleTagClick(e, tag.id)}
              className="text-xs px-3 py-1 rounded-full transition-all hover:scale-105"
              style={{
                backgroundColor: tag.color || '#e5e7eb',
                color: '#374151',
              }}
            >
              {tag.name}
            </button>
          ))}
          {note.tags.length > 4 && (
            <span className="text-xs px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
              +{note.tags.length - 4}
            </span>
          )}
        </div>

        {/* Footer with date and shared indicator */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span>{formatDate(note.createdAt)}</span>
          {note.sharedWith && note.sharedWith.length > 0 && (
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
                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Shared with {note.sharedWith.length}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
