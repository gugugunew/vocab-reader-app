import React from 'react';
import { Book, Folder } from '../types';

interface FolderItemProps {
  folder: Folder;
  booksInFolder: Book[];
  isEditing: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenFolder: (folderId: string) => void;
  onOpenActions: (e: React.MouseEvent, folderId: string) => void;
  isLast?: boolean;
}

export const FolderItem: React.FC<FolderItemProps> = ({
  folder,
  booksInFolder,
  isEditing,
  isSelected,
  onToggleSelect,
  onOpenFolder,
  onOpenActions,
  isLast = false,
}) => {
  const count = booksInFolder.length;
  const fourCovers = booksInFolder.slice(0, 4);

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      onToggleSelect(folder.id);
    } else {
      onOpenFolder(folder.id);
    }
  };

  return (
    <article
      id={`folder-item-${folder.id}`}
      onClick={handleClick}
      className={`py-3 flex items-center justify-between transition-colors cursor-pointer select-none ${
        isLast ? '' : 'border-b border-gray-100/90'
      } active:bg-black/[0.02]`}
    >
      <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-2">
        {/* Edit mode selection circle */}
        {isEditing && (
          <button
            type="button"
            id={`folder-select-${folder.id}`}
            aria-label={isSelected ? `取消选择分组 ${folder.name}` : `选择分组 ${folder.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(folder.id);
            }}
            className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-transform active:scale-95 ${
              isSelected
                ? 'bg-[#3B82F6] text-white'
                : 'border-2 border-gray-300 bg-transparent'
            }`}
          >
            {isSelected && (
              <svg
                className="w-3.5 h-3.5 stroke-current stroke-[2.5]"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  d="M4.5 12.75l6 6 9-13.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        )}

        {/* Folder icon or 2x2 grid preview */}
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-[#F2F2F7] flex-shrink-0 shadow-sm border border-gray-100/80 flex items-center justify-center relative">
          {count > 0 ? (
            <div className="w-full h-full grid grid-cols-2 gap-0.5 p-0.5">
              {fourCovers.map((b, idx) => (
                <img
                  key={idx}
                  src={b.coverUrl}
                  alt={`封面 ${idx + 1}`}
                  className="w-full h-full object-cover rounded-[3px]"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              ))}
              {/* Fill remaining with soft tone if less than 4 */}
              {Array.from({ length: Math.max(0, 4 - fourCovers.length) }).map((_, idx) => (
                <div key={idx} className="w-full h-full bg-gray-200/60 rounded-[3px]" />
              ))}
            </div>
          ) : (
            <svg
              className="w-6 h-6 text-red-500 stroke-[1.8]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h3.379c.427 0 .837-.169 1.14-.47l1.06-1.06a1.688 1.688 0 011.14-.47H19.5A2.25 2.25 0 0121.75 10v2.75m-19.5 0A2.25 2.25 0 004.5 15h15a2.25 2.25 0 002.25-2.25m-19.5 0v5.25A2.25 2.25 0 004.5 20.25h15a2.25 2.25 0 002.25-2.25v-5.25"
              />
            </svg>
          )}
        </div>

        {/* Name and count */}
        <div className="min-w-0 pr-2">
          <h3 className="text-[15px] font-bold text-gray-900 truncate">
            {folder.name}
          </h3>
          <p className="text-[12px] text-gray-400 mt-0.5">
            {count}项内容
          </p>
        </div>
      </div>

      {/* Right controls */}
      {isEditing ? (
        <div
          className="flex-shrink-0 text-gray-400 pr-1 cursor-grab"
          data-purpose="reorder-handle"
          aria-label="拖拽排序"
        >
          <svg className="w-6 h-6 stroke-current stroke-2" fill="none" viewBox="0 0 24 24">
            <path d="M3.75 9h16.5m-16.5 6h16.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <button
          type="button"
          id={`folder-menu-btn-${folder.id}`}
          aria-label={`更多分组操作: ${folder.name}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenActions(e, folder.id);
          }}
          className="p-2 text-gray-400 hover:text-gray-600 active:text-gray-900 flex-shrink-0 transition-colors"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="1.7" />
            <circle cx="12" cy="12" r="1.7" />
            <circle cx="19" cy="12" r="1.7" />
          </svg>
        </button>
      )}
    </article>
  );
};
