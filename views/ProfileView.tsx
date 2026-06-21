
import React, { useState } from 'react';
import { Grid, Bookmark, Share2, Heart, Play, Trophy, Clock, Target, Flag, Plus, Settings, Camera, X, Check, Star, BarChart2, Activity, TrendingUp, Gamepad2 } from 'lucide-react';
import { MOCK_REVIEWS, MOCK_GAMES, WAITED_2026_GAMES } from '../mockData';
import ReviewCard from '../components/ReviewCard';
import GameCard from '../components/GameCard';
import SettingsOverlay from '../components/SettingsOverlay';
import { User } from '../types';

interface ProfileViewProps {
  onSelectGame: (id: string) => void;
  wishlist: string[];
  journyx: string[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  user: User;
  onUpdateUser: (user: User) => void;
  journyxRatings?: Record<string, number>;
}

type TabType = 'posts' | 'journyx' | 'saved';
type ListType = 'followers' | 'following' | 'reviews' | 'journyx' | null;

// Custom SVG Logos for brand authenticity
const PlayStationLogo = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.873 13.916c-.53.18-1.206.31-1.928.31-2.454 0-3.328-1.59-3.328-3.414 0-1.896 1.054-3.448 3.431-3.448.72 0 1.346.12 1.825.293v1.517c-.43-.19-.947-.293-1.464-.293-1.155 0-1.74.827-1.74 1.896 0 1.052.551 1.931 1.74 1.931.534 0 1.034-.103 1.464-.293v1.5zM17.828 12c0 2.222-1.778 4-4 4s-4-1.778-4-4 1.778-4 4-4 4 1.778 4 4z"/>
    <circle cx="12" cy="12" r="2.5" fill="none" stroke="currentColor" strokeWidth="1"/>
  </svg>
);

const XboxLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2.5-12l2.5 3 2.5-3h2l-3.5 4.5 3.5 4.5h-2L12 12.5l-2.5 4.5h-2l3.5-4.5-3.5-4.5h2z"/>
  </svg>
);

const NintendoLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-3 15c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2zm6 0c-1.1 0-2-.9-2-2V9c0-1.1.9-2 2-2s2 .9 2 2v6c0 1.1-.9 2-2 2z"/>
    <circle cx="9" cy="10" r="1"/>
    <circle cx="15" cy="14" r="1"/>
  </svg>
);

const SteamLogo = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 1c4.97 0 9 4.03 9 9s-4.03 9-9 9a8.985 8.985 0 01-7.29-3.71l4.83-2.02c.31.43.81.71 1.38.71 1.01 0 1.83-.82 1.83-1.83 0-1.01-.82-1.83-1.83-1.83a1.812 1.812 0 00-1.42.69l-4.13-1.49a5.955 5.955 0 014.28-1.52c1.03 0 2.01.26 2.87.71l-1.87 2.12a.853.853 0 00-.32-.06.848.848 0 00-.85.85c0 .47.38.85.85.85s.85-.38.85-.85c0-.12-.03-.23-.07-.33l1.88-2.14a5.003 5.003 0 01.19 5.86l-4.83 2.02a8.985 8.985 0 006.31-8.31c0-4.97-4.03-9-9-9z"/>
  </svg>
);

