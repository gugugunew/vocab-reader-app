import React, { useState, useMemo } from 'react';
import { Book, WordItem, VocabFilterTab, VocabMaskMode, VocabSortMode } from '../types';
import { INITIAL_WORDS } from '../data/vocabData';

interface WordListVocabularyViewProps {
  book: Book;
  onBack: () => void;
}

export const WordListVocabularyView: React.FC<WordListVocabularyViewProps> = ({
  book,
  onBack,
}) => {
  // Vocabulary data state
  const [words, setWords] = useState<WordItem[]>(INITIAL_WORDS);

  // Filter & Display options
  const [filterTab, setFilterTab] = useState<VocabFilterTab>('pending');
  const [maskMode, setMaskMode] = useState<VocabMaskMode>('both');
  const [sortMode, setSortMode] = useState<VocabSortMode>('original');

  // Popovers state
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  // Individual revealed state for TAP masks
  const [revealedWordIds, setRevealedWordIds] = useState<Set<string>>(new Set());
  const [isAllRevealed, setIsAllRevealed] = useState(false);

  // Swipe interactive demo state: which word row is currently swiped ('left' | 'right' | null)
  const [swipedRow, setSwipedRow] = useState<{ id: string; direction: 'left' | 'right' } | null>({
    id: 'w-02',
    direction: 'right', // matching screenshot 7 showcase
  });

  // Notes multi-select edit mode
  const [isNotesEditMode, setIsNotesEditMode] = useState(false);
  const [selectedNoteIds, setSelectedNoteIds] = useState<Set<string>>(new Set(['w-01', 'w-02', 'w-04']));

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2000);
  };

  // Toggle mask reveal for a single word
  const handleToggleReveal = (id: string) => {
    setRevealedWordIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle all revealed / masked
  const handleToggleAllRevealed = () => {
    if (isAllRevealed) {
      setRevealedWordIds(new Set());
      setIsAllRevealed(false);
    } else {
      setRevealedWordIds(new Set(words.map((w) => w.id)));
      setIsAllRevealed(true);
    }
  };

  // Mark word as familiar (swipe left action)
  const handleMarkFamiliar = (id: string) => {
    setWords((prev) =>
      prev.map((w) =>
        w.id === id ? { ...w, status: w.status === 'familiar' ? 'learning' : 'familiar' } : w
      )
    );
    setSwipedRow(null);
    showToast('已标为熟悉单词');
  };

  // Toggle word star (swipe right action)
  const handleToggleStar = (id: string) => {
    setWords((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isStarred: !w.isStarred } : w))
    );
    setSwipedRow(null);
    showToast('已更新收藏状态');
  };

  // Filter words based on current filter tab
  const filteredWords = useMemo(() => {
    let result = [...words];

    if (filterTab === 'pending') {
      result = result.filter((w) => w.status === 'learning');
    } else if (filterTab === 'familiar') {
      result = result.filter((w) => w.status === 'familiar');
    } else if (filterTab === 'starred') {
      result = result.filter((w) => w.isStarred);
    } else if (filterTab === 'notes') {
      result = result.filter((w) => !!w.note);
    }

    if (sortMode === 'alphabetical') {
      result.sort((a, b) => a.word.localeCompare(b.word));
    } else if (sortMode === 'random') {
      // Deterministic pseudo-random shuffle for stability
      result.sort((a, b) => a.word.charCodeAt(0) - b.word.charCodeAt(0));
    }

    return result;
  }, [words, filterTab, sortMode]);

  // Tab counts
  const pendingCount = words.filter((w) => w.status === 'learning').length;
  const familiarCount = words.filter((w) => w.status === 'familiar').length;
  const starredCount = words.filter((w) => w.isStarred).length;
  const notesCount = words.filter((w) => !!w.note).length;

  return (
    <div
      id="vocabulary-view-root"
      className="w-full max-w-[428px] mx-auto min-h-screen bg-[#faf9fe] relative flex flex-col justify-between overflow-x-hidden text-neutral-900 select-none animate-in fade-in duration-150"
    >
      <div className="flex-1 w-full px-5 pt-6 pb-4">
        {/* Navigation Bar (Master Component NavigationBar) */}
        <nav
          id="vocab-navigation-bar"
          className="flex items-center justify-between w-full h-11"
        >
          {/* Back Button */}
          <button
            type="button"
            id="vocab-back-btn"
            aria-label="返回资料库"
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-white/90 border border-gray-200/80 shadow-sm flex items-center justify-center text-neutral-700 active:scale-95 transition-all"
          >
            <svg className="w-5 h-5 stroke-[2.2] -ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M15.75 19.5L8.25 12l7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2.5">
            {filterTab === 'notes' ? (
              // Notes View Header Actions (Screenshot 5 & 6)
              isNotesEditMode ? (
                <>
                  <button
                    type="button"
                    id="notes-select-all-btn"
                    onClick={() => {
                      if (selectedNoteIds.size === filteredWords.length) {
                        setSelectedNoteIds(new Set());
                      } else {
                        setSelectedNoteIds(new Set(filteredWords.map((w) => w.id)));
                      }
                    }}
                    className="h-10 px-4 rounded-full bg-white/90 border border-gray-200/80 shadow-sm flex items-center justify-center text-xs font-medium text-neutral-800 active:scale-95 transition-all"
                  >
                    全选 ({filteredWords.length})
                  </button>
                  <button
                    type="button"
                    id="notes-cancel-edit-btn"
                    aria-label="取消选择"
                    onClick={() => setIsNotesEditMode(false)}
                    className="w-10 h-10 rounded-full bg-white/90 border border-gray-200/80 shadow-sm flex items-center justify-center text-neutral-700 active:scale-95 transition-all"
                  >
                    <svg className="w-5 h-5 stroke-[2] stroke-current" fill="none" viewBox="0 0 24 24">
                      <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    id="notes-start-edit-btn"
                    onClick={() => setIsNotesEditMode(true)}
                    className="h-[36px] rounded-full bg-white/90 border border-gray-200/80 shadow-sm text-xs font-medium text-neutral-800 px-3.5 py-1.5 flex items-center justify-center active:scale-95 transition-all"
                  >
                    选择
                  </button>
                  <button
                    type="button"
                    id="vocab-filter-btn"
                    aria-label="分流菜单"
                    onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                    className="w-10 h-10 rounded-full bg-white/90 border border-gray-200/80 shadow-sm flex items-center justify-center text-neutral-700 active:scale-95 transition-all"
                  >
                    <svg className="w-5 h-5 text-neutral-700" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="5" cy="12" r="1.75" />
                      <circle cx="12" cy="12" r="1.75" />
                      <circle cx="19" cy="12" r="1.75" />
                    </svg>
                  </button>
                </>
              )
            ) : (
              // Standard Vocab View Header Actions
              <>
                <button
                  type="button"
                  id="vocab-filter-toggle-btn"
                  aria-label="词表分类与筛选"
                  onClick={() => setIsFilterMenuOpen((prev) => !prev)}
                  className={`w-10 h-10 rounded-full border border-gray-200/80 shadow-sm flex items-center justify-center transition-all ${
                    isFilterMenuOpen
                      ? 'bg-neutral-200 text-neutral-900 shadow-inner'
                      : 'bg-white/90 text-neutral-700 active:scale-95'
                  }`}
                >
                  <svg className="w-[18px] h-[18px] stroke-[2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M3.75 6.75h16.5M3.75 12h10.5m-10.5 5.25h16.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  type="button"
                  id="vocab-settings-toggle-btn"
                  aria-label="更多操作"
                  onClick={() => setIsSettingsMenuOpen((prev) => !prev)}
                  className="w-10 h-10 rounded-full bg-white/90 border border-gray-200/80 shadow-sm flex items-center justify-center text-neutral-700 active:scale-95 transition-all"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="5" cy="12" r="1.75" />
                    <circle cx="12" cy="12" r="1.75" />
                    <circle cx="19" cy="12" r="1.75" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Header Section */}
        <header className="mt-7 mb-4">
          <h1
            className="text-[32px] font-bold text-neutral-900 tracking-tight leading-tight"
            style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
          >
            {book.title}
          </h1>

          {filterTab === 'notes' ? (
            <div className="flex items-center space-x-2 mt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200/50">
                <svg className="w-3 h-3 mr-1 text-amber-500 stroke-[2] stroke-current" fill="none" viewBox="0 0 24 24">
                  <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                翻译与笔记
              </span>
              <p className="text-xs text-neutral-400 font-normal">
                {notesCount} 条学习笔记
              </p>
            </div>
          ) : (
            <p className="text-[13px] text-neutral-400 font-normal mt-1 tracking-normal">
              {pendingCount} 词待学
            </p>
          )}
        </header>

        {/* InvisibleUI Stats & Reveal Controller (Screenshot 4, 11) */}
        {filterTab !== 'notes' && (
          <div className="py-2.5 flex items-center justify-between border-b border-neutral-200/50 text-[13px] text-neutral-500">
            <div className="flex items-center space-x-1.5">
              <span>共 <strong className="text-neutral-900 font-semibold">{words.length}</strong> 词</span>
              <span className="text-gray-300">·</span>
              <span>待自测 <strong className="text-[#EA580C] font-semibold">{pendingCount}</strong></span>
              <span className="text-gray-300">·</span>
              <span>已掌握 <strong className="text-[#0284C7] font-semibold">{familiarCount}</strong></span>
            </div>
            <button
              type="button"
              id="toggle-all-spoilers-btn"
              onClick={handleToggleAllRevealed}
              className="flex items-center space-x-1 text-[#0284C7] hover:opacity-80 active:scale-95 transition-all cursor-pointer font-medium"
            >
              <svg className="w-4 h-4 stroke-[1.8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="12" r="3" strokeWidth="1.8" />
              </svg>
              <span className="text-[13px] font-medium tracking-tight">
                {isAllRevealed ? '全部遮罩' : '全揭/全遮'}
              </span>
            </button>
          </div>
        )}

        {/* Cardless Inset Word List (Master Component BookItem & Cardless Inset List) */}
        <section
          id="cardless-word-list"
          className="w-full flex flex-col divide-y divide-gray-100 border-t border-gray-100 mt-2"
        >
          {filteredWords.map((item) => {
            const isRevealed =
              maskMode === 'both' ||
              revealedWordIds.has(item.id) ||
              isAllRevealed;

            const isSwipedLeft = swipedRow?.id === item.id && swipedRow.direction === 'left';
            const isSwipedRight = swipedRow?.id === item.id && swipedRow.direction === 'right';

            const isNoteSelected = selectedNoteIds.has(item.id);

            return (
              <div
                key={item.id}
                id={`word-item-${item.id}`}
                className="relative overflow-hidden -mx-5 bg-[#faf9fe]"
              >
                {/* Background Swiped Actions on Left (Revealed on Swipe Right) */}
                <div className="absolute inset-y-0 left-0 flex z-0">
                  <button
                    type="button"
                    id={`swipe-note-${item.id}`}
                    onClick={() => {
                      setFilterTab('notes');
                      setSwipedRow(null);
                    }}
                    className="bg-[#475569] text-white w-[64px] h-full flex flex-col items-center justify-center gap-1 text-[11px] font-medium active:opacity-90 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>笔记</span>
                  </button>
                  <button
                    type="button"
                    id={`swipe-star-${item.id}`}
                    onClick={() => handleToggleStar(item.id)}
                    className="bg-[#f59e0b] text-white w-[64px] h-full flex flex-col items-center justify-center gap-1 text-[11px] font-medium active:opacity-90 cursor-pointer"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>收藏</span>
                  </button>
                </div>

                {/* Background Swiped Action on Right (Revealed on Swipe Left) */}
                <div className="absolute inset-y-0 right-0 flex z-0">
                  <button
                    type="button"
                    id={`swipe-familiar-${item.id}`}
                    onClick={() => handleMarkFamiliar(item.id)}
                    className="bg-[#3B82F6] text-white w-[88px] h-full flex flex-col items-center justify-center gap-1.5 text-[12px] font-medium active:opacity-90 cursor-pointer"
                  >
                    <svg className="w-5 h-5 stroke-[2.2]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>熟悉</span>
                  </button>
                </div>

                {/* Foreground Item Row */}
                <div
                  style={{
                    transform: isSwipedRight
                      ? 'translateX(128px)'
                      : isSwipedLeft
                      ? 'translateX(-88px)'
                      : 'translateX(0px)',
                  }}
                  className="relative z-10 bg-[#faf9fe] py-3.5 px-5 transition-transform duration-200"
                >
                  <div className="flex items-start justify-between">
                    {/* Left: Checkbox / Index / Word / Phonetic */}
                    <div className="flex items-start space-x-2.5 min-w-0">
                      {/* Notes Edit Mode Checkbox */}
                      {filterTab === 'notes' && isNotesEditMode && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNoteIds((prev) => {
                              const next = new Set(prev);
                              if (next.has(item.id)) next.delete(item.id);
                              else next.add(item.id);
                              return next;
                            });
                          }}
                          className={`w-5 h-5 mt-1 rounded-full flex items-center justify-center shadow-sm flex-shrink-0 transition-transform active:scale-95 ${
                            isNoteSelected
                              ? 'bg-blue-500 text-white'
                              : 'border-2 border-gray-300 bg-white'
                          }`}
                        >
                          {isNoteSelected && (
                            <svg className="w-3 h-3 stroke-[2.5] stroke-current" fill="none" viewBox="0 0 24 24">
                              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                      )}

                      {/* Number & Star/Green Status */}
                      <div className="flex items-center space-x-1 pt-0.5 w-9 shrink-0">
                        <span className="text-xs font-mono font-medium text-neutral-400">
                          {item.index}
                        </span>
                        {item.status === 'familiar' ? (
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" title="已掌握" />
                        ) : item.isStarred ? (
                          <span className="text-[#f59e0b] text-[11px] leading-none">★</span>
                        ) : null}
                      </div>

                      {/* Word & Phonetic */}
                      <div className="flex flex-col items-start">
                        <span
                          className="text-[17px] font-normal text-neutral-900 tracking-tight leading-snug"
                          style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", serif' }}
                        >
                          {maskMode === 'mask-en' && !isRevealed ? '••••••' : item.word}
                        </span>
                        <div className="mt-1 inline-flex items-center rounded-md bg-neutral-100/80 px-2 py-0.5 text-xs text-neutral-500 font-normal">
                          <span>{item.phonetic}</span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Definition or TAP Capsule Mask */}
                    <div className="text-right max-w-[170px] pt-0.5 leading-snug">
                      {maskMode === 'mask-cn' && !isRevealed ? (
                        <button
                          type="button"
                          id={`tap-btn-${item.id}`}
                          onClick={() => handleToggleReveal(item.id)}
                          className="w-[100px] h-[32px] rounded-full bg-[#F1F4F8] border border-[#E2E7ED] flex items-center justify-center text-[12px] font-semibold tracking-wider text-[#596579] active:scale-95 transition-transform cursor-pointer"
                        >
                          TAP
                        </button>
                      ) : (
                        <p className="text-[13px] text-neutral-700 leading-snug">
                          <span className="font-serif italic text-neutral-400 text-xs mr-1">
                            {item.pos}
                          </span>
                          <span>{item.definition}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Note Expanded Box (Screenshot 5 & 6) */}
                  {item.note && (
                    <div className="ml-9 mt-2.5 bg-neutral-100/65 rounded-xl p-3 border border-neutral-200/40 relative">
                      <p className="text-[13px] leading-relaxed text-neutral-700 font-normal">
                        {item.note.text}
                      </p>
                      <div className="mt-2.5 pt-2 border-t border-neutral-200/50 flex items-center justify-between">
                        <span className="text-[11px] text-neutral-400 font-mono">
                          更新于 {item.note.updatedAt}
                        </span>
                        <button
                          type="button"
                          onClick={() => showToast(`已打开「${item.word}」笔记编辑器`)}
                          className="inline-flex items-center text-[11px] text-neutral-500 hover:text-neutral-900 transition-colors"
                        >
                          <svg className="w-3 h-3 mr-1 text-neutral-400 stroke-[2] stroke-current" fill="none" viewBox="0 0 24 24">
                            <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          编辑
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Gesture demonstration toggles */}
                  <div className="mt-1 flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() =>
                        setSwipedRow((prev) =>
                          prev?.id === item.id && prev.direction === 'right'
                            ? null
                            : { id: item.id, direction: 'right' }
                        )
                      }
                      className="text-[10px] text-neutral-300 hover:text-neutral-500 transition-colors"
                    >
                      {isSwipedRight ? '收起手势' : '模拟右滑'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSwipedRow((prev) =>
                          prev?.id === item.id && prev.direction === 'left'
                            ? null
                            : { id: item.id, direction: 'left' }
                        )
                      }
                      className="text-[10px] text-neutral-300 hover:text-neutral-500 transition-colors"
                    >
                      {isSwipedLeft ? '收起手势' : '模拟左滑'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        {/* Footer Guidance */}
        <footer className="pt-8 pb-10 text-center">
          <p className="text-[11px] text-neutral-400 flex items-center justify-center space-x-1.5 font-normal tracking-tight">
            <span className="inline-block w-1 h-1 rounded-full bg-neutral-300" />
            <span>点击任意单词即可朗读发音</span>
            <span className="text-neutral-300">·</span>
            <span>支持手势左滑标熟与右滑收藏</span>
          </p>
        </footer>
      </div>

      {/* Floating Bottom Bar in Notes Selection Mode (Screenshot 6) */}
      {filterTab === 'notes' && isNotesEditMode && (
        <div className="fixed bottom-0 left-0 right-0 z-40 max-w-[430px] mx-auto p-5 bg-gradient-to-t from-[#faf9fe] via-[#faf9fe]/90 to-transparent pointer-events-none">
          <div className="pointer-events-auto flex flex-col space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
                <span className="text-xs text-neutral-500 font-medium">翻译与笔记</span>
              </div>
              <div className="flex items-center space-x-1 text-xs font-mono">
                <span className="text-neutral-900 font-medium">已选 {selectedNoteIds.size}</span>
                <span className="text-neutral-400">/ {filteredWords.length} 条</span>
              </div>
            </div>
            <button
              type="button"
              id="restore-notes-default-btn"
              onClick={() => {
                showToast(`已恢复默认翻译与笔记 (${selectedNoteIds.size}条)`);
                setIsNotesEditMode(false);
              }}
              className="w-full h-14 rounded-full bg-white border border-gray-200/80 shadow-sm flex items-center justify-center space-x-2 text-neutral-900 font-medium text-base active:scale-98 transition-all hover:bg-neutral-50 cursor-pointer"
            >
              <svg className="w-5 h-5 text-neutral-600 stroke-[2] stroke-current" fill="none" viewBox="0 0 24 24">
                <path d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>恢复默认翻译与笔记 ({selectedNoteIds.size}条)</span>
            </button>
          </div>
        </div>
      )}

      {/* Vocab Filter Popover Menu (Screenshot 3 & 4) */}
      {isFilterMenuOpen && (
        <>
          <div
            id="vocab-filter-backdrop"
            onClick={() => setIsFilterMenuOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          />
          <div
            id="vocab-filter-popover"
            className="fixed top-[64px] right-14 w-60 rounded-[20px] bg-white/95 backdrop-blur-2xl border border-black/[0.06] shadow-[0_12px_36px_rgba(0,0,0,0.14)] p-1.5 z-50 transition-transform origin-top-right select-none animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex flex-col">
              {/* Option 1: 本书待学 */}
              <button
                type="button"
                id="filter-tab-pending"
                onClick={() => {
                  setFilterTab('pending');
                  setIsFilterMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] border-b border-black/[0.04] transition-colors ${
                  filterTab === 'pending' ? 'bg-neutral-100/80 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[15px] text-neutral-900 leading-tight">本书待学</span>
                  <span className="text-[12px] text-neutral-400 font-normal mt-0.5">{pendingCount}</span>
                </div>
                {filterTab === 'pending' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2] shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Option 2: 本书熟悉单词 */}
              <button
                type="button"
                id="filter-tab-familiar"
                onClick={() => {
                  setFilterTab('familiar');
                  setIsFilterMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] border-b border-black/[0.04] transition-colors ${
                  filterTab === 'familiar' ? 'bg-neutral-100/80 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[15px] text-neutral-900 leading-tight">本书熟悉单词</span>
                  <span className="text-[12px] text-neutral-400 font-normal mt-0.5">{familiarCount}</span>
                </div>
                {filterTab === 'familiar' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2] shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Option 3: 本书收藏单词 */}
              <button
                type="button"
                id="filter-tab-starred"
                onClick={() => {
                  setFilterTab('starred');
                  setIsFilterMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] border-b border-black/[0.04] transition-colors ${
                  filterTab === 'starred' ? 'bg-neutral-100/80 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[15px] text-neutral-900 leading-tight">本书收藏单词</span>
                  <span className="text-[12px] text-neutral-400 font-normal mt-0.5">{starredCount}</span>
                </div>
                {filterTab === 'starred' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2] shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>

              {/* Option 4: 本书翻译与笔记 */}
              <button
                type="button"
                id="filter-tab-notes"
                onClick={() => {
                  setFilterTab('notes');
                  setIsFilterMenuOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-[14px] transition-colors ${
                  filterTab === 'notes' ? 'bg-neutral-100/80 font-medium' : 'hover:bg-neutral-50'
                }`}
              >
                <div className="flex flex-col text-left">
                  <span className="text-[15px] text-neutral-900 leading-tight">本书翻译与笔记</span>
                  <span className="text-[12px] text-neutral-400 font-normal mt-0.5">{notesCount}</span>
                </div>
                {filterTab === 'notes' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2] shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Vocab Settings & Mask Popover Menu (Screenshot 6) */}
      {isSettingsMenuOpen && (
        <>
          <div
            id="vocab-settings-backdrop"
            onClick={() => setIsSettingsMenuOpen(false)}
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          />
          <div
            id="vocab-settings-popover"
            className="fixed right-4 top-[58px] z-50 w-52 rounded-[20px] bg-white/95 backdrop-blur-2xl shadow-[0_16px_40px_-6px_rgba(0,0,0,0.16)] p-1.5 border border-black/[0.06] text-[15px] select-none transition-all origin-top-right animate-in fade-in zoom-in-95 duration-150"
          >
            {/* Section 1: Batch Actions */}
            <div className="flex flex-col py-0.5">
              <button
                type="button"
                onClick={() => {
                  setWords((prev) => prev.map((w) => ({ ...w, status: 'familiar' })));
                  setIsSettingsMenuOpen(false);
                  showToast('已全量标为熟悉单词');
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">批量标熟</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setWords((prev) => prev.map((w) => ({ ...w, isStarred: true })));
                  setIsSettingsMenuOpen(false);
                  showToast('已全量批量收藏');
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">批量收藏</span>
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-1 mx-2" />

            {/* Section 2: Display Toggle Modes */}
            <div className="flex flex-col py-0.5">
              <button
                type="button"
                onClick={() => {
                  setMaskMode('both');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">中英显示</span>
                {maskMode === 'both' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMaskMode('mask-cn');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">遮罩中文</span>
                {maskMode === 'mask-cn' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMaskMode('mask-en');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">遮罩英文</span>
                {maskMode === 'mask-en' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-1 mx-2" />

            {/* Section 3: Sort Modes */}
            <div className="flex flex-col py-0.5">
              <button
                type="button"
                onClick={() => {
                  setSortMode('original');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">原始排序</span>
                {sortMode === 'original' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortMode('alphabetical');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">字母排序</span>
                {sortMode === 'alphabetical' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSortMode('random');
                  setIsSettingsMenuOpen(false);
                }}
                className="w-full text-left px-3.5 py-2 rounded-xl hover:bg-black/[0.04] transition-colors flex items-center justify-between text-neutral-900"
              >
                <span className="font-normal tracking-tight">随机排序</span>
                {sortMode === 'random' && (
                  <svg className="w-4 h-4 text-neutral-900 stroke-[2.5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </>
      )}

      {/* iOS Native Toast Feedback Pill */}
      {toastMessage && (
        <div
          id="vocab-toast-pill"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-md animate-in fade-in zoom-in-95 duration-150 select-none pointer-events-none"
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
};
