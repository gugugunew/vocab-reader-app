import React from 'react';
import { Book } from '../types';

interface BookItemProps {
  book: Book;
  isEditing: boolean;
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  onOpenActions: (e: React.MouseEvent, bookId: string) => void;
  onClickItem?: (book: Book) => void;
  isLast?: boolean;
}

export const BookItem: React.FC<BookItemProps> = ({
  book,
  isEditing,
  isSelected,
  onToggleSelect,
  onOpenActions,
  onClickItem,
  isLast = false,
}) => {
  const metricLabel = book.metricType === 'word' ? '单词' : '句子';

  const handleClick = (e: React.MouseEvent) => {
    if (isEditing) {
      e.stopPropagation();
      onToggleSelect(book.id);
    } else if (onClickItem) {
      onClickItem(book);
    }
  };

  return (
    <article
      id={`book-item-${book.id}`}
      onClick={handleClick}
      className={`py-3.5 flex items-center justify-between transition-colors cursor-pointer select-none ${
        isLast ? '' : 'border-b border-gray-100/90'
      } active:bg-black/[0.02]`}
    >
      <div className="flex items-center space-x-3.5 min-w-0 flex-1 pr-2">
        {/* Edit mode selection circle */}
        {isEditing && (
          <button
            type="button"
            id={`book-select-${book.id}`}
            aria-label={isSelected ? `取消选择 ${book.title}` : `选择 ${book.title}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(book.id);
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

        {/* Pure artwork book cover */}
        <div className="relative w-14 h-18 aspect-[3/4] rounded-xl overflow-hidden flex-shrink-0 shadow-[0_4px_12px_rgba(0,0,0,0.12)] bg-neutral-100">
          <img
            src={book.coverUrl}
            alt={book.title}
            className="w-full h-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {isEditing && !isSelected && (
            <div className="absolute inset-0 bg-white/20 pointer-events-none" />
          )}
        </div>

        {/* Text information */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
            <h2 className="text-[16px] font-bold text-gray-900 truncate tracking-tight">
              {book.title}
            </h2>
            {book.isTrial && (
              <span className="flex-shrink-0 whitespace-nowrap text-[10px] font-medium bg-rose-50 text-rose-500 border border-rose-100 px-1.5 py-0.5 rounded-full leading-none">
                试读版
              </span>
            )}
            {book.isPinned && (
              <span className="flex-shrink-0 whitespace-nowrap text-[10px] font-medium bg-blue-50 text-blue-600 border border-blue-100 px-1.5 py-0.5 rounded-full leading-none">
                置顶
              </span>
            )}
          </div>

          <div className="text-[13px] text-gray-400 font-normal mt-1 leading-snug">
            {metricLabel} {book.currentCount}/{book.totalCount}
          </div>

          {book.isCustomImport && (
            <div className="text-xs text-neutral-400 font-normal mt-0.5">
              自定义导入
            </div>
          )}
        </div>
      </div>

      {/* Right side controls: drag handle in edit mode, three dots in normal mode */}
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
          id={`book-menu-btn-${book.id}`}
          aria-label={`更多书籍操作: ${book.title}`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenActions(e, book.id);
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
