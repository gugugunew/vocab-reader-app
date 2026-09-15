export type MetricType = 'word' | 'sentence';

export interface Book {
  id: string;
  title: string;
  coverUrl: string;
  isTrial?: boolean;
  metricType: MetricType;
  currentCount: number;
  totalCount: number;
  isCustomImport?: boolean;
  folderId?: string | null;
  isPinned?: boolean;
  createdAt: number;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: number;
}

export interface WordItem {
  id: string;
  index: string;
  word: string;
  phonetic: string;
  pos: string;
  definition: string;
  status: 'learning' | 'familiar';
  isStarred: boolean;
  note?: {
    text: string;
    updatedAt: string;
  };
}

export type VocabFilterTab = 'pending' | 'familiar' | 'starred' | 'notes';
export type VocabMaskMode = 'both' | 'mask-cn' | 'mask-en';
export type VocabSortMode = 'original' | 'alphabetical' | 'random';

export type SortOrder = 'time' | 'name';
export type ContentFilter = 'all' | 'sentence' | 'word' | 'explore' | 'custom';

export interface PopoverPosition {
  top: number;
  right: number;
}

export type ActiveModal = 
  | { type: 'top-menu' }
  | { type: 'filter-menu' }
  | { type: 'book-actions'; bookId: string; position?: PopoverPosition }
  | { type: 'folder-actions'; folderId: string; position?: PopoverPosition }
  | { type: 'delete-confirm' }
  | { type: 'add-to-folder' }
  | { type: 'rename-item'; itemType: 'book' | 'folder'; id: string; currentName: string }
  | { type: 'new-folder' }
  | { type: 'vocab-filter-menu' }
  | { type: 'vocab-settings-menu' }
  | null;
