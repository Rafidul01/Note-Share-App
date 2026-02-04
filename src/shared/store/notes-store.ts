import { create } from 'zustand';
import { Note } from '@/entities/note/model/note.types';

interface NotesState {
  // My Notes
  myNotes: Note[];
  myNotesLoading: boolean;
  myNotesError: string | null;
  
  // Shared Notes
  sharedNotes: Note[];
  sharedNotesLoading: boolean;
  sharedNotesError: string | null;
  
  // Actions
  setMyNotes: (notes: Note[]) => void;
  setMyNotesLoading: (loading: boolean) => void;
  setMyNotesError: (error: string | null) => void;
  
  setSharedNotes: (notes: Note[]) => void;
  setSharedNotesLoading: (loading: boolean) => void;
  setSharedNotesError: (error: string | null) => void;
  
  addNote: (note: Note) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  deleteNote: (id: string) => void;
  
  clearStore: () => void;
}

export const useNotesStore = create<NotesState>((set) => ({
  // Initial state
  myNotes: [],
  myNotesLoading: false,
  myNotesError: null,
  
  sharedNotes: [],
  sharedNotesLoading: false,
  sharedNotesError: null,
  
  // My Notes actions
  setMyNotes: (notes) => set({ myNotes: notes }),
  setMyNotesLoading: (loading) => set({ myNotesLoading: loading }),
  setMyNotesError: (error) => set({ myNotesError: error }),
  
  // Shared Notes actions
  setSharedNotes: (notes) => set({ sharedNotes: notes }),
  setSharedNotesLoading: (loading) => set({ sharedNotesLoading: loading }),
  setSharedNotesError: (error) => set({ sharedNotesError: error }),
  
  // CRUD actions
  addNote: (note) => set((state) => ({ 
    myNotes: [note, ...state.myNotes] 
  })),
  
  updateNote: (id, updates) => set((state) => ({
    myNotes: state.myNotes.map((note) =>
      note.id === id ? { ...note, ...updates } : note
    ),
  })),
  
  deleteNote: (id) => set((state) => ({
    myNotes: state.myNotes.filter((note) => note.id !== id),
  })),
  
  clearStore: () => set({
    myNotes: [],
    myNotesLoading: false,
    myNotesError: null,
    sharedNotes: [],
    sharedNotesLoading: false,
    sharedNotesError: null,
  }),
}));
