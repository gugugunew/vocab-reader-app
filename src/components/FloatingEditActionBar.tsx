import React from 'react';

interface FloatingEditActionBarProps {
  selectedCount: number;
  hasSelectedFolder: boolean;
  isInFolderView: boolean;
  isDeletePopoverOpen: boolean;
  deleteTitle: string;
  deleteSubtext: string;
  deleteButtonLabel: string;
  onToggleDeletePopover: () => void;
  onConfirmDelete: () => void;
  onAddToFolder: () => void;
  onRemoveFromFolder?: () => void;
}

export const FloatingEditActionBar: React.FC<FloatingEditActionBarProps> = ({
  selectedCount,
  hasSelectedFolder,
  isInFolderView,
  isDeletePopoverOpen,
  deleteTitle,
  deleteSubtext,
  deleteButtonLabel,
  onToggleDeletePopover,
  onConfirmDelete,
  onAddToFolder,
  onRemoveFromFolder,
}) => {
  const isDeleteDisabled = selectedCount === 0;
  // Key Rule: If any folder is selected, "添加到分组" is disabled
  const isAddDisabled = selectedCount === 0 || hasSelectedFolder;

  return (
    <aside
      id="floating-edit-action-bar"
      aria-label="批量编辑操作栏"
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] flex items-center justify-between pointer-events-auto z-40 select-none"
    >
      {/* Left Delete Icon Button with In-Place Popover Bubble */}
      <div className="relative flex-shrink-0">
        {/* Popover confirmation bubble as seen in user design specs */}
        {isDeletePopoverOpen && !isDeleteDisabled && (
          <div
            id="delete-popover"
            className="absolute bottom-[calc(100%+14px)] left-0 w-[240px] bg-white rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100/70 z-50 text-left animate-in fade-in zoom-in-95 duration-150 origin-bottom-left"
          >
            <h3 className="text-base font-bold text-gray-900 tracking-tight leading-snug">
              {deleteTitle}
            </h3>
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {deleteSubtext}
            </p>
            <div className="mt-4">
              <button
                type="button"
                id="popover-confirm-delete-btn"
                onClick={onConfirmDelete}
                className="w-full py-2.5 rounded-xl bg-[#EFEFF0] hover:bg-[#E5E5EA] text-[#FF3B30] font-semibold text-[15px] flex items-center justify-center transition-colors shadow-none active:opacity-80 cursor-pointer"
              >
                {deleteButtonLabel}
              </button>
            </div>
          </div>
        )}

        <button
          type="button"
          id="edit-delete-btn"
          aria-label="删除所选项目"
          disabled={isDeleteDisabled}
          onClick={onToggleDeletePopover}
          className={`w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-100/80 flex items-center justify-center transition-all flex-shrink-0 ${
            isDeleteDisabled
              ? 'text-gray-300 opacity-40 cursor-not-allowed pointer-events-none'
              : 'text-gray-800 active:scale-95 active:bg-gray-50'
          }`}
        >
          <svg
            className="w-6 h-6 stroke-current stroke-[1.75]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Center "添加到分组" Pill Button (56px capsule) */}
      <div className={isInFolderView ? '' : 'absolute left-1/2 -translate-x-1/2'}>
        <button
          type="button"
          id="edit-add-to-folder-btn"
          disabled={isAddDisabled}
          onClick={onAddToFolder}
          className={`h-14 px-7 rounded-full flex items-center space-x-2.5 transition-all select-none ${
            isAddDisabled
              ? 'bg-white/95 backdrop-blur-xl border border-gray-100/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] text-gray-400 opacity-40 pointer-events-none'
              : 'bg-white/95 backdrop-blur-md shadow-md border border-gray-100/80 text-gray-900 active:scale-98 active:bg-gray-50 cursor-pointer'
          }`}
        >
          <svg
            className={`w-5 h-5 stroke-current stroke-[1.9] ${isAddDisabled ? 'text-gray-400' : 'text-gray-900'}`}
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="M12 4.5v15m7.5-7.5h-15" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span className={`text-[15px] font-semibold tracking-tight ${isAddDisabled ? 'text-gray-400' : 'text-gray-900'}`}>
            添加到分组
          </span>
        </button>
      </div>

      {/* Right control: "移出分组" button if inside folder, else invisible spacer */}
      {isInFolderView ? (
        <button
          type="button"
          id="edit-remove-from-folder-btn"
          aria-label="移出分组"
          disabled={selectedCount === 0}
          onClick={onRemoveFromFolder}
          className={`w-14 h-14 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-gray-100/80 flex items-center justify-center transition-all flex-shrink-0 ${
            selectedCount === 0
              ? 'text-gray-300 opacity-40 cursor-not-allowed pointer-events-none'
              : 'text-gray-800 active:scale-95 active:bg-gray-50'
          }`}
        >
          <svg
            className="w-6 h-6 stroke-current stroke-[1.75]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      ) : (
        <div aria-hidden="true" className="w-14 h-14 invisible pointer-events-none" />
      )}
    </aside>
  );
};
