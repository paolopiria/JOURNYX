
import React from 'react';
import { ViewType } from '../types';
import { HomeIcon, CatalogueIcon, ActivityIcon, ProfileIcon } from './icons';

interface BottomNavProps {
  currentView: ViewType;
  onNavigate: (view: ViewType) => void;
  isDarkMode: boolean;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentView, onNavigate, isDarkMode }) => {
  const tabs: { type: ViewType; icon: React.ComponentType<{ active?: boolean; size?: number; className?: string }>; label: string }[] = [
    { type: 'home', icon: HomeIcon, label: 'HOME' },
    { type: 'search', icon: CatalogueIcon, label: 'CATALOG' },
    { type: 'notifications', icon: ActivityIcon, label: 'ACTIVITY' },
    { type: 'profile', icon: ProfileIcon, label: 'PROFILE' },
  ];

  return (
    <nav className={`absolute bottom-0 left-0 right-0 w-full border-t px-6 py-4 z-50 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23]/95 backdrop-blur-md border-slate-800' : 'bg-white/95 backdrop-blur-md border-slate-200'}`}>
      {tabs.map((tab) => {
        const isActive = currentView === tab.type;
        const IconComponent = tab.icon;
        return (
          <button
            key={tab.type}
            onClick={() => onNavigate(tab.type)}
            className={`flex flex-col items-center gap-1.5 transition-all duration-200 bg-transparent hover:bg-transparent focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0 active:scale-95 ${
              isActive ? (isDarkMode ? 'text-[#ee710b]' : 'text-[#764d9a]') : (isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600')
            }`}
          >
            <div className="relative">
              <IconComponent active={isActive} size={32} />
              {tab.type === 'notifications' && (
                <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-pink-600 border-2 ${isDarkMode ? 'border-[#140e23]' : 'border-white'}`}></span>
              )}
            </div>
            <span className={`text-[9px] font-black tracking-[0.1em] ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;
