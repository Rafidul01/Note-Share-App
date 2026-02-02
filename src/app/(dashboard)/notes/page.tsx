'use client';

import { useState } from 'react';
import { NoteCreateModal } from '@/features/note-create/components/note-create-modal';
import { NoteDetailModal } from '@/features/note/components/note-detail-modal';
import { NoteCard } from '@/entities/note/ui/note-card/note-card';
import { Note } from '@/entities/note/model/note.types';
import { useToast } from '@/shared/ui/toast/toast-provider';

// Fake data for testing
const FAKE_NOTES: Note[] = [
  {
    id: '1',
    title: 'Meeting Notes - Q1 Planning',
    content: 'Discussed quarterly goals, budget allocation, and team expansion plans. Key decisions: hire 2 developers, increase marketing budget by 20%, launch new product feature by March.',
    images: [],
    tags: [
      { id: 't1', name: 'Work', color: '#DBEAFE', userId: 'u1', createdAt: new Date('2024-01-15') },
      { id: 't2', name: 'Important', color: '#FEE2E2', userId: 'u1', createdAt: new Date('2024-01-15') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      { 
        id: 'u2', 
        uid: 'u2', 
        email: 'colleague@example.com', 
        displayName: 'Jane Smith', 
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    title: 'Recipe: Chocolate Chip Cookies',
    content: '2 cups flour, 1 cup butter, 1 cup sugar, 2 eggs, 1 tsp vanilla, 2 cups chocolate chips. Bake at 350°F for 12 minutes. Best cookies ever!',
    images: [],
    tags: [
      { id: 't3', name: 'Recipe', color: '#FEF3C7', userId: 'u1', createdAt: new Date('2024-01-20') },
      { id: 't4', name: 'Personal', color: '#E0E7FF', userId: 'u1', createdAt: new Date('2024-01-20') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [],
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    title: 'Book Ideas',
    content: 'Story about a time traveler who accidentally changes history. Main character: Sarah, a physicist. Setting: 2050 and 1920s. Conflict: must fix timeline without erasing herself.',
    images: [],
    tags: [
      { id: 't5', name: 'Creative', color: '#FCE7F3', userId: 'u1', createdAt: new Date('2024-01-22') },
      { id: 't6', name: 'Writing', color: '#D1FAE5', userId: 'u1', createdAt: new Date('2024-01-22') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [],
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-01-22'),
  },
  {
    id: '4',
    title: 'Travel Plans - Japan 2024',
    content: 'Tokyo (5 days): Shibuya, Akihabara, teamLab. Kyoto (4 days): temples, bamboo forest, geisha district. Osaka (2 days): street food, castle. Budget: $3000. Book flights by Feb.',
    images: [],
    tags: [
      { id: 't7', name: 'Travel', color: '#DBEAFE', userId: 'u1', createdAt: new Date('2024-01-25') },
      { id: 't8', name: 'Personal', color: '#E0E7FF', userId: 'u1', createdAt: new Date('2024-01-25') },
      { id: 't9', name: '2024', color: '#FEF3C7', userId: 'u1', createdAt: new Date('2024-01-25') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      { 
        id: 'u3', 
        uid: 'u3', 
        email: 'partner@example.com', 
        displayName: 'Alex Johnson', 
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '5',
    title: 'Workout Routine',
    content: 'Monday: Chest & Triceps. Wednesday: Back & Biceps. Friday: Legs & Shoulders. Cardio: 20 min after each session. Goal: lose 10 lbs by March.',
    images: [],
    tags: [
      { id: 't10', name: 'Fitness', color: '#D1FAE5', userId: 'u1', createdAt: new Date('2024-01-28') },
      { id: 't11', name: 'Health', color: '#FEE2E2', userId: 'u1', createdAt: new Date('2024-01-28') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [],
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-01-28'),
  },
  {
    id: '6',
    title: 'Project Ideas - Side Hustle',
    content: 'AI-powered meal planner app. Features: dietary restrictions, budget tracking, grocery list generation, recipe suggestions. Tech stack: Next.js, OpenAI API, Supabase.',
    images: [],
    tags: [
      { id: 't12', name: 'Business', color: '#DBEAFE', userId: 'u1', createdAt: new Date('2024-02-01') },
      { id: 't13', name: 'Tech', color: '#E0E7FF', userId: 'u1', createdAt: new Date('2024-02-01') },
      { id: 't14', name: 'Ideas', color: '#FCE7F3', userId: 'u1', createdAt: new Date('2024-02-01') },
    ],
    owner: { 
      id: 'u1', 
      uid: 'u1', 
      email: 'user@example.com', 
      displayName: 'John Doe', 
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [],
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

export default function NotesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const { showToast } = useToast();

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Notes</h1>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {FAKE_NOTES.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onClick={handleNoteClick}
            onShare={handleShare}
            onTagClick={handleTagClick}
          />
        ))}
      </div>

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
