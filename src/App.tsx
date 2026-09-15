import React, { useState, useMemo } from 'react';
import { Book, Folder, SortOrder, ContentFilter, ActiveModal } from './types';
import { INITIAL_BOOKS, INITIAL_FOLDERS } from './data/initialData';
import { BookItem } from './components/BookItem';
import { FolderItem } from './components/FolderItem';
import { TopNav } from './components/TopNav';
import { FloatingTabBar } from './components/FloatingTabBar';
import { FloatingEditActionBar } from './components/FloatingEditActionBar';
import { Overlays } from './components/Overlays';
import { WordListVocabularyView } from './components/WordListVocabularyView';

export default function App() {
  // Core application states
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [folders, setFolders] = useState<Folder[]>(INITIAL_FOLDERS);

  // Navigation & View mode
  const [viewMode, setViewMode] = useState<'library' | 'folder'>('library');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'library' | 'explore' | 'profile'>('library');

  // Active book for vocabulary list view (Batch 2 core feature)
  const [activeVocabBook, setActiveVocabBook] = useState<Book | null>(null);

  // Groups expansion state in library view
  const [isGroupsExpanded, setIsGroupsExpanded] = useState<boolean>(false);

  // Edit Mode state
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeletePopoverOpen, setIsDeletePopoverOpen] = useState<boolean>(false);

  // Search & Filter & Sort states
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrder>('time');
  const [contentFilter, setContentFilter] = useState<ContentFilter>('all');

  // Active popovers & modals
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2200);
  };

  // Find current folder if inside folder view
  const currentFolder = useMemo(
    () => folders.find((f) => f.id === currentFolderId),
    [folders, currentFolderId]
  );

  // Books filtered by location (in folder vs in main library)
  const booksInScope = useMemo(() => {
    if (viewMode === 'folder') {
      return books.filter((b) => b.folderId === currentFolderId);
    }
    return books;
  }, [books, viewMode, currentFolderId]);

  // Apply Search, Filter, and Sort to books
  const displayedBooks = useMemo(() => {
    let result = [...booksInScope];

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((b) => b.title.toLowerCase().includes(q));
    }

    // Category / Source filter
    if (contentFilter !== 'all') {
      if (contentFilter === 'sentence') {
        result = result.filter((b) => b.metricType === 'sentence');
      } else if (contentFilter === 'word') {
        result = result.filter((b) => b.metricType === 'word');
      } else if (contentFilter === 'explore') {
        result = result.filter((b) => !b.isCustomImport);
      } else if (contentFilter === 'custom') {
        result = result.filter((b) => b.isCustomImport);
      }
    }

    // Sort order (with pinned books strictly staying on top)
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;

      if (sortOrder === 'name') {
        return a.title.localeCompare(b.title, 'zh-CN');
      }
      return b.createdAt - a.createdAt;
    });

    return result;
  }, [booksInScope, searchQuery, contentFilter, sortOrder]);

  // In library view, items that can be selected in edit mode
  const allSelectableIds = useMemo(() => {
    if (viewMode === 'folder') {
      return displayedBooks.map((b) => b.id);
    }
    const folderIds = isGroupsExpanded ? folders.map((f) => f.id) : [];
    return [...folderIds, ...displayedBooks.map((b) => b.id)];
  }, [viewMode, displayedBooks, folders, isGroupsExpanded]);

  const isAllSelected = useMemo(() => {
    if (allSelectableIds.length === 0) return false;
    return allSelectableIds.every((id) => selectedIds.has(id));
  }, [allSelectableIds, selectedIds]);

  // Check if any selected item is a folder
  const hasSelectedFolder = useMemo(() => {
    return Array.from(selectedIds).some((id) => folders.some((f) => f.id === id));
  }, [selectedIds, folders]);

  // Calculate dynamic delete confirm text
  const deleteTitleText = useMemo(() => {
    const selectedFolderCount = folders.filter((f) => selectedIds.has(f.id)).length;
    const selectedBookCount = books.filter((b) => selectedIds.has(b.id)).length;

    if (selectedFolderCount > 0) {
      return '删除选中的分组和书籍';
    }
    if (selectedBookCount === 1) {
      const b = books.find((x) => selectedIds.has(x.id));
      return `删除 “${b?.title || '书籍'}”`;
    }
    if (selectedBookCount > 1) {
      return `删除选中书籍`;
    }
    return '删除选中项目';
  }, [folders, books, selectedIds]);

  const deleteSubtext = useMemo(() => {
    const selectedFolderCount = folders.filter((f) => selectedIds.has(f.id)).length;
    const selectedBookCount = books.filter((b) => selectedIds.has(b.id)).length;

    if (selectedFolderCount > 0) {
      return '您确定要删除选中的分组和书籍吗？';
    }
    if (selectedBookCount === 1) {
      const b = books.find((x) => selectedIds.has(x.id));
      return `您确定要删除书籍 “${b?.title || ''}” 吗？`;
    }
    return '您确定要删除选中的书籍吗？';
  }, [folders, books, selectedIds]);

  const deleteButtonLabel = useMemo(() => {
    return hasSelectedFolder ? '删除项目' : '删除书籍';
  }, [hasSelectedFolder]);

  // Selection toggle handlers
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Rule 4: "多选全选时，若分组未展开需自动展开"
  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds(new Set());
    } else {
      if (viewMode === 'library' && !isGroupsExpanded) {
        setIsGroupsExpanded(true);
        const allIds = [...folders.map((f) => f.id), ...displayedBooks.map((b) => b.id)];
        setSelectedIds(new Set(allIds));
      } else {
        setSelectedIds(new Set(allSelectableIds));
      }
    }
  };

  const handleStartEdit = () => {
    setIsEditing(true);
    setSelectedIds(new Set());
    setIsDeletePopoverOpen(false);
  };

  const handleFinishEdit = () => {
    setIsEditing(false);
    setSelectedIds(new Set());
    setIsDeletePopoverOpen(false);
  };

  // Batch delete handler
  const handleConfirmBatchDelete = () => {
    const toDelete = new Set(selectedIds);
    setBooks((prev) => prev.filter((b) => !toDelete.has(b.id)));
    setFolders((prev) => prev.filter((f) => !toDelete.has(f.id)));
    setSelectedIds(new Set());
    setIsEditing(false);
    setIsDeletePopoverOpen(false);
    showToast('已成功从资料库中移除');
  };

  // Move selected books to a destination folder
  const handleMoveSelectedToFolder = (folderId: string) => {
    const targetFolderObj = folders.find((f) => f.id === folderId);
    setBooks((prev) =>
      prev.map((b) => {
        if (selectedIds.has(b.id)) {
          return { ...b, folderId };
        }
        return b;
      })
    );
    setSelectedIds(new Set());
    setIsEditing(false);
    showToast(`已成功将所选书籍移至「${targetFolderObj?.name || '新分组'}」`);
  };

  // Move out of folder (folder view action)
  const handleRemoveSelectedFromFolder = () => {
    setBooks((prev) =>
      prev.map((b) => {
        if (selectedIds.has(b.id)) {
          return { ...b, folderId: null };
        }
        return b;
      })
    );
    setSelectedIds(new Set());
    setIsEditing(false);
    showToast('已成功将所选书籍移出分组');
  };

  // Folder creation
  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name,
      createdAt: Date.now(),
    };
    setFolders((prev) => [newFolder, ...prev]);
    setIsGroupsExpanded(true);
    showToast(`已新建分组「${name}」`);
  };

  // Single item actions
  const handleTogglePinBook = (bookId: string) => {
    setBooks((prev) =>
      prev.map((b) => (b.id === bookId ? { ...b, isPinned: !b.isPinned } : b))
    );
    const b = books.find((x) => x.id === bookId);
    showToast(b?.isPinned ? '已取消置顶' : '已置顶到最前');
  };

  const handleDeleteSingleBook = (bookId: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast('已删除书籍');
  };

  const handleDeleteSingleFolder = (folderId: string) => {
    setFolders((prev) => prev.filter((f) => f.id !== folderId));
    setBooks((prev) =>
      prev.map((b) => (b.folderId === folderId ? { ...b, folderId: null } : b))
    );
    if (viewMode === 'folder' && currentFolderId === folderId) {
      setViewMode('library');
      setCurrentFolderId(null);
    }
    showToast('已删除分组');
  };

  // Targeted item for context popover
  const targetBook = useMemo(() => {
    if (activeModal?.type === 'book-actions') {
      return books.find((b) => b.id === activeModal.bookId);
    }
    return undefined;
  }, [activeModal, books]);

  const targetFolder = useMemo(() => {
    if (activeModal?.type === 'folder-actions') {
      return folders.find((f) => f.id === activeModal.folderId);
    }
    return undefined;
  }, [activeModal, folders]);

  // If viewing a book's vocabulary & self-check testing table:
  if (activeVocabBook) {
    return (
      <div id="vocab-view-wrapper" className="min-h-screen bg-[#faf9fe] flex justify-center">
        <WordListVocabularyView
          book={activeVocabBook}
          onBack={() => setActiveVocabBook(null)}
        />
      </div>
    );
  }

  return (
    <div
      id="app-root-canvas"
      className="min-h-screen bg-[#faf9fe] text-neutral-900 flex justify-center selection:bg-neutral-200"
    >
      {/* Mobile standard canvas (390px - 414px width, centered, zero artifacts) */}
      <main
        id="mobile-viewport"
        className="w-full max-w-[414px] min-h-screen bg-[#faf9fe] flex flex-col relative overflow-x-hidden pb-28 select-none"
      >
        {/* Navigation Header */}
        <TopNav
          viewMode={viewMode}
          folderName={currentFolder?.name}
          isEditing={isEditing}
          isSearching={isSearching}
          searchQuery={searchQuery}
          isAllSelected={isAllSelected}
          onBackToLibrary={() => {
            setViewMode('library');
            setCurrentFolderId(null);
            setIsEditing(false);
            setSelectedIds(new Set());
          }}
          onToggleSearch={(open) => {
            setIsSearching(open);
            if (!open) setSearchQuery('');
          }}
          onChangeSearchQuery={setSearchQuery}
          onToggleSelectAll={handleToggleSelectAll}
          onFinishEdit={handleFinishEdit}
          onOpenFilter={() => setActiveModal({ type: 'filter-menu' })}
          onOpenTopMenu={() => setActiveModal({ type: 'top-menu' })}
        />

        {/* Large Title if in Folder View */}
        {viewMode === 'folder' && (
          <div className="px-5 pt-1 pb-3" id="folder-large-heading">
            <h1 className="text-[32px] font-bold text-neutral-900 tracking-tight leading-tight">
              {currentFolder?.name || '经典收藏'}
            </h1>
          </div>
        )}

        {/* Groups Row (Only in Library View when not searching) */}
        {viewMode === 'library' && !isSearching && (
          <>
            <div
              id="group-selector-toggle"
              onClick={() => setIsGroupsExpanded((prev) => !prev)}
              className="px-5 py-2.5 flex items-center justify-between text-gray-600 active:bg-gray-100/60 transition-colors cursor-pointer border-b border-gray-100/90"
              data-purpose="group-selector"
            >
              <div className="flex items-center space-x-2.5">
                <svg
                  className="w-[18px] h-[18px] text-gray-500 stroke-[2]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-[15px] font-medium text-gray-700">
                  {folders.length}个分组
                </span>
              </div>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                  isGroupsExpanded ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Expanded Groups List */}
            {isGroupsExpanded && (
              <section id="expanded-groups-list" className="px-5 mt-1 mb-1">
                {folders.map((folder, idx) => {
                  const booksInThisFolder = books.filter((b) => b.folderId === folder.id);
                  return (
                    <FolderItem
                      key={folder.id}
                      folder={folder}
                      booksInFolder={booksInThisFolder}
                      isEditing={isEditing}
                      isSelected={selectedIds.has(folder.id)}
                      onToggleSelect={handleToggleSelect}
                      onOpenFolder={(fid) => {
                        setViewMode('folder');
                        setCurrentFolderId(fid);
                      }}
                      onOpenActions={(e, fid) => {
                        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        setActiveModal({
                          type: 'folder-actions',
                          folderId: fid,
                          position: { top: rect.bottom, right: rect.right },
                        });
                      }}
                      isLast={idx === folders.length - 1}
                    />
                  );
                })}
              </section>
            )}
          </>
        )}

        {/* Cardless Inset Book List */}
        <section
          id="cardless-book-list"
          className="px-5 mt-1 flex-1"
          aria-label="书籍列表"
        >
          {displayedBooks.length > 0 ? (
            displayedBooks.map((book, index) => (
              <BookItem
                key={book.id}
                book={book}
                isEditing={isEditing}
                isSelected={selectedIds.has(book.id)}
                onToggleSelect={handleToggleSelect}
                onClickItem={(b) => setActiveVocabBook(b)}
                onOpenActions={(e, bid) => {
                  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  setActiveModal({
                    type: 'book-actions',
                    bookId: bid,
                    position: { top: rect.bottom, right: rect.right },
                  });
                }}
                isLast={index === displayedBooks.length - 1}
              />
            ))
          ) : (
            <div className="py-16 text-center text-gray-400">
              <svg
                className="w-10 h-10 mx-auto text-gray-300 mb-2 stroke-[1.5]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
              </svg>
              <p className="text-sm font-medium">无匹配书籍资料</p>
            </div>
          )}

          {/* Bottom Statistics Line */}
          <div
            id="library-statistics-footer"
            className="text-center text-[12px] tracking-wide font-normal text-gray-400 select-none pt-4 pb-6"
          >
            {isSearching ? (
              `找到 ${displayedBooks.length} 个相关结果`
            ) : viewMode === 'folder' ? (
              `${displayedBooks.length}本书、0个PDF`
            ) : (
              `${folders.length}个分组、${books.length}本书、0个PDF`
            )}
          </div>
        </section>

        {/* Floating Bottom Bars */}
        {isEditing ? (
          <FloatingEditActionBar
            selectedCount={selectedIds.size}
            hasSelectedFolder={hasSelectedFolder}
            isInFolderView={viewMode === 'folder'}
            isDeletePopoverOpen={isDeletePopoverOpen}
            deleteTitle={deleteTitleText}
            deleteSubtext={deleteSubtext}
            deleteButtonLabel={deleteButtonLabel}
            onToggleDeletePopover={() => setIsDeletePopoverOpen((p) => !p)}
            onConfirmDelete={handleConfirmBatchDelete}
            onAddToFolder={() => setActiveModal({ type: 'add-to-folder' })}
            onRemoveFromFolder={handleRemoveSelectedFromFolder}
          />
        ) : (
          <FloatingTabBar
            activeTab={activeTab}
            onSelectTab={(tab) => {
              setActiveTab(tab);
              if (tab === 'library') {
                setViewMode('library');
                setCurrentFolderId(null);
              } else {
                showToast(`已切换至「${tab === 'home' ? '主页' : tab === 'explore' ? '探索' : '我的'}」视图`);
              }
            }}
          />
        )}

        {/* Zero-Layout-Shift Overlays */}
        <Overlays
          activeModal={activeModal}
          onClose={() => setActiveModal(null)}
          sortOrder={sortOrder}
          onSelectSort={setSortOrder}
          contentFilter={contentFilter}
          onSelectFilter={setContentFilter}
          onStartEdit={handleStartEdit}
          onOpenNewFolder={() => setActiveModal({ type: 'new-folder' })}
          onConfirmDelete={handleConfirmBatchDelete}
          deleteCountText={deleteTitleText}
          folders={folders}
          books={books}
          onAddToFolder={handleMoveSelectedToFolder}
          onSaveRename={(newName) => {
            if (activeModal?.type === 'rename-item') {
              if (activeModal.itemType === 'folder') {
                setFolders((prev) =>
                  prev.map((f) => (f.id === activeModal.id ? { ...f, name: newName } : f))
                );
              } else {
                setBooks((prev) =>
                  prev.map((b) => (b.id === activeModal.id ? { ...b, title: newName } : b))
                );
              }
              showToast('重命名成功');
            }
          }}
          onCreateFolder={handleCreateFolder}
          targetBook={targetBook}
          onTogglePinBook={handleTogglePinBook}
          onExportBook={(b) => showToast(`已生成「${b.title}」词句学习导出卡片`)}
          onOpenVocabulary={(b) => setActiveVocabBook(b)}
          onDeleteSingleBook={handleDeleteSingleBook}
          targetFolder={targetFolder}
          onDeleteSingleFolder={handleDeleteSingleFolder}
        />

        {/* iOS Native Toast Feedback Pill */}
        {toastMessage && (
          <div
            id="app-toast-pill"
            className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-none"
          >
            {toastMessage}
          </div>
        )}
      </main>
    </div>
  );
}
