
import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Moon, 
  Sun, 
  UserCheck, 
  UserMinus, 
  Globe, 
  Shield, 
  LogOut, 
  Link2Off,
  ChevronRight
} from 'lucide-react';

interface SettingsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isOnline: boolean;
  toggleOnline: () => void;
}

const SettingsOverlay: React.FC<SettingsOverlayProps> = ({ 
  isOpen, 
  onClose, 
  isDarkMode, 
  toggleDarkMode,
  isOnline,
  toggleOnline
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 z-[60] backdrop-blur-sm"
          />
          
          {/* Overlay Content */}
          <motion.div
            ref={overlayRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`absolute bottom-0 left-0 right-0 w-full z-[70] border-t-4 shadow-[0_-10px_40px_rgba(0,0,0,0.2)] transition-colors duration-300 ${isDarkMode ? 'bg-slate-900 border-purple-600' : 'bg-white border-slate-900'}`}
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <button 
                  onClick={onClose}
                  className={`w-10 h-10 flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}
                >
                  <X size={20} />
                </button>
                <h2 className={`text-sm font-black uppercase tracking-[0.3em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>System Settings</h2>
                <div className="w-10" /> {/* Spacer */}
              </div>

              {/* Settings List */}
              <div className="space-y-2">
                {/* Theme Toggle */}
                <div className={`flex items-center justify-between p-4 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                      {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Appearance</p>
                      <p className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {isDarkMode ? 'Dark Mode' : 'Bright Mode'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleDarkMode}
                    className={`w-12 h-6 rounded-none border-2 relative transition-colors ${isDarkMode ? 'bg-purple-600 border-purple-400' : 'bg-white border-slate-900'}`}
                  >
                    <motion.div 
                      animate={{ x: isDarkMode ? 24 : 0 }}
                      className={`absolute top-0.5 left-0.5 w-4 h-4 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}
                    />
                  </button>
                </div>

                {/* Status Toggle */}
                <div className={`flex items-center justify-between p-4 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-900'}`}>
                      {isOnline ? <UserCheck size={18} /> : <UserMinus size={18} />}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Presence</p>
                      <p className={`text-xs font-black uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {isOnline ? 'Online' : 'Offline'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={toggleOnline}
                    className={`w-12 h-6 rounded-none border-2 relative transition-colors ${isOnline ? 'bg-emerald-500 border-emerald-400' : (isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-900')}`}
                  >
                    <motion.div 
                      animate={{ x: isOnline ? 24 : 0 }}
                      className={`absolute top-0.5 left-0.5 w-4 h-4 ${isDarkMode ? 'bg-white' : 'bg-slate-900'}`}
                    />
                  </button>
                </div>

                {/* Languages */}
                <button className={`w-full flex items-center justify-between p-4 border transition-colors group ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500 group-hover:text-purple-400' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-purple-600'}`}>
                      <Globe size={18} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Languages</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Privacy Policy */}
                <button className={`w-full flex items-center justify-between p-4 border transition-colors group ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500 group-hover:text-purple-400' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-purple-600'}`}>
                      <Shield size={18} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Privacy Policy</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Un-link Platform Profile */}
                <button className={`w-full flex items-center justify-between p-4 border transition-colors group ${isDarkMode ? 'bg-slate-800/30 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-100 hover:bg-slate-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500 group-hover:text-red-400' : 'bg-slate-50 border-slate-100 text-slate-400 group-hover:text-red-500'}`}>
                      <Link2Off size={18} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Un-link Platform Profile</span>
                  </div>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </button>

                {/* Log Out */}
                <button className={`w-full flex items-center justify-between p-4 border transition-colors group mt-4 ${isDarkMode ? 'bg-red-900/10 border-red-900/20 hover:bg-red-900/20' : 'bg-white border-slate-100 hover:bg-red-50'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-red-900/20 border-red-800 text-red-400' : 'bg-red-50 border-red-100 text-red-500'}`}>
                      <LogOut size={18} />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-red-400' : 'text-red-500'}`}>Log Out</span>
                  </div>
                </button>
              </div>

              {/* Footer Info */}
              <div className="mt-10 text-center">
                <p className="text-[8px] font-black text-slate-300 uppercase tracking-[0.5em]">Journyx v2.4.0-Stable</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsOverlay;
