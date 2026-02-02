'use client';

import { Modal } from '@/shared/ui/modal/modal';
import { NoteCreateForm } from './note-create-form';

interface NoteCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NoteCreateModal({ isOpen, onClose }: NoteCreateModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Note">
      <NoteCreateForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
}
