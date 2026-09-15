import React from 'react';

interface TopNavProps {
  viewMode: 'library' | 'folder';
  folderName?: string;
  isEditing: boolean;
  isSearching: boolean;
  searchQuery: string;
  isAllSelected: boolean;
  onBackToLibrary?: () => void;
  onToggleSearch: (open: boolean) => void;
  onChangeSearchQuery: (query: string) => void;
  onToggleSelectAll: () => void;
  onFinishEdit: () => void;
  onOpenFilter: (e: React.MouseEvent) => void;
  onOpenTopMenu: (e: React.MouseEvent) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  viewMode,
  folderName = '分组',
  isEditing,
  isSearching,
  searchQuery,
  isAllSelected,
  onBackToLibrary,
  onToggleSearch,
  onChangeSearchQuery,
  onToggleSelectAll,
  onFinishEdit,
  onOpenFilter,
  onOpenTopMenu,
}) => {
  // Case 1: Search Active state
  if (isSearching) {
    return (
      <header
        id="search-header"
        className="px-5 pt-7 pb-3 select-none"
        data-purpose="search-active-header"
      >
        <div className="flex items-center space-x-3">
          <div className="flex-1 flex items-center bg-[#f2f3f5] rounded-full px-3.5 h-10 space-x-2">
            <svg
              className="w-4 h-4 text-gray-400 stroke-[2] flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              id="search-input"
              type="text"
              autoFocus
              placeholder="搜索书籍或作者"
              value={searchQuery}
              onChange={(e) => onChangeSearchQuery(e.target.value)}
              className="bg-transparent border-0 p-0 text-[15px] text-gray-900 font-medium focus:ring-0 focus:outline-none flex-1 min-w-0"
            />
            {searchQuery.length > 0 && (
              <button
                type="button"
                id="search-clear-btn"
                aria-label="清除内容"
                onClick={() => onChangeSearchQuery('')}
                className="w-4 h-4 rounded-full bg-gray-400 text-white flex items-center justify-center flex-shrink-0 active:scale-95"
              >
                <svg className="w-2.5 h-2.5 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            )}
          </div>
          <button
            type="button"
            id="search-cancel-btn"
            aria-label="取消搜索"
            onClick={() => onToggleSearch(false)}
            className="text-[15px] font-medium text-gray-900 active:text-gray-500 transition-colors flex-shrink-0"
          >
            取消
          </button>
        </div>
      </header>
    );
  }

  // Case 2: Folder View
  if (viewMode === 'folder') {
    return (
      <header
        id="folder-nav-header"
        className="sticky top-0 z-40 w-full px-5 pt-6 pb-2 flex items-center justify-between bg-[#faf9fe]/90 backdrop-blur-xl transition-colors select-none"
      >
        {/* Left: Back button */}
        <button
          type="button"
          id="folder-back-btn"
          aria-label="返回资料库"
          onClick={onBackToLibrary}
          className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-sm flex items-center justify-center active:scale-95 transition-all text-neutral-800"
        >
          <svg className="w-5 h-5 -ml-0.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
            <polyline points="15 18 9 12 15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Right actions: If in edit mode, show select all & finish; else show folder menu */}
        {isEditing ? (
          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              id="folder-select-all-btn"
              onClick={onToggleSelectAll}
              className="h-9 px-4 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-sm text-neutral-900 text-sm font-medium flex items-center justify-center tracking-tight active:scale-95 transition-all"
            >
              {isAllSelected ? '取消全选' : '全选'}
            </button>
            <button
              type="button"
              id="folder-finish-edit-btn"
              aria-label="完成编辑"
              onClick={onFinishEdit}
              className="w-9 h-9 rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-sm active:scale-95 transition-all flex-shrink-0"
            >
              <svg className="w-4 h-4 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        ) : (
          <button
            type="button"
            id="folder-menu-btn"
            aria-label="更多操作"
            onClick={onOpenTopMenu}
            className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-md border border-gray-200/80 shadow-sm flex items-center justify-center active:scale-95 transition-all text-neutral-800"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="5" cy="12" r="1.75" />
              <circle cx="12" cy="12" r="1.75" />
              <circle cx="19" cy="12" r="1.75" />
            </svg>
          </button>
        )}
      </header>
    );
  }

  // Case 3: Library View in Edit Mode
  if (isEditing) {
    return (
      <header
        id="library-edit-header"
        className="px-5 pt-8 pb-3 flex items-center justify-between select-none"
        data-purpose="edit-header"
      >
        <h1 className="text-[32px] font-black tracking-tight text-black leading-none">资料库</h1>
        <div className="flex items-center space-x-2.5">
          <button
            type="button"
            id="library-select-all-btn"
            onClick={onToggleSelectAll}
            className="h-[34px] px-4 rounded-full bg-[#EAEAEF] text-gray-800 text-xs font-semibold flex items-center justify-center tracking-wide active:scale-95 transition-transform"
          >
            {isAllSelected ? '取消全选' : '全选'}
          </button>
          <button
            type="button"
            id="library-finish-edit-btn"
            aria-label="完成编辑"
            onClick={onFinishEdit}
            className="w-[34px] h-[34px] rounded-full bg-[#3B82F6] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform flex-shrink-0"
          >
            <svg className="w-4 h-4 stroke-current stroke-[2.5]" fill="none" viewBox="0 0 24 24">
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </header>
    );
  }

  // Case 4: Standard Library Default View
  return (
    <header
      id="library-header"
      className="px-5 pt-8 pb-3 flex items-center justify-between select-none"
      data-purpose="navigation-header"
    >
      <h1 className="text-[34px] font-black tracking-tight text-black leading-none">资料库</h1>
      <div className="flex items-center space-x-2" data-purpose="header-actions">
        {/* Search button */}
        <button
          type="button"
          id="nav-search-btn"
          aria-label="搜索"
          onClick={() => onToggleSearch(true)}
          className="w-10 h-10 rounded-full bg-[#f2f3f5] flex items-center justify-center text-gray-800 active:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Filter button */}
        <button
          type="button"
          id="nav-filter-btn"
          aria-label="筛选"
          onClick={onOpenFilter}
          className="w-10 h-10 rounded-full bg-[#f2f3f5] flex items-center justify-center text-gray-800 active:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M3 4.5h18m-14 7.5h10m-7 7.5h4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* More Menu button */}
        <button
          type="button"
          id="nav-more-menu-btn"
          aria-label="更多操作"
          onClick={onOpenTopMenu}
          className="w-10 h-10 rounded-full bg-[#f2f3f5] flex items-center justify-center text-gray-800 active:bg-gray-200 transition-colors"
        >
          <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
            <circle cx="5" cy="12" r="2" />
            <circle cx="12" cy="12" r="2" />
            <circle cx="19" cy="12" r="2" />
          </svg>
        </button>
      </div>
    </header>
  );
};
