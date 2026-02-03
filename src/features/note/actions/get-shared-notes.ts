'use server';

import { Note } from '@/entities/note/model/note.types';

// Fake data for notes shared with the current user
const FAKE_SHARED_NOTES: Note[] = [
  {
    id: 's1',
    title: 'Team Project Documentation',
    content: 'Architecture overview: Microservices with Next.js frontend, Node.js backend, PostgreSQL database. API Gateway handles authentication. Redis for caching. Deploy on AWS ECS.',
    images: [],
    tags: [
      { id: 't15', name: 'Work', color: '#DBEAFE', userId: 'u2', createdAt: new Date('2024-01-10') },
      { id: 't16', name: 'Documentation', color: '#E0E7FF', userId: 'u2', createdAt: new Date('2024-01-10') },
    ],
    owner: {
      id: 'u2',
      uid: 'u2',
      email: 'colleague@example.com',
      displayName: 'Jane Smith',
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      {
        id: 'u1',
        uid: 'u1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
  },
  {
    id: 's2',
    title: 'Birthday Party Planning',
    content: 'Date: March 15th, 7 PM. Venue: The Garden Restaurant. Guest list: 25 people. Menu: Italian buffet. Cake: chocolate with vanilla frosting. Decorations: blue and gold theme.',
    images: [],
    tags: [
      { id: 't17', name: 'Event', color: '#FCE7F3', userId: 'u3', createdAt: new Date('2024-01-12') },
      { id: 't18', name: 'Planning', color: '#FEF3C7', userId: 'u3', createdAt: new Date('2024-01-12') },
    ],
    owner: {
      id: 'u3',
      uid: 'u3',
      email: 'partner@example.com',
      displayName: 'Alex Johnson',
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      {
        id: 'u1',
        uid: 'u1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
      {
        id: 'u4',
        uid: 'u4',
        email: 'friend@example.com',
        displayName: 'Mike Wilson',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: 's3',
    title: 'Research Paper References',
    content: 'Key papers: "Deep Learning" by LeCun et al. (2015), "Attention Is All You Need" by Vaswani et al. (2017). Datasets: ImageNet, COCO, MS MARCO. Tools: PyTorch, TensorFlow, Hugging Face.',
    images: [],
    tags: [
      { id: 't19', name: 'Research', color: '#E0E7FF', userId: 'u2', createdAt: new Date('2024-01-14') },
      { id: 't20', name: 'AI', color: '#D1FAE5', userId: 'u2', createdAt: new Date('2024-01-14') },
      { id: 't21', name: 'Academic', color: '#FEE2E2', userId: 'u2', createdAt: new Date('2024-01-14') },
    ],
    owner: {
      id: 'u2',
      uid: 'u2',
      email: 'colleague@example.com',
      displayName: 'Jane Smith',
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      {
        id: 'u1',
        uid: 'u1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: 's4',
    title: 'Grocery Shopping List',
    content: 'Produce: tomatoes, lettuce, avocados, bananas, apples. Dairy: milk, cheese, yogurt. Meat: chicken breast, ground beef. Pantry: pasta, rice, olive oil, canned beans. Snacks: chips, cookies.',
    images: [],
    tags: [
      { id: 't22', name: 'Shopping', color: '#FEF3C7', userId: 'u3', createdAt: new Date('2024-01-26') },
      { id: 't23', name: 'Home', color: '#FCE7F3', userId: 'u3', createdAt: new Date('2024-01-26') },
    ],
    owner: {
      id: 'u3',
      uid: 'u3',
      email: 'partner@example.com',
      displayName: 'Alex Johnson',
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      {
        id: 'u1',
        uid: 'u1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    ],
    createdAt: new Date('2024-01-26'),
    updatedAt: new Date('2024-01-27'),
  },
  {
    id: 's5',
    title: 'Movie Recommendations',
    content: 'Must watch: Inception, The Shawshank Redemption, Interstellar, The Dark Knight, Pulp Fiction. Recent favorites: Everything Everywhere All at Once, Oppenheimer, Dune Part Two.',
    images: [],
    tags: [
      { id: 't24', name: 'Entertainment', color: '#FCE7F3', userId: 'u4', createdAt: new Date('2024-01-30') },
      { id: 't25', name: 'Movies', color: '#DBEAFE', userId: 'u4', createdAt: new Date('2024-01-30') },
    ],
    owner: {
      id: 'u4',
      uid: 'u4',
      email: 'friend@example.com',
      displayName: 'Mike Wilson',
      photoURL: undefined,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
    },
    sharedWith: [
      {
        id: 'u1',
        uid: 'u1',
        email: 'user@example.com',
        displayName: 'John Doe',
        photoURL: undefined,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
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
    createdAt: new Date('2024-01-30'),
    updatedAt: new Date('2024-02-01'),
  },
];

export async function getSharedNotes(): Promise<Note[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  return FAKE_SHARED_NOTES;
}
