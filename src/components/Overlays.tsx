import React, { useState } from 'react';
import { ActiveModal, Book, Folder, SortOrder, ContentFilter } from '../types';

interface OverlaysProps {
  activeModal: ActiveModal;
  onClose: () => void;
  // Options state
  sortOrder: SortOrder;
  onSelectSort: (order: SortOrder) => void;
  contentFilter: ContentFilter;
  onSelectFilter: (filter: ContentFilter) => void;
  // Action triggers
  onStartEdit: () => void;
  onOpenNewFolder: () => void;
  onConfirmDelete: () => void;
  deleteCountText: string;
  // Folder actions
  folders: Folder[];
  books: Book[];
  onAddToFolder: (folderId: string) => void;
  // Rename
  onSaveRename: (newName: string) => void;
  onCreateFolder: (name: string) => void;
  // Book actions
  targetBook?: Book;
  onTogglePinBook?: (bookId: string) => void;
  onExportBook?: (book: Book) => void;
  onOpenVocabulary?: (book: Book) => void;
  onDeleteSingleBook?: (bookId: string) => void;
  // Folder single actions
  targetFolder?: Folder;
  onDeleteSingleFolder?: (folderId: string) => void;
}

export const Overlays: React.FC<OverlaysProps> = ({
  activeModal,
  onClose,
  sortOrder,
  onSelectSort,
  contentFilter,
  onSelectFilter,
  onStartEdit,
  onOpenNewFolder,
  onConfirmDelete,
  deleteCountText,
  folders,
  books,
  onAddToFolder,
  onSaveRename,
  onCreateFolder,
  targetBook,
  onTogglePinBook,
  onExportBook,
  onOpenVocabulary,
  onDeleteSingleBook,
  targetFolder,
  onDeleteSingleFolder,
}) => {
  const [renameInput, setRenameInput] = useState('');
  const [newFolderName, setNewFolderName] = useState('');

  if (!activeModal) return null;

  // Lightweight iOS blur backdrop: zero layout shift
  const renderBackdrop = (onClick = onClose) => (
    <div
      id="modal-backdrop"
      onClick={onClick}
      className="fixed inset-0 bg-black/20 z-40 transition-opacity"
      style={{ WebkitTapHighlightColor: 'transparent' }}
    />
  );

  return (
    <>
      {/* 1. Library Top Popover Menu (Master Component PopoverMenu) */}
      {activeModal.type === 'top-menu' && (
        <>
          {renderBackdrop()}
          <div
            id="top-popover-menu"
            className="fixed top-[68px] right-4 z-50 w-[218px] bg-white/95 backdrop-blur-2xl border border-black/[0.06] rounded-[20px] shadow-[0_12px_36px_rgba(0,0,0,0.14)] overflow-hidden text-[15px] select-none py-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          >
            {/* Section 1: Management */}
            <div className="py-0.5">
              <button
                type="button"
                id="menu-action-select"
                onClick={() => {
                  onClose();
                  onStartEdit();
                }}
                className="w-full px-4 py-2.5 text-gray-900 active:bg-gray-100/70 transition-colors cursor-pointer font-normal flex items-center justify-between text-left"
              >
                <span>选择</span>
              </button>
              <button
                type="button"
                id="menu-action-new-folder"
                onClick={() => {
                  onClose();
                  onOpenNewFolder();
                }}
                className="w-full px-4 py-2.5 text-gray-900 active:bg-gray-100/70 transition-colors cursor-pointer font-normal flex items-center justify-between text-left"
              >
                <span>新建分组</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-[0.5px] bg-gray-200/80 mx-3 my-0.5" />

            {/* Section 2: Sorting */}
            <div className="py-0.5">
              <button
                type="button"
                id="menu-sort-time"
                onClick={() => {
                  onSelectSort('time');
                  onClose();
                }}
                className="w-full px-4 py-2 text-gray-900 active:bg-gray-100/70 transition-colors cursor-pointer flex items-center justify-between text-left"
              >
                <div>
                  <div className="font-normal leading-snug">按时间</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 leading-none font-normal">
                    最新排在最前
                  </div>
                </div>
                {sortOrder === 'time' && (
                  <svg className="w-4 h-4 text-gray-900 stroke-[2.4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              <button
                type="button"
                id="menu-sort-name"
                onClick={() => {
                  onSelectSort('name');
                  onClose();
                }}
                className="w-full px-4 py-2 text-gray-900 active:bg-gray-100/70 transition-colors cursor-pointer flex items-center justify-between text-left"
              >
                <div>
                  <div className="font-normal leading-snug">按名称</div>
                  <div className="text-[11px] text-gray-400 mt-0.5 leading-none font-normal">A-Z</div>
                </div>
                {sortOrder === 'name' && (
                  <svg className="w-4 h-4 text-gray-900 stroke-[2.4] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 2. Filter Popover Menu */}
      {activeModal.type === 'filter-menu' && (
        <>
          {renderBackdrop()}
          <div
            id="filter-popover-menu"
            className="fixed top-[68px] right-14 z-50 w-56 bg-white/95 backdrop-blur-2xl rounded-[20px] border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.14)] py-1.5 animate-in fade-in zoom-in-95 duration-150 origin-top-right select-none"
          >
            {/* Group 1: All */}
            <div className="px-1.5 pt-0.5 pb-1">
              <button
                type="button"
                id="filter-opt-all"
                onClick={() => {
                  onSelectFilter('all');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] text-neutral-900 font-medium hover:bg-neutral-100/80 active:bg-neutral-100 transition"
              >
                <span>全部</span>
                {contentFilter === 'all' && (
                  <svg className="w-4 h-4 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            <div className="my-1 border-t border-black/[0.06] mx-2" />

            {/* Group 2: Content Type */}
            <div className="px-3.5 pt-1 pb-1">
              <span className="text-[11px] font-semibold text-neutral-400 tracking-wider">
                内容类型
              </span>
            </div>
            <div className="space-y-0.5 px-1.5">
              <button
                type="button"
                id="filter-opt-sentence"
                onClick={() => {
                  onSelectFilter('sentence');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] text-neutral-800 font-normal hover:bg-neutral-100/80 active:bg-neutral-100 transition"
              >
                <span>句子</span>
                {contentFilter === 'sentence' && (
                  <svg className="w-4 h-4 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                id="filter-opt-word"
                onClick={() => {
                  onSelectFilter('word');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] text-neutral-800 font-normal hover:bg-neutral-100/80 active:bg-neutral-100 transition"
              >
                <span>单词</span>
                {contentFilter === 'word' && (
                  <svg className="w-4 h-4 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            <div className="my-1 border-t border-black/[0.06] mx-2" />

            {/* Group 3: Source */}
            <div className="px-3.5 pt-1 pb-1">
              <span className="text-[11px] font-semibold text-neutral-400 tracking-wider">
                书籍来源
              </span>
            </div>
            <div className="space-y-0.5 px-1.5 pb-1">
              <button
                type="button"
                id="filter-opt-explore"
                onClick={() => {
                  onSelectFilter('explore');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] text-neutral-800 font-normal hover:bg-neutral-100/80 active:bg-neutral-100 transition"
              >
                <span>探索书籍</span>
                {contentFilter === 'explore' && (
                  <svg className="w-4 h-4 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                id="filter-opt-custom"
                onClick={() => {
                  onSelectFilter('custom');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-[14px] text-neutral-800 font-normal hover:bg-neutral-100/80 active:bg-neutral-100 transition"
              >
                <span>自定义导入</span>
                {contentFilter === 'custom' && (
                  <svg className="w-4 h-4 text-black stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* 3. Single Book Contextual Popover */}
      {activeModal.type === 'book-actions' && targetBook && (
        <>
          {renderBackdrop()}
          <div
            id="book-actions-popover"
            style={{
              top: activeModal.position ? Math.min(activeModal.position.top + 10, window.innerHeight - 300) : 180,
              right: activeModal.position ? Math.max(16, window.innerWidth - activeModal.position.right - 20) : 24,
            }}
            className="fixed z-50 w-52 bg-white/95 backdrop-blur-2xl rounded-2xl border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.15)] p-1.5 flex flex-col select-none animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          >
            <div className="flex flex-col">
              <button
                type="button"
                id="action-pin-book"
                onClick={() => {
                  if (onTogglePinBook) onTogglePinBook(targetBook.id);
                  onClose();
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                {targetBook.isPinned ? '取消置顶' : '置顶书籍'}
              </button>
              <button
                type="button"
                id="action-view-vocab"
                onClick={() => {
                  if (onOpenVocabulary) onOpenVocabulary(targetBook);
                  onClose();
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                查看词表
              </button>
            </div>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            <div className="flex flex-col">
              <button
                type="button"
                id="action-move-to-group"
                onClick={() => {
                  onClose();
                  onAddToFolder(targetBook.folderId || '');
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                添加到分组...
              </button>
              <button
                type="button"
                id="action-rename-book"
                onClick={() => {
                  onClose();
                  onSaveRename(targetBook.title);
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                重命名书籍
              </button>
              <button
                type="button"
                id="action-export-book"
                onClick={() => {
                  if (onExportBook) onExportBook(targetBook);
                  onClose();
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors"
              >
                导出书籍
              </button>
            </div>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            <div className="flex flex-col">
              <button
                type="button"
                id="action-delete-single-book"
                onClick={() => {
                  if (onDeleteSingleBook) onDeleteSingleBook(targetBook.id);
                  onClose();
                }}
                className="w-full text-left text-[14px] font-medium text-rose-500 py-2 px-3 hover:bg-rose-50 active:bg-rose-100 rounded-xl transition-colors"
              >
                删除书籍
              </button>
            </div>
          </div>
        </>
      )}

      {/* 4. Single Folder Contextual Popover */}
      {activeModal.type === 'folder-actions' && targetFolder && (
        <>
          {renderBackdrop()}
          <div
            id="folder-actions-popover"
            style={{
              top: activeModal.position ? Math.min(activeModal.position.top + 10, window.innerHeight - 240) : 180,
              right: activeModal.position ? Math.max(16, window.innerWidth - activeModal.position.right - 20) : 24,
            }}
            className="fixed z-50 w-52 bg-white/95 backdrop-blur-2xl rounded-2xl border border-black/[0.08] shadow-[0_12px_36px_rgba(0,0,0,0.15)] p-1.5 flex flex-col select-none animate-in fade-in zoom-in-95 duration-150 origin-top-right"
          >
            <div className="flex flex-col">
              <button
                type="button"
                id="action-rename-folder"
                onClick={() => {
                  onClose();
                  onSaveRename(targetFolder.name);
                }}
                className="w-full text-left text-[14px] font-medium text-gray-800 py-2 px-3 hover:bg-gray-50 active:bg-gray-100 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>重命名分组</span>
                <svg className="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </button>
            </div>

            <div className="h-px bg-gray-100 my-1 mx-2" />

            <div className="flex flex-col">
              <button
                type="button"
                id="action-delete-single-folder"
                onClick={() => {
                  if (onDeleteSingleFolder) onDeleteSingleFolder(targetFolder.id);
                  onClose();
                }}
                className="w-full text-left text-[14px] font-medium text-rose-500 py-2 px-3 hover:bg-rose-50 active:bg-rose-100 rounded-xl transition-colors flex items-center justify-between"
              >
                <span>删除分组</span>
                <svg className="w-4 h-4 text-rose-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <polyline points="3 6 5 6 21 6" />
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </>
      )}

      {/* 5. Delete Confirmation Modal */}
      {activeModal.type === 'delete-confirm' && (
        <>
          {renderBackdrop()}
          <div
            id="delete-confirm-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-dialog-title"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[84%] max-w-[320px] bg-white/95 backdrop-blur-2xl rounded-[22px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-black/[0.06] overflow-hidden text-center select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-6 pt-6 pb-4">
              <h3 id="delete-dialog-title" className="text-[17px] font-bold text-gray-900 tracking-tight">
                {deleteCountText}
              </h3>
              <p className="text-[13px] text-gray-500 mt-2 leading-relaxed">
                删除后内容将从资料库中移除，确认执行此操作？
              </p>
            </div>

            <div className="border-t border-gray-200/80 grid grid-cols-2 divide-x divide-gray-200/80">
              <button
                type="button"
                id="dialog-cancel-delete"
                onClick={onClose}
                className="py-3 text-[16px] text-blue-600 font-normal active:bg-gray-100 transition-colors"
              >
                取消
              </button>
              <button
                type="button"
                id="dialog-confirm-delete"
                onClick={() => {
                  onConfirmDelete();
                  onClose();
                }}
                className="py-3 text-[16px] text-rose-500 font-semibold active:bg-rose-50 transition-colors"
              >
                删除
              </button>
            </div>
          </div>
        </>
      )}

      {/* 6. Add to Folder Bottom Sheet (Screenshot 8, 11) */}
      {activeModal.type === 'add-to-folder' && (
        <>
          {renderBackdrop()}
          <div
            id="add-to-folder-sheet"
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[428px] bg-white rounded-t-[26px] shadow-[0_-8px_36px_rgba(0,0,0,0.15)] z-50 px-5 pt-3 pb-8 select-none animate-in slide-in-from-bottom duration-200"
          >
            {/* Top Grab Handle */}
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-3" />

            {/* Header: Centered Title with Right Close (X) button */}
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8" />
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">添加到分组</h3>
              <button
                type="button"
                id="close-add-folder-sheet-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100/90 text-gray-500 hover:text-gray-800 flex items-center justify-center active:scale-95 transition-transform cursor-pointer"
              >
                <svg className="w-4 h-4 stroke-[2.2] stroke-current" fill="none" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            {/* Folder Inset List (Screenshot 8, 11) */}
            <div className="bg-gray-50/80 rounded-2xl divide-y divide-gray-100 overflow-hidden mb-3">
              {folders.map((f) => {
                const folderBooks = books.filter((b) => b.folderId === f.id);
                return (
                  <button
                    key={f.id}
                    type="button"
                    id={`sheet-folder-${f.id}`}
                    onClick={() => {
                      onAddToFolder(f.id);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-3.5 hover:bg-gray-100/70 active:bg-gray-200/50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      {folderBooks.length > 0 ? (
                        <div className="w-12 h-12 rounded-xl bg-gray-200 overflow-hidden grid grid-cols-2 gap-0.5 p-0.5 shadow-sm">
                          {folderBooks.slice(0, 4).map((b) => (
                            <img
                              key={b.id}
                              src={b.coverUrl}
                              alt=""
                              className="w-full h-full object-cover rounded-[2px]"
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-[#F2F2F7] flex items-center justify-center text-red-500 shadow-sm">
                          <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                            <path d="M19.5 21a3 3 0 003-3v-4.5a3 3 0 00-3-3h-1.5V9a3 3 0 00-3-3h-6A3 3 0 006 9v1.5H4.5A3 3 0 001.5 13.5V18a3 3 0 003 3h15z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <span className="text-[16px] font-semibold text-gray-900 block leading-snug">
                          {f.name}
                        </span>
                        <span className="text-[12px] text-gray-400 font-normal">
                          {folderBooks.length}项内容
                        </span>
                      </div>
                    </div>

                    <svg className="w-5 h-5 text-gray-400 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M8.25 4.5l7.5 7.5-7.5 7.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                );
              })}
            </div>

            {/* Create new folder button */}
            <button
              type="button"
              id="sheet-create-new-folder"
              onClick={() => {
                onClose();
                onOpenNewFolder();
              }}
              className="w-full flex items-center justify-center p-3.5 rounded-2xl border border-dashed border-gray-300 text-gray-600 hover:text-gray-900 active:bg-gray-50 transition text-sm font-medium cursor-pointer"
            >
              + 新建分组并加入
            </button>
          </div>
        </>
      )}

      {/* 7. New Folder Dialog */}
      {activeModal.type === 'new-folder' && (
        <>
          {renderBackdrop()}
          <div
            id="new-folder-dialog"
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[84%] max-w-[320px] bg-white/95 backdrop-blur-2xl rounded-[22px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-black/[0.06] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-5 pt-5 pb-3 text-center">
              <h3 className="text-[17px] font-bold text-gray-900">新建分组</h3>
              <p className="text-[12px] text-gray-400 mt-1">请输入分组名称</p>
              <input
                id="new-folder-input"
                type="text"
                autoFocus
                placeholder="例如：原版分级阅读"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                className="mt-3 w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="border-t border-gray-200/80 grid grid-cols-2 divide-x divide-gray-200/80">
              <button
                type="button"
                onClick={onClose}
                className="py-3 text-[15px] text-gray-600 font-normal active:bg-gray-100"
              >
                取消
              </button>
              <button
                type="button"
                id="confirm-create-folder-btn"
                onClick={() => {
                  if (newFolderName.trim()) {
                    onCreateFolder(newFolderName.trim());
                    setNewFolderName('');
                    onClose();
                  }
                }}
                className="py-3 text-[15px] text-blue-600 font-semibold active:bg-blue-50"
              >
                创建
              </button>
            </div>
          </div>
        </>
      )}

      {/* 8. Rename Dialog */}
      {activeModal.type === 'rename-item' && (
        <>
          {renderBackdrop()}
          <div
            id="rename-item-dialog"
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[84%] max-w-[320px] bg-white/95 backdrop-blur-2xl rounded-[22px] shadow-[0_16px_48px_rgba(0,0,0,0.2)] border border-black/[0.06] overflow-hidden select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="px-5 pt-5 pb-3 text-center">
              <h3 className="text-[17px] font-bold text-gray-900">
                重命名{activeModal.itemType === 'folder' ? '分组' : '书籍'}
              </h3>
              <input
                id="rename-input"
                type="text"
                autoFocus
                defaultValue={activeModal.currentName}
                onChange={(e) => setRenameInput(e.target.value)}
                className="mt-3 w-full px-3.5 py-2 bg-gray-100 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div className="border-t border-gray-200/80 grid grid-cols-2 divide-x divide-gray-200/80">
              <button
                type="button"
                onClick={onClose}
                className="py-3 text-[15px] text-gray-600 font-normal active:bg-gray-100"
              >
                取消
              </button>
              <button
                type="button"
                id="confirm-rename-btn"
                onClick={() => {
                  const val = renameInput.trim() || activeModal.currentName;
                  onSaveRename(val);
                  onClose();
                }}
                className="py-3 text-[15px] text-blue-600 font-semibold active:bg-blue-50"
              >
                完成
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};
