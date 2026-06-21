
import React, { useState, useRef, useEffect } from 'react';
import { Review } from '../types';
import { Heart, MessageCircle, MoreHorizontal, Star, Gamepad2, Flag, Repeat2, X } from 'lucide-react';
import { MOCK_GAMES } from '../mockData';

interface ReviewCardProps {
  review: Review;
  onGameClick?: (id: string) => void;
  isDarkMode?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, onGameClick, isDarkMode = false }) => {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const game = MOCK_GAMES.find(g => g.id === review.gameId);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMenu]);

  return (
    <div className={`border rounded-none p-5 mb-5 shadow-[0_4px_15px_rgba(0,0,0,0.05)] transition-all duration-300 group relative ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-purple-500' : 'bg-white border-slate-200 hover:border-purple-300'}`}>
      {/* User Header */}
      <div className="flex justify-between items-start mb-5">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={review.userAvatar} 
              alt={review.userName} 
              className={`w-11 h-11 rounded-none border shadow-sm object-cover ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`} 
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 flex items-center justify-center border-2 border-white">
              <Star size={8} className="text-white fill-white" />
            </div>
          </div>
          <div>
            <h4 className={`font-black text-sm tracking-tight group-hover:text-purple-600 transition-colors uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{review.userName}</h4>
            <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] font-black">{review.date}</p>
          </div>
        </div>
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className={`transition-colors p-1 ${showMenu ? 'text-purple-600' : 'text-slate-400 hover:text-slate-900'}`}
          >
            <MoreHorizontal size={20} />
          </button>

          {showMenu && (
            <div className={`absolute right-0 mt-2 w-48 border-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] z-50 animate-in fade-in zoom-in-95 duration-100 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-900'}`}>
              <div className="p-1">
                <button 
                  onClick={() => setShowMenu(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors border-b ${isDarkMode ? 'text-slate-300 hover:bg-slate-700 hover:text-purple-400 border-slate-700' : 'text-slate-600 hover:bg-slate-50 hover:text-purple-600 border-slate-100'}`}
                >
                  <Repeat2 size={14} />
                  Repost review
                </button>
                <button 
                  onClick={() => setShowMenu(false)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-900/20' : 'text-red-500 hover:bg-red-50'}`}
                >
                  <Flag size={14} />
                  Report
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Game Reference Tag with Cover */}
      {game && (
        <div 
          onClick={() => onGameClick?.(game.id)}
          className={`flex items-center gap-3 mb-4 p-2 border transition-all cursor-pointer group/game ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
        >
          <img 
            src={game.coverUrl} 
            alt={game.title} 
            className={`w-10 h-12 object-cover border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}
          />
          <div className="flex flex-col">
            <span className="text-[8px] text-purple-600 font-black uppercase tracking-[0.2em] mb-0.5 flex items-center gap-1">
              <Gamepad2 size={10} /> Reviewing
            </span>
            <span className={`text-xs font-black uppercase tracking-tight group-hover/game:text-purple-600 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              {game.title}
            </span>
          </div>
        </div>
      )}

      {/* Rating & Content */}
      <div className="mb-5 flex gap-4">
        <div className="flex-1">
          <div className="flex gap-0.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={12} 
                className={`${i < review.rating ? 'fill-yellow-500 text-yellow-500' : (isDarkMode ? 'text-slate-700' : 'text-slate-200')}`} 
              />
            ))}
          </div>
          <p className={`text-sm leading-relaxed font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {review.content}
          </p>
        </div>
      </div>

      {/* Interaction Bar */}
      <div className={`flex items-center justify-between pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-50'}`}>
        <div className="flex items-center gap-6">
          <button className={`flex items-center gap-2 transition-all group/btn ${isDarkMode ? 'text-slate-500 hover:text-pink-400' : 'text-slate-400 hover:text-pink-500'}`}>
            <Heart size={18} className="group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-black tracking-widest">{review.likes}</span>
          </button>
          <button className={`flex items-center gap-2 transition-all group/btn ${isDarkMode ? 'text-slate-500 hover:text-purple-400' : 'text-slate-400 hover:text-purple-600'}`}>
            <MessageCircle size={18} className="group-hover/btn:scale-110 transition-transform" />
            <span className="text-[10px] font-black tracking-widest">{review.commentsCount}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
