'use client';

import { Note } from '../../model/note.types';

interface SharedNoteCardProps {
  note: Note;
  onTagClick?: (tagId: string) => void;
  onClick?: (note: Note) => void;
}

export function SharedNoteCard({ note, onTagClick, onClick }: SharedNoteCardProps) {
  const handleCardClick = () => {
    if (onClick) {
      onClick(note);
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
        {/* Header with title (no share button) */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 flex-1 line-clamp-2">
            {note.title}
          </h3>
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

        {/* Footer with date and owner info */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-gray-700">
          <span>{formatDate(note.createdAt)}</span>
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
              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span>{note.owner.displayName || note.owner.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
