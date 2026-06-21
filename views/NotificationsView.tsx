import React, { useState } from 'react';
import { Heart, UserPlus, MessageSquare, Star, Zap, Search } from 'lucide-react';
import { Chat } from '../types';

interface NotificationsViewProps {
  chats: Chat[];
  isDarkMode: boolean;
  onSelectChat?: (chatId: string) => void;
  currentUserId: string;
}

const MOCK_NOTIFICATIONS = [
  { id: '1', type: 'like', user: 'AstroViking_TV', content: 'liked your review of Elden Ring', time: '2m ago', avatar: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=150&h=150&fit=crop' },
  { id: '2', type: 'follow', user: 'Kratos_ITA', content: 'started following your journey', time: '1h ago', avatar: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=150&h=150&fit=crop' },
  { id: '3', type: 'comment', user: 'ViperNeon_X', content: 'replied: "I totally agree about the music!"', time: '3h ago', avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=150&h=150&fit=crop' },
  { id: '4', type: 'system', user: 'Journyx', content: 'Your review of "Hades II" is trending!', time: '1d ago', avatar: null },
];

const NotificationsView: React.FC<NotificationsViewProps> = ({ chats, isDarkMode, onSelectChat, currentUserId }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering based on search query
  const filteredChats = chats.filter(chat => {
    const otherParticipant = chat.participants.find(p => p.id !== currentUserId) || chat.participants[1] || chat.participants[0];
    return otherParticipant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.gameTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
           chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredNotifications = MOCK_NOTIFICATIONS.filter(notif => {
    return notif.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
           notif.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`p-6 pb-28 min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-white text-slate-900'}`}>
      
      {/* HEADER */}
      <header className="mb-8">
        <h2 className={`text-3xl font-heading font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Activity</h2>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">REAL-TIME DATA FEED</p>
      </header>

      {/* SEARCH BAR */}
      <div className="mb-10 relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search size={16} className={isDarkMode ? 'text-slate-500' : 'text-slate-400'} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="SEARCH USER, TRANSCRIPT OR GAME..."
          className={`w-full text-xs font-bold uppercase tracking-wider pl-11 pr-4 py-3.5 border transition-all rounded-xl focus:outline-none ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-800 text-white focus:border-[#ee710b]' 
              : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#764d9a]'
          }`}
        />
      </div>
  
      {/* DIRECT CHANNELS SECTION */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">DIRECT CHANNELS</h3>
          {filteredChats.some(c => c.unread) && (
            <span className="text-[9px] font-black text-white bg-[#ee710b] px-2.5 py-1 rounded-xl shadow-sm">NEW ACTIVITY</span>
          )}
        </div>
        
        <div className="space-y-4">
          {filteredChats.length > 0 ? filteredChats.map(chat => {
            const otherParticipant = chat.participants.find(p => p.id !== currentUserId) || chat.participants[1] || chat.participants[0];
            return (
              <div 
                key={chat.id} 
                onClick={() => onSelectChat && onSelectChat(chat.id)}
                className={`flex items-center gap-4 border p-4.5 cursor-pointer rounded-2xl transition-all duration-300 shadow-sm ${
                  isDarkMode 
                    ? 'bg-slate-900/60 border-slate-800 hover:bg-slate-800/80 hover:border-[#ee710b]/40 hover:scale-[1.01]' 
                    : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-[#764d9a]/40 hover:scale-[1.01]'
                }`}
              >
                <img 
                  src={otherParticipant.avatar} 
                  alt={otherParticipant.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-slate-500/20 shadow-sm" 
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1.5">
                    <h4 className={`text-xs font-black uppercase tracking-tight ${chat.unread ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-400'}`}>
                      {otherParticipant.name} 
                      <span className="text-[9px] text-[#ee710b] ml-2 font-bold bg-[#ee710b]/10 px-2 py-0.5 rounded-md">[{chat.gameTitle}]</span>
                    </h4>
                    <span className="text-[9px] text-slate-400 font-bold font-mono tracking-tighter">{chat.timestamp}</span>
                  </div>
                  <p className={`text-[11px] font-sans truncate ${chat.unread ? (isDarkMode ? 'text-slate-200 font-bold' : 'text-slate-700 font-bold') : 'text-slate-400 font-medium'}`}>
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread && <div className="w-2.5 h-2.5 bg-[#ee710b] rounded-full animate-pulse shadow-sm" />}
              </div>
            );
          }) : (
            <div className={`p-10 border border-dashed rounded-2xl text-center ${isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'}`}>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">No matching channels found</p>
            </div>
          )}
        </div>
      </section>

      {/* EVENT LOG SECTION */}
      <section>
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6">EVENT LOG</h3>
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? filteredNotifications.map(notif => (
            <div 
              key={notif.id} 
              className={`flex gap-4 items-start p-4.5 border rounded-2xl transition-all duration-300 shadow-sm ${
                isDarkMode 
                  ? 'bg-slate-900/60 border-slate-800' 
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="w-10 h-10 flex-shrink-0 relative">
                {notif.avatar ? (
                  <img src={notif.avatar} className="w-full h-full rounded-full object-cover border-2 border-slate-500/10" alt="Avatar" />
                ) : (
                  <div className="w-full h-full bg-[#ee710b]/15 rounded-full flex items-center justify-center border border-[#ee710b]/20">
                    <Star size={16} className="text-[#ee710b]" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-5.5 h-5.5 rounded-full flex items-center justify-center border ${
                  isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                }`}>
                  {notif.type === 'like' && <Heart size={10} className="text-pink-500 fill-pink-500" />}
                  {notif.type === 'follow' && <UserPlus size={10} className="text-[#ee710b]" />}
                  {notif.type === 'comment' && <MessageSquare size={10} className="text-blue-500" />}
                  {notif.type === 'system' && <Zap size={10} className="text-amber-500 fill-amber-500" />}
                </div>
              </div>
              <div className="flex-1">
                <p className={`text-[11.5px] leading-relaxed font-sans ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className={`font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    {notif.user || 'Journyx'}
                  </span>{' '}
                  {notif.content}
                </p>
                <p className="text-[9px] text-slate-450 font-bold uppercase mt-1.5 font-mono tracking-wider">{notif.time}</p>
              </div>
            </div>
          )) : (
            <div className={`p-10 border border-dashed rounded-2xl text-center ${isDarkMode ? 'border-slate-800 bg-slate-900/10' : 'border-slate-200 bg-slate-50/50'}`}>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest opacity-60">No matching events found</p>
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default NotificationsView;