const ProfileView: React.FC<ProfileViewProps> = ({ 
  onSelectGame, 
  wishlist,
  journyx,
  isDarkMode,
  setIsDarkMode,
  isOnline,
  setIsOnline,
  user,
  onUpdateUser,
  journyxRatings = {}
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('posts');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [activeList, setActiveList] = useState<ListType>(null);
  
  // Edit form state
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editAvatar, setEditAvatar] = useState(user.avatar);
  const [editCover, setEditCover] = useState(user.coverUrl || '');

  const wishlistedGames = [...MOCK_GAMES, ...WAITED_2026_GAMES].filter(g => wishlist.includes(g.id));
  const journyxGames = [...MOCK_GAMES, ...WAITED_2026_GAMES].filter(g => journyx.includes(g.id));
  const playedGames = MOCK_GAMES.filter(g => g.timePlayed);
  const reviewedGames = MOCK_GAMES.filter(g => MOCK_REVIEWS.some(r => r.gameId === g.id && r.userId === user.id));

  // Calculated stats for user's logged games
  const totalHoursNumeric = journyxGames.reduce((acc, game) => {
    const hours = parseFloat(game.timePlayed || '0');
    return acc + (isNaN(hours) ? 0 : hours);
  }, 0);

  const totalTrophiesUnlocked = journyxGames.reduce((acc, game) => {
    return acc + (game.trophiesCount || 0);
  }, 0);

  const totalTrophiesPossible = journyxGames.reduce((acc, game) => {
    return acc + (game.totalTrophies || 43); // fallback max trophies
  }, 0);

  const globalCompletionPercentage = totalTrophiesPossible > 0 
    ? Math.round((totalTrophiesUnlocked / totalTrophiesPossible) * 100) 
    : 0;

  const ratedGames = journyxGames.filter(g => journyxRatings[g.id]);
  const avgUserRating = ratedGames.length > 0 
    ? (ratedGames.reduce((acc, g) => acc + (journyxRatings[g.id] || 0), 0) / ratedGames.length).toFixed(1)
    : 'N/A';

  // Get dynamic specialties based on game type
  const getGameSpecialtyStats = (game: any) => {
    const isActionRPG = game.genre.some((g: string) => g.toLowerCase().includes('action rpg') || g.toLowerCase().includes('souls-like'));
    const isRPG = game.genre.some((g: string) => g.toLowerCase().includes('rpg'));
    const isShooter = game.genre.some((g: string) => g.toLowerCase().includes('shooter'));
    const isFighting = game.genre.some((g: string) => g.toLowerCase().includes('fighting'));
    const isRoguelike = game.genre.some((g: string) => g.toLowerCase().includes('roguelike'));
    const isSimulation = game.genre.some((g: string) => g.toLowerCase().includes('simulation') || g.toLowerCase().includes('sandbox'));

    if (isActionRPG) {
      return {
        type: 'Defeat',
        statLabel: 'ELITE BOSSES VANQUISHED',
        statVal: `${Math.round((parseFloat(game.timePlayed || '25') * 0.4))} / ${Math.round((parseFloat(game.timePlayed || '25') * 0.4) + 8)}`,
        detail: 'Includes domain bosses & pinnacle deities'
      };
    } else if (isRPG) {
      return {
        type: 'Campaign',
        statLabel: 'QUESTLINES COMPLETION',
        statVal: `${Math.min(100, Math.round(parseFloat(game.timePlayed || '30') * 1.1))}%`,
        detail: 'Primary fate arc + faction alliances'
      };
    } else if (isShooter) {
      return {
        type: 'Efficiency',
        statLabel: 'K / D PERFORMANCE INDEX',
        statVal: game.kdRatio ? `${game.kdRatio} K/D` : '2.45 K/D',
        detail: 'Calculated in competitive matchmaking'
      };
    } else if (isFighting) {
      return {
        type: 'Standing',
        statLabel: 'RANK CHAMPIONSHIP DIVISION',
        statVal: game.kdRatio ? `DIV ${Math.ceil(game.kdRatio * 3)} • ${Math.round(game.kdRatio * 820)} PT` : 'MASTER TIER • 1,530 PT',
        detail: 'Active arena brackets record'
      };
    } else if (isRoguelike) {
      return {
        type: 'Survival',
        statLabel: 'DUNGEON ESCAPER RATE',
        statVal: `${Math.ceil(parseFloat(game.timePlayed || '15') * 0.15)} / ${Math.ceil(parseFloat(game.timePlayed || '15') * 0.9 + 5)} RUNS`,
        detail: 'Completed seeds and cycle breakouts'
      };
    } else if (isSimulation) {
      return {
        type: 'Build',
        statLabel: 'REALM LOGISTICS EFFICIENCY',
        statVal: `${Math.min(100, Math.round(parseFloat(game.timePlayed || '10') * 1.4))}%`,
        detail: 'Core factory assembly and rate balance'
      };
    } else {
      return {
        type: 'Discovery',
        statLabel: 'TERRAIN DISCOVERY METRIC',
        statVal: `${Math.min(100, Math.round(parseFloat(game.timePlayed || '10') * 1.8))}%`,
        detail: 'Mapped zones, landmarks, & checklists'
      };
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: editName,
      bio: editBio,
      avatar: editAvatar,
      coverUrl: editCover
    });
    setIsEditing(false);
  };

  const platformMeta = {
    playstation: { color: '#00439c', label: 'PSN', icon: <PlayStationLogo /> },
    xbox: { color: '#107c10', label: 'Xbox', icon: <XboxLogo /> },
    nintendo: { color: '#e60012', label: 'Switch', icon: <NintendoLogo /> },
    pc: { color: '#1b2838', label: 'Steam', icon: <SteamLogo /> },
  };

  return (
    <div className={`pb-10 transition-colors duration-300 font-sans ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-white text-slate-900'}`}>
      <header className="relative">
        <div 
          className={`h-48 transition-colors duration-300 bg-cover bg-center relative ${!user.coverUrl && (isDarkMode ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-900 to-slate-800')}`}
          style={user.coverUrl ? { backgroundImage: `url(${user.coverUrl})` } : {}}
        >
          {user.coverUrl && <div className="absolute inset-0 bg-black/30" />}
        </div>
        <div className="px-6 -mt-16 flex flex-col items-start relative z-10">
          <div className="flex w-full justify-between items-end mb-8">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className={`w-32 h-32 rounded-none border-4 shadow-xl object-cover transition-colors duration-300 ${isDarkMode ? 'border-slate-900 bg-slate-800' : 'border-white bg-white'}`} 
            />
            <div className="flex gap-2 mb-2 items-center">
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className={`p-3 border rounded-none transition-all shadow-sm ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-[#764d9a]' : 'bg-white border-slate-200 text-slate-400 hover:text-[#764d9a]'}`}
              >
                <Settings size={20} />
              </button>
              <button 
                onClick={() => setIsEditing(true)}
                className="px-8 py-3 bg-[#764d9a] rounded-none text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-purple-900/10 active:scale-95 transition-all"
              >
                Edit profile
              </button>
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className={`text-3xl font-black tracking-tighter uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.name}</h2>
            <p className="text-sm text-[#764d9a] font-black mb-4 uppercase tracking-[0.1em]">{user.handle}</p>
            <div className="flex gap-6 mb-4">
              <button onClick={() => setActiveList('followers')} className="text-left hover:opacity-70 transition-opacity">
                <span className={`text-lg font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.stats.followers}</span>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Followers</span>
              </button>
              <button onClick={() => setActiveList('following')} className="text-left hover:opacity-70 transition-opacity">
                <span className={`text-lg font-black block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.stats.following}</span>
                <span className="text-[9px] text-slate-400 uppercase font-black tracking-widest">Following</span>
              </button>
            </div>
            <p className={`text-sm leading-relaxed max-w-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{user.bio}</p>
          </div>

          {/* LINKED PLATFORMS SECTION */}
          <div className="w-full mb-8">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">GAMING DEVICES</p>
            <div className="flex items-center gap-4">
              {user.linkedProfiles?.map((profile) => {
                const meta = platformMeta[profile.platform];
                return (
                  <div key={profile.platform} className="relative group">
                    <div 
                      className={`w-11 h-11 rounded-none flex items-center justify-center transition-all duration-300 relative cursor-pointer border ${
                        profile.connected 
                          ? 'shadow-sm border-transparent hover:scale-105' 
                          : 'opacity-20 grayscale border-dashed border-slate-300 hover:opacity-100 hover:grayscale-0'
                      }`}
                      style={{ backgroundColor: profile.connected ? meta.color : 'transparent' }}
                    >
                      <div className="text-white">
                        {meta.icon}
                      </div>
                      {!profile.connected && (
                        <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-slate-100 rounded-full flex items-center justify-center border border-white">
                          <Plus size={8} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className={`flex gap-12 mb-10 w-full py-8 border-y transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <button onClick={() => setActiveList('reviews')} className="text-left hover:opacity-70 transition-opacity">
              <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{user.stats.reviews}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Reviews</p>
            </button>
            <button onClick={() => setActiveList('journyx')} className="text-left hover:opacity-70 transition-opacity">
              <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{journyx.length}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Journyx</p>
            </button>
            <div className="text-left">
              <p className={`text-2xl font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{wishlist.length}</p>
              <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Wishlist</p>
            </div>
          </div>
        </div>
      </header>

      {/* EDIT PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsEditing(false)}
          />
          <div className={`relative w-full max-w-md border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b flex items-center justify-between border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#764d9a]">Edit Profile Data</h3>
              <button onClick={() => setIsEditing(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto no-scrollbar">
              {/* Cover Edit */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Profile Cover URL</label>
                <div className="relative group">
                  <div 
                    className="h-24 w-full bg-slate-800 border border-slate-700 bg-cover bg-center flex items-center justify-center overflow-hidden"
                    style={editCover ? { backgroundImage: `url(${editCover})` } : {}}
                  >
                    {!editCover && <Camera size={24} className="text-slate-600" />}
                  </div>
                  <input 
                    type="text" 
                    value={editCover}
                    onChange={(e) => setEditCover(e.target.value)}
                    placeholder="Paste image URL..."
                    className={`w-full mt-2 p-3 text-xs font-bold border rounded-none focus:outline-none focus:border-[#764d9a] transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              {/* Avatar Edit */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Profile Picture URL</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-800 border border-slate-700 overflow-hidden flex-shrink-0">
                    <img src={editAvatar} className="w-full h-full object-cover" alt="Avatar preview" />
                  </div>
                  <input 
                    type="text" 
                    value={editAvatar}
                    onChange={(e) => setEditAvatar(e.target.value)}
                    placeholder="Paste image URL..."
                    className={`flex-1 p-3 text-xs font-bold border rounded-none focus:outline-none focus:border-[#764d9a] transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                  />
                </div>
              </div>

              {/* Name Edit */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Display Name</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className={`w-full p-3 text-xs font-bold border rounded-none focus:outline-none focus:border-[#764d9a] transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>

              {/* Bio Edit */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-500">Bio</label>
                <textarea 
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  rows={3}
                  className={`w-full p-3 text-xs font-bold border rounded-none focus:outline-none focus:border-[#764d9a] transition-colors resize-none ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex gap-3">
              <button 
                onClick={() => setIsEditing(false)}
                className={`flex-1 py-4 text-[10px] font-black uppercase tracking-widest border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-50 border-slate-200 text-slate-500 hover:text-slate-900'}`}
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveProfile}
                className="flex-1 py-4 bg-[#764d9a] text-white text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#764d9a]/90 transition-colors"
              >
                <Check size={14} />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <SettingsOverlay 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        toggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* LIST OVERLAY (Followers, Following, Reviews, Journyx) */}
      {activeList && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
            onClick={() => setActiveList(null)}
          />
          <div className={`relative w-full max-w-md border shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="p-6 border-b flex items-center justify-between border-slate-800">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[#764d9a]">
                {activeList === 'followers' && 'Followers'}
                {activeList === 'following' && 'Following'}
                {activeList === 'reviews' && 'Reviewed Games'}
                {activeList === 'journyx' && 'Active Journyx'}
              </h3>
              <button onClick={() => setActiveList(null)} className="text-slate-500 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto no-scrollbar space-y-4">
              {(activeList === 'followers' || activeList === 'following') && (
                <div className="space-y-4">
                  {(activeList === 'followers' ? user.followersList : user.followingList)?.map(person => (
                    <div key={person.id} className={`flex items-center gap-4 p-3 border transition-colors ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                      <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-none object-cover" />
                      <div>
                        <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{person.name}</p>
                        <p className="text-[10px] text-[#764d9a] font-bold">{person.handle}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(activeList === 'reviews' || activeList === 'journyx') && (
                <div className="space-y-4">
                  {(activeList === 'reviews' ? reviewedGames : journyxGames).map(game => (
                    <div 
                      key={game.id} 
                      onClick={() => {
                        onSelectGame(game.id);
                        setActiveList(null);
                      }}
                      className={`flex items-center gap-4 p-3 border cursor-pointer transition-all hover:border-[#764d9a] ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}
                    >
                      <img src={game.coverUrl} referrerPolicy="no-referrer" alt={game.title} className="w-12 h-16 object-cover" />
                      <div>
                        <p className={`text-xs font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</p>
                        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">{game.developer}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <section className="px-6">
        <div className={`flex items-center gap-10 mb-8 overflow-x-auto no-scrollbar border-b transition-colors duration-300 ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'posts' ? 'text-[#764d9a] border-b-2 border-[#764d9a]' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Posts
          </button>
          <button 
            onClick={() => setActiveTab('journyx')}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'journyx' ? 'text-[#764d9a] border-b-2 border-[#764d9a]' : 'text-slate-400 hover:text-slate-300'}`}
          >
            My Journyx
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            className={`pb-4 text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2 whitespace-nowrap transition-all ${activeTab === 'saved' ? 'text-[#764d9a] border-b-2 border-[#764d9a]' : 'text-slate-400 hover:text-slate-300'}`}
          >
            Saved
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="space-y-6">
            {MOCK_REVIEWS.length > 0 ? (
              MOCK_REVIEWS.slice(0, 1).map(review => (
                <ReviewCard key={review.id} review={review} onGameClick={onSelectGame} isDarkMode={isDarkMode} />
              ))
            ) : (
              <p className="text-slate-400 text-sm py-16 text-center italic font-bold uppercase tracking-widest opacity-40">Zero communications yet.</p>
            )}
          </div>
        )}

        {activeTab === 'journyx' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2">
            
            {/* JOURNYX ANALYTICAL INTELLIGENCE CENTER (Global Stats Dashboard) */}
            {journyxGames.length > 0 && (
              <div className={`border p-5 rounded-none relative overflow-hidden transition-colors ${isDarkMode ? 'bg-[#21162c] border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
                  <BarChart2 size={72} className="text-[#764d9a]" />
                </div>
                
                <p className="text-[10px] text-slate-400 font-sans font-bold uppercase tracking-widest mb-1">
                  JOURNYX CORE INTELLIGENCE CENTER
                </p>
                <h3 className={`text-lg font-heading font-black uppercase tracking-tight mb-5 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  GAMOLOGY PROFILE METRICS
                </h3>
                
                {/* Visual statistics grid */}
                <div className="grid grid-cols-4 gap-2 mb-5">
                  <div className={`p-2 border flex flex-col justify-between items-center text-center ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[8px] text-slate-550 dark:text-slate-450 font-sans uppercase font-bold tracking-wider leading-none mb-2 block h-6 flex items-center justify-center">TOTAL TIME</span>
                    <span className="text-lg font-bold text-[#764d9a] font-heading leading-none mt-auto">{totalHoursNumeric}h</span>
                  </div>
                  
                  <div className={`p-2 border flex flex-col justify-between items-center text-center ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[8px] text-slate-550 dark:text-slate-450 font-sans uppercase font-bold tracking-wider leading-none mb-2 block h-6 flex items-center justify-center">ACHIEVEMENTS</span>
                    <span className="text-lg font-bold text-amber-500 font-heading leading-none mt-auto">{globalCompletionPercentage}%</span>
                  </div>
                  
                  <div className={`p-2 border flex flex-col justify-between items-center text-center ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[8px] text-slate-550 dark:text-slate-450 font-sans uppercase font-bold tracking-wider leading-none mb-2 block h-6 flex items-center justify-center">AVG RATING</span>
                    <span className="text-lg font-bold text-amber-400 font-heading leading-none mt-auto">{avgUserRating}</span>
                  </div>
                  
                  <div className={`p-2 border flex flex-col justify-between items-center text-center ${isDarkMode ? 'bg-slate-950/40 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <span className="text-[8px] text-slate-550 dark:text-slate-450 font-sans uppercase font-bold tracking-wider leading-none mb-2 block h-6 flex items-center justify-center">PROJECTS</span>
                    <span className="text-lg font-bold text-emerald-500 font-heading leading-none mt-auto">{journyxGames.length}</span>
                  </div>
                </div>

                {/* Global Trophy Unlock progress bar */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-sans font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <span>OVERALL COMPLETION RATIO</span>
                    <span>{totalTrophiesUnlocked} / {totalTrophiesPossible} ACHIEVEMENTS</span>
                  </div>
                  <div className="w-full h-2 bg-slate-300 dark:bg-slate-850 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#764d9a] rounded-full transition-all duration-1000" 
                      style={{ width: `${globalCompletionPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2 border-slate-800/20">
                <h3 className={`text-md font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                  INDIVIDUAL LOGS & PROGRESS
                </h3>
                <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                  {journyxGames.length} ACTIVE TILES
                </span>
              </div>

              {journyxGames.length > 0 ? journyxGames.map(game => {
                const hoursNumber = parseFloat(game.timePlayed || '0') || 0;
                // Achievements calculation
                const trophiesMax = game.totalTrophies || 43;
                const trophiesUnlocked = game.trophiesCount || 0;
                const compPercent = Math.min(100, Math.round((trophiesUnlocked / trophiesMax) * 100));

                // Determine rank status
                let compStatus = 'IN PROGRESS';
                let statusColor = 'text-[#764d9a] border-[#764d9a]/20 bg-[#764d9a]/5';
                if (compPercent === 100) {
                  compStatus = '100% COMPLETED 🏆';
                  statusColor = 'text-emerald-500 border-emerald-500/20 bg-emerald-500/5';
                } else if (compPercent >= 80) {
                  compStatus = 'FINAL STRETCH 🎯';
                  statusColor = 'text-amber-500 border-amber-500/20 bg-amber-500/5';
                } else if (compPercent >= 50) {
                  compStatus = 'MID-STAGE ADVANCED';
                  statusColor = 'text-blue-500 border-blue-500/20 bg-blue-500/5';
                } else if (compPercent > 0) {
                  compStatus = 'EARLY EXPEDITION';
                  statusColor = 'text-purple-400 border-purple-400/20 bg-purple-400/5';
                } else {
                  compStatus = 'COMMENCING RECON';
                  statusColor = 'text-slate-400 border-slate-700/20 bg-[#764d9a]/5';
                }

                // Play session stats
                const weeklyHours = (hoursNumber * 0.12).toFixed(1);
                const playSessionsCount = Math.max(1, Math.ceil(hoursNumber / 3.5));
                
                // Specialty stats custom tailored
                const specialty = getGameSpecialtyStats(game);

                return (
                  <div 
                    key={game.id} 
                    onClick={() => onSelectGame(game.id)}
                    className={`border rounded-none p-4.5 flex flex-col md:flex-row gap-5 transition-all cursor-pointer active:scale-[0.99] hover:shadow-md ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-[#764d9a]' : 'bg-white border-slate-200 hover:border-[#764d9a]'}`}
                  >
                    {/* Game Cover */}
                    <div className="flex md:flex-col gap-4 flex-row items-start md:items-center">
                      <div className={`w-24 h-32 rounded-none overflow-hidden flex-shrink-0 shadow-sm border border-slate-800/10 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <img src={game.coverUrl} referrerPolicy="no-referrer" className={`w-full h-full object-cover transition-all duration-500 ${isDarkMode ? 'grayscale-[0.3] hover:grayscale-0' : 'grayscale-[0.1] hover:grayscale-0'}`} alt={game.title} />
                      </div>
                      
                      {/* Condensed platform tags */}
                      <div className="flex flex-wrap gap-1 max-w-[100px] justify-start md:justify-center">
                        {game.platform.map((plat: string) => (
                          <span key={plat} className="text-[8px] font-black border border-slate-700/30 px-1 py-0.5 text-slate-400 bg-slate-100 dark:bg-slate-950 uppercase tracking-wide">
                            {plat}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Main Information Block */}
                    <div className="flex-1 space-y-3.5">
                      <div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                          <h4 className={`font-black text-md leading-tight uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</h4>
                          <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border ${statusColor}`}>
                            {compStatus}
                          </span>
                        </div>
                        
                        {/* Custom visual user rating selection */}
                        {journyxRatings[game.id] ? (
                          <div className="flex gap-0.5" title={`My Rating: ${journyxRatings[game.id]} Stars`}>
                            {[1, 2, 3, 4, 5].map(v => (
                              <Star 
                                key={v} 
                                size={12} 
                                className={v <= (journyxRatings[game.id] || 0) ? "fill-amber-400 text-amber-400" : "text-slate-300 dark:text-slate-700"} 
                              />
                            ))}
                          </div>
                        ) : (
                          <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">UNRATED ENTRY</p>
                        )}
                      </div>

                      {/* COMPLETION PROGRESS BAR */}
                      <div className="space-y-1 bg-slate-950/10 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/40 p-2.5">
                        <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-wider text-slate-400">
                          <span className="flex items-center gap-1"><Trophy size={10} className="text-amber-500" /> ACHIEVEMENT RATIO</span>
                          <span className="text-[#764d9a]">{compPercent}% ({trophiesUnlocked} / {trophiesMax})</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-none overflow-hidden">
                          <div 
                            className="h-full bg-[#764d9a] transition-all duration-700" 
                            style={{ width: `${compPercent}%` }}
                          />
                        </div>
                      </div>

                      {/* STATS MATRIX SECTION (Includes different types of stats) */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                        
                        {/* Playtime breakdown stat block */}
                        <div className="space-y-1 border-l-2 border-[#764d9a]/45 pl-2">
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">CHRONOLOGICAL PACE</p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                              <Clock size={11} className="text-amber-500" />
                              <span className="text-xs font-black">{game.timePlayed || '0h'} LOGGED</span>
                            </div>
                            <p className="text-[8px] text-slate-400 uppercase tracking-tight font-bold">
                              Pace: {weeklyHours}h/wk • {playSessionsCount} Sessions
                            </p>
                          </div>
                        </div>

                        {/* Genre/Developer tailored specialty stat block */}
                        <div className="space-y-1 border-l-2 border-emerald-500/45 pl-2">
                          <p className="text-[8px] text-slate-400 font-black uppercase tracking-wider">{specialty.statLabel}</p>
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5 text-slate-650 dark:text-slate-300">
                              <Activity size={11} className="text-emerald-500" />
                              <span className="text-xs font-black uppercase text-emerald-500">{specialty.statVal}</span>
                            </div>
                            <p className="text-[8px] text-slate-400 uppercase tracking-tight font-bold">
                              {specialty.detail}
                            </p>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                );
              }) : (
                <div className={`text-center py-20 border border-dashed transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                  <Play size={32} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">NO ACTIVE JOURNYX</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'saved' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
            <h3 className={`text-xl font-black uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>WISH LIST</h3>
            {wishlistedGames.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {wishlistedGames.map(game => (
                  <GameCard key={game.id} game={game} onClick={onSelectGame} compact={true} isDarkMode={isDarkMode} />
                ))}
              </div>
            ) : (
              <div className={`text-center py-20 border border-dashed transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                <Heart size={32} className={`mx-auto mb-4 ${isDarkMode ? 'text-slate-700' : 'text-slate-200'}`} />
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">DATABASE EMPTY</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProfileView;
