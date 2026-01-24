import Link from 'next/link';
import { Note } from '../../model/note.types';
import { formatDate } from '@/shared/lib/utils';

interface NoteCardProps {
  note: Note;
}

export function NoteCard({ note }: NoteCardProps) {
  return (
    <Link href={`/notes/${note.id}`}>
      <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow">
        <h3 className="font-semibold text-lg mb-2">{note.title}</h3>
        <p className="text-gray-600 text-sm line-clamp-3">{note.content}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            {note.tags.slice(0, 3).map((tag) => (
              <span
                key={tag.id}
                className="text-xs px-2 py-1 rounded"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
          <span className="text-xs text-gray-500">
            {formatDate(note.createdAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
