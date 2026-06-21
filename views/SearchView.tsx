
import React, { useState, useMemo, useEffect } from 'react';
import { Search as SearchIcon, Filter, X, RefreshCw, Loader2, Monitor, Smartphone, Joystick } from 'lucide-react';
import { MOCK_GAMES } from '../mockData';
import GameCard from '../components/GameCard';

interface SearchViewProps {
  onSelectGame: (id: string) => void;
  isDarkMode?: boolean;
}

type SortOption = 'Popularity' | 'Rating' | 'Release' | 'Title';

const ITEMS_PER_PAGE = 36;

const SearchView: React.FC<SearchViewProps> = ({ onSelectGame, isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activePlatform, setActivePlatform] = useState('All');
  const [sortBy, setSortBy] = useState<SortOption>('Popularity');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const categories = ['All', 'RPG', 'Action', 'Roguelike', 'Adventure', 'Shooter', 'Racing', 'Strategy', 'Fighting', 'Simulation', 'Horror'];
  const platforms = ['All', 'PC', 'PS5', 'Xbox', 'Switch', 'Mobile'];

  const uniqueGames = useMemo(() => {
    const seenTitles = new Set();
    const seenCovers = new Set();
    return MOCK_GAMES.filter(game => {
      const titleLower = game.title.toLowerCase().trim();
      if (seenTitles.has(titleLower) || seenCovers.has(game.coverUrl)) return false;
      seenTitles.add(titleLower);
      seenCovers.add(game.coverUrl);
      return true;
    });
  }, []);

  const filteredGames = useMemo(() => {
    return uniqueGames.filter(game => {
      const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           game.developer.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || game.genre.some(g => g.includes(activeCategory));
      const matchesPlatform = activePlatform === 'All' || 
                             game.platform.some(p => p.toLowerCase().includes(activePlatform.toLowerCase()));
      return matchesSearch && matchesCategory && matchesPlatform;
    }).sort((a, b) => {
      if (sortBy === 'Rating') return b.rating - a.rating;
      if (sortBy === 'Release') return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime();
      if (sortBy === 'Title') return a.title.localeCompare(b.title);
      return b.rating - a.rating;
    });
  }, [uniqueGames, searchQuery, activeCategory, activePlatform, sortBy]);

  const displayedGames = filteredGames.slice(0, visibleCount);
  const hasMore = visibleCount < filteredGames.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + ITEMS_PER_PAGE);
      setIsLoadingMore(false);
    }, 600);
  };

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeCategory, activePlatform, sortBy]);

  return (
    <div className={`p-6 font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-white text-slate-900'}`}>
      <header className="mb-12">
        <h2 className={`text-4xl font-heading font-black mb-10 uppercase tracking-tighter ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Catalog</h2>
        
        <div className="relative mb-10">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search titles, studios..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-none py-5 pl-12 pr-12 placeholder:text-slate-300 focus:outline-none focus:border-[#764d9a] transition-all shadow-sm ${
              isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
            }`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#764d9a]">
              <X size={20} />
            </button>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">GENRE FILTER</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-none text-[9px] font-black uppercase tracking-[0.1em] transition-all border whitespace-nowrap ${
                    activeCategory === cat 
                      ? 'bg-[#764d9a] border-[#764d9a] text-white shadow-md' 
                      : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mb-4">PLATFORM GRID</p>
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6">
              {platforms.map(plat => (
                <button
                  key={plat}
                  onClick={() => setActivePlatform(plat)}
                  className={`px-5 py-2.5 rounded-none text-[9px] font-black uppercase tracking-[0.1em] transition-all border whitespace-nowrap flex items-center gap-2 ${
                    activePlatform === plat 
                      ? (isDarkMode ? 'bg-[#ee710b] border-[#ee710b] text-white shadow-md' : 'bg-slate-900 border-slate-900 text-white shadow-md')
                      : (isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-400 hover:border-slate-300')
                  }`}
                >
                  {plat === 'PC' && <Monitor size={10} />}
                  {plat === 'Mobile' && <Smartphone size={10} />}
                  {(plat === 'PS5' || plat === 'Xbox' || plat === 'Switch') && <Joystick size={10} />}
                  {plat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section>
        <div className={`flex justify-between items-center mb-8 pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] animate-pulse">
            Results: {displayedGames.length} <span className={isDarkMode ? 'text-slate-600' : 'text-slate-200'}>/ {filteredGames.length}</span>
          </p>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className={`bg-transparent text-[10px] font-black focus:outline-none cursor-pointer uppercase tracking-widest border-none pr-2 ${isDarkMode ? 'text-[#ee710b]' : 'text-[#764d9a]'}`}
          >
            <option value="Popularity">Top Rated</option>
            <option value="Release">Latest</option>
            <option value="Title">A-Z</option>
          </select>
        </div>

        {displayedGames.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-x-5 gap-y-12">
              {displayedGames.map((game, idx) => (
                <div key={`${game.id}-${idx}`} className="w-full animate-in fade-in slide-in-from-bottom-2 duration-400">
                  <GameCard game={game} onClick={onSelectGame} />
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="mt-20 mb-12">
                <button 
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={`w-full py-5 border text-[10px] font-black uppercase tracking-[0.3em] flex items-center justify-center gap-4 transition-all active:scale-95 disabled:opacity-50 shadow-sm ${
                    isDarkMode 
                      ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-[#764d9a]' 
                      : 'bg-white border-slate-200 text-slate-400 hover:border-[#764d9a]'
                  }`}
                >
                  {isLoadingMore ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
                  {isLoadingMore ? 'SYNCING DATA...' : 'REVEAL MORE TITLES'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <SearchIcon size={48} className="text-slate-400 mb-6" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em]">Sector Empty</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default SearchView;
