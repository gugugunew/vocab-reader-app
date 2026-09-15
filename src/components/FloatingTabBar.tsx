import React from 'react';

interface FloatingTabBarProps {
  activeTab: 'home' | 'library' | 'explore' | 'profile';
  onSelectTab: (tab: 'home' | 'library' | 'explore' | 'profile') => void;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  activeTab,
  onSelectTab,
}) => {
  return (
    <nav
      id="floating-tab-bar"
      aria-label="底部导航栏"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[390px] h-[64px] bg-white/95 backdrop-blur-md rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100/80 flex items-center justify-around px-2 z-30 select-none"
    >
      {/* Tab 1: 主页 */}
      <button
        type="button"
        id="tab-home"
        aria-label="主页"
        onClick={() => onSelectTab('home')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'home' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg
          className="w-[22px] h-[22px] stroke-[1.8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] mt-1 font-medium">主页</span>
      </button>

      {/* Tab 2: 资料库 (Active) */}
      <button
        type="button"
        id="tab-library"
        aria-label="资料库"
        onClick={() => onSelectTab('library')}
        className="flex flex-col items-center justify-center flex-1 py-1 text-gray-900"
      >
        <div className="bg-gray-100/90 rounded-full px-4 py-1 flex items-center justify-center">
          <svg className="w-[20px] h-[20px] fill-current" viewBox="0 0 24 24">
            <path d="M6 3.75A2.75 2.75 0 003.25 6.5v11A2.75 2.75 0 006 20.25h12A2.75 2.75 0 0020.75 17.5v-11A2.75 2.75 0 0018 3.75H6zm0 1.5h12c.69 0 1.25.56 1.25 1.25v11c0 .69-.56 1.25-1.25 1.25H6c-.69 0-1.25-.56-1.25-1.25v-11c0-.69.56-1.25 1.25-1.25zM8 7.5a.75.75 0 000 1.5h8a.75.75 0 000-1.5H8z" />
          </svg>
        </div>
        <span className="text-[10px] mt-0.5 font-bold text-gray-900">资料库</span>
      </button>

      {/* Tab 3: 探索 */}
      <button
        type="button"
        id="tab-explore"
        aria-label="探索"
        onClick={() => onSelectTab('explore')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'explore' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg
          className="w-[22px] h-[22px] stroke-[1.8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21a9 9 0 100-18 9 9 0 000 18z" strokeLinecap="round" strokeLinejoin="round" />
          <path
            d="M15.75 8.25l-2.485 5.965-5.965 2.485 2.485-5.965 5.965-2.485z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] mt-1 font-medium">探索</span>
      </button>

      {/* Tab 4: 我的 */}
      <button
        type="button"
        id="tab-profile"
        aria-label="我的"
        onClick={() => onSelectTab('profile')}
        className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
          activeTab === 'profile' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
        }`}
      >
        <svg
          className="w-[22px] h-[22px] stroke-[1.8]"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-[10px] mt-1 font-medium">我的</span>
      </button>
    </nav>
  );
};
