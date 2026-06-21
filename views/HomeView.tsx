
import React, { useMemo, useState } from 'react';
import { ArrowRight, TrendingUp, Sparkles, Clock, Crown, ChevronRight, Zap, Settings } from 'lucide-react';
import { MOCK_GAMES, MOCK_REVIEWS, WAITED_2026_GAMES } from '../mockData';
import GameCard from '../components/GameCard';
import ReviewCard from '../components/ReviewCard';
import SettingsOverlay from '../components/SettingsOverlay';
import Logo from '../components/Logo';
import { ViewType, User } from '../types';
import { GameOfTheYearIcon, MostHypedIcon, MostAnticipatedIcon, SuggestedForYouIcon } from '../components/icons';

interface HomeViewProps {
  onSelectGame: (id: string) => void;
  onNavigate: (view: ViewType) => void;
  wishlist: string[];
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  isOnline: boolean;
  setIsOnline: (val: boolean) => void;
  user: User;
}

const HomeView: React.FC<HomeViewProps> = ({ 
  onSelectGame, 
  onNavigate, 
  wishlist,
  isDarkMode,
  setIsDarkMode,
  isOnline,
  setIsOnline,
  user
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMostPlayedExpanded, setIsMostPlayedExpanded] = useState(false);

  const mostPlayedThisYear = useMemo(() => {
    const rawList = [
      { title: 'Counter-Strike 2', defaultId: 'p1', rating: 4.8, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg' },
      { title: 'Minecraft', defaultId: 'extra-9', rating: 4.9, fallbackImg: '/covers/minecraft.jpg' },
      { title: 'Roblox', defaultId: 'extra-6', rating: 4.2, fallbackImg: '/covers/roblox.jpg' },
      { title: 'Fortnite', defaultId: 'extra-2', rating: 4.5, fallbackImg: '/covers/fortnite.jpg' },
      { title: 'League of Legends', defaultId: 'extra-lol', rating: 4.4, fallbackImg: '/covers/league-of-legends.jpg' },
      { title: 'The Sims 4', defaultId: 'extra-sims4', rating: 4.3, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/library_600x900.jpg' },
      { title: 'Valorant', defaultId: 'extra-39', rating: 4.4, fallbackImg: '/covers/valorant.jpg' },
      { title: 'Rocket League', defaultId: 'extra-rocketleague', rating: 4.6, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252950/library_600x900.jpg' },
      { title: 'Overwatch', defaultId: 'extra-overwatch', rating: 4.0, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2357570/library_600x900.jpg' },
      { title: 'Diablo IV', defaultId: 'extra-diablo4', rating: 4.1, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2344520/library_600x900.jpg' },
      { title: 'Dota 2', defaultId: 'p3', rating: 4.7, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/library_600x900.jpg' },
      { title: 'PUBG: Battlegrounds', defaultId: 'p2', rating: 4.3, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/library_600x900.jpg' },
      { title: 'Forza Horizon 6', defaultId: 'extra-forza6', rating: 4.8, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg' },
      { title: 'Apex Legends', defaultId: 'p5', rating: 4.6, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg' },
      { title: 'R.E.P.O.', defaultId: 'extra-repo', rating: 4.5, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3211510/library_600x900.jpg' },
      { title: 'Grand Theft Auto V', defaultId: 'p6', rating: 4.9, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg' },
      { title: 'World of Warcraft', defaultId: 'extra-wow', rating: 4.8, fallbackImg: '/covers/world-of-warcraft.jpg' },
      { title: 'Slay the Spire 2', defaultId: 'extra-slaythespire2', rating: 4.9, fallbackImg: '/covers/slay-the-spire.jpg' },
      { title: 'Battlefield 6', defaultId: 'extra-battlefield6', rating: 4.2, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1517290/library_600x900.jpg' },
      { title: 'Tom Clancy\'s Rainbow Six Siege', defaultId: 'extra-rainbowsix', rating: 4.7, fallbackImg: 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/359550/library_600x900.jpg' }
    ];

    return rawList.map(raw => {
      const found = MOCK_GAMES.find(g => g.id === raw.defaultId || g.title.toLowerCase() === raw.title.toLowerCase());
      if (found) {
        return {
          ...found,
          title: raw.title,
          rating: raw.rating,
          coverUrl: raw.fallbackImg || found.coverUrl
        };
      }
      return {
        id: raw.defaultId,
        title: raw.title,
        coverUrl: raw.fallbackImg,
        rating: raw.rating,
        releaseDate: '2025-01-01',
        genre: ['Action', 'Multiplayer'],
        platform: ['PC', 'PS5', 'Xbox'],
        description: `Play ${raw.title}, the highly competitive and popular game online with friends.`,
        developer: 'Developer'
      };
    });
  }, []);

  const waitedGames = WAITED_2026_GAMES.slice(0, 9);
  
  const gotyGames = [
    MOCK_GAMES.find(g => g.id === 'p1'),
    MOCK_GAMES.find(g => g.id === 'p3'),
    MOCK_GAMES.find(g => g.id === 'p8')
  ].filter(Boolean) as any[];

  const recentReviews = MOCK_REVIEWS.slice(0, 4);

  const suggestedGames = useMemo(() => {
    const playedIds = MOCK_GAMES.filter(g => g.timePlayed).map(g => g.id);
    const userInterestIds = [...new Set([...playedIds, ...wishlist])];
    
    const userGenres = new Set<string>();
    MOCK_GAMES.filter(g => userInterestIds.includes(g.id)).forEach(g => {
      g.genre.forEach(genre => userGenres.add(genre));
    });

    if (userGenres.size === 0) {
      return MOCK_GAMES.filter(g => !userInterestIds.includes(g.id)).slice(10, 22);
    }

    return MOCK_GAMES.filter(game => {
      const isNotHandled = !userInterestIds.includes(game.id);
      const hasMatchingGenre = game.genre.some(genre => userGenres.has(genre));
      return isNotHandled && hasMatchingGenre;
    }).slice(0, 15);
  }, [wishlist]);

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-white text-slate-900'}`}>
      {/* HEADER BAR */}
      <div className={`w-full flex items-center justify-between p-6 border-b transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23]/80 backdrop-blur-md border-slate-800' : 'bg-white/80 backdrop-blur-md border-slate-200'}`}>
        <button 
          onClick={() => setIsSettingsOpen(true)}
          className={`transition-colors ${isDarkMode ? 'text-slate-500 hover:text-[#ee710b]' : 'text-slate-400 hover:text-[#764d9a]'}`}
        >
          <Settings size={22} />
        </button>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em]">Piriux Session</p>
            <h3 className={`text-sm font-black uppercase ${isOnline ? (isDarkMode ? 'text-white' : 'text-slate-900') : 'text-slate-500'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </h3>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className={`w-10 h-10 rounded-full border object-cover ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`} 
          />
        </div>
      </div>

      <SettingsOverlay 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        isOnline={isOnline}
        toggleOnline={() => setIsOnline(!isOnline)}
      />

      <div className="p-6 pb-12">
        <header className="flex flex-col items-center mb-16 mt-4">
          <div className="text-center">
            <Logo isDarkMode={isDarkMode} className="w-full h-auto mx-auto block" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.4em] mt-3">
              YOUR PERSONAL GAMING DIARY
            </p>
          </div>
        </header>

        {/* MOST PLAYED THIS YEAR (3x4 Grid) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-500/10 border-emerald-500/20'}`}>
              <MostHypedIcon size={22} className="text-violet-500" />
            </div>
            <h2 className={`text-lg font-heading font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MOST PLAYED THIS YEAR</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {mostPlayedThisYear.slice(0, isMostPlayedExpanded ? 20 : 12).map((game, index) => (
              <GameCard key={game.id} game={game} onClick={onSelectGame} minimal={true} isDarkMode={isDarkMode} rank={index + 1} />
            ))}
          </div>

          <button 
            onClick={() => setIsMostPlayedExpanded(!isMostPlayedExpanded)}
            className={`flex items-center justify-center gap-3 w-full py-5 border text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white/80 border-white/90 text-slate-600 hover:bg-white'}`}
          >
            {isMostPlayedExpanded ? 'SHOW LESS' : 'VIEW ALL'}
            <ChevronRight size={14} className={`group-hover:translate-x-1 transition-transform ${isMostPlayedExpanded ? 'rotate-90' : ''}`} />
          </button>
        </section>

        {/* GAME OF THE YEAR WINNERS (3x1 Grid) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-500/10 border-amber-500/20'}`}>
              <GameOfTheYearIcon size={22} className="text-violet-500" />
            </div>
            <h2 className={`text-lg font-heading font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GAME OF THE YEAR WINNERS</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            {gotyGames.map((game, index) => (
              <div key={game.id} className="relative group cursor-pointer" onClick={() => onSelectGame(game.id)}>
                <div className={`aspect-[3/4] overflow-hidden border transition-colors ${isDarkMode ? 'border-[#ee710b]/10 bg-slate-900' : 'border-[#ee710b]/20 bg-white/50'}`}>
                  <img src={game.coverUrl} referrerPolicy="no-referrer" className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ${isDarkMode ? 'grayscale-[0.2] group-hover:grayscale-0' : ''}`} alt={game.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent flex items-end p-2">
                    <span className="text-[9px] font-black text-[#ee710b] uppercase tracking-tighter">RANK {index + 1}</span>
                  </div>
                </div>
                <h4 className={`mt-3 text-[10px] font-black truncate uppercase tracking-tight leading-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</h4>
              </div>
            ))}
          </div>
        </section>

        {/* MOST ANTICIPATED OF THE YEAR (3x3 Grid) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? 'bg-[#ee710b]/20 border-[#ee710b]/30' : 'bg-[#ee710b]/10 border-[#ee710b]/20'}`}>
              <MostAnticipatedIcon size={22} className="text-violet-500" />
            </div>
            <h2 className={`text-lg font-heading font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MOST ANTICIPATED OF THE YEAR</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            {waitedGames.map(game => (
              <GameCard key={game.id} game={game} onClick={onSelectGame} minimal={true} isDarkMode={isDarkMode} />
            ))}
          </div>

          <button 
            onClick={() => onNavigate('search')}
            className={`flex items-center justify-center gap-3 w-full py-5 border text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white/80 border-white/90 text-slate-600 hover:bg-white'}`}
          >
            VIEW ALL
            <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </section>

        {/* RECENT GLOBAL REVIEWS (4 Reviews) */}
        <section className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? 'bg-[#ee710b]/20 border-[#ee710b]/30' : 'bg-[#ee710b]/10 border-[#ee710b]/20'}`}>
              <Clock size={20} className="text-[#ee710b]" />
            </div>
            <h2 className={`text-lg font-heading font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>GLOBAL FEED</h2>
          </div>
          
          <div className="space-y-6">
            {recentReviews.map(review => (
              <ReviewCard key={review.id} review={review} onGameClick={onSelectGame} isDarkMode={isDarkMode} />
            ))}
          </div>
          
          <button 
            onClick={() => onNavigate('notifications')}
            className={`mt-8 flex items-center justify-center gap-3 w-full py-5 border text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-500 hover:text-[#ee710b]' : 'bg-white/80 border-white/90 text-slate-500 hover:text-[#764d9a]'}`}
          >
            COMMUNITY ACTIVITY 
            <ArrowRight size={14} />
          </button>
        </section>

        {/* SUGGESTED FOR YOU (Swipeable Carousel) */}
        <section className={`mb-10 py-12 border-y transition-colors relative overflow-hidden ${isDarkMode ? 'border-slate-800 bg-slate-900/20' : 'border-white/20 bg-white/10'}`}>
          <div className="px-6 flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center border ${isDarkMode ? 'bg-[#764d9a]/20 border-[#764d9a]/30' : 'bg-[#764d9a]/10 border-[#764d9a]/20'}`}>
                <SuggestedForYouIcon size={22} className="text-violet-500" />
              </div>
              <div>
                <p className="text-[9px] text-[#764d9a] font-black uppercase tracking-[0.3em] mb-0.5">ALGORITHMIC MATCH</p>
                <h2 className={`text-lg font-heading font-black tracking-tight uppercase ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SUGGESTED FOR YOU</h2>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="w-1.5 h-1.5 bg-[#764d9a]"></div>
              <div className="w-1.5 h-1.5 bg-[#764d9a]/40"></div>
              <div className="w-1.5 h-1.5 bg-[#764d9a]/20"></div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-x-3 gap-y-6 px-6">
            {suggestedGames.slice(0, 6).map(game => (
              <div key={game.id} className="group cursor-pointer flex flex-col" onClick={() => onSelectGame(game.id)}>
                <div className={`aspect-[4/5] overflow-hidden border transition-all duration-500 relative ${isDarkMode ? 'border-slate-800 bg-slate-900 group-hover:border-[#ee710b]' : 'border-white/40 bg-white/20 group-hover:border-[#ee710b]'}`}>
                  <img src={game.coverUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={game.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                    <p className="text-[8px] text-[#ee710b] font-black uppercase tracking-widest text-center">VIEW</p>
                  </div>
                </div>
                <div className="mt-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className={`text-[11px] font-black leading-tight uppercase tracking-tight mb-1 line-clamp-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</h4>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                        {game.genre[0]}
                      </span>
                      <span className="text-[8px] text-[#ee710b] font-black uppercase tracking-widest">MATCH 98%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 mt-6">
            <button 
              onClick={() => onNavigate('search')}
              className={`flex items-center justify-center gap-3 w-full py-4 border text-[10px] font-black uppercase tracking-[0.3em] active:scale-95 transition-all group ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800' : 'bg-white/80 border-white/90 text-slate-600 hover:bg-white'}`}
            >
              DISCOVER FULL CATALOG 
              <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomeView;
