
import React, { useState, useEffect } from 'react';
import { Game } from '../types';
import { Star } from 'lucide-react';

interface GameCardProps {
  game: Game;
  onClick: (id: string) => void;
  compact?: boolean;
  minimal?: boolean;
  isDarkMode?: boolean;
  rank?: number;
}

const rawgImageCache: Record<string, string> = {
  'Counter-Strike 2': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/730/library_600x900.jpg',
  'The Sims 4': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1222670/library_600x900.jpg',
  'Rocket League': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/252950/library_600x900.jpg',
  'Overwatch': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2357570/library_600x900.jpg',
  'Diablo IV': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2344520/library_600x900.jpg',
  'Dota 2': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/570/library_600x900.jpg',
  'PUBG: Battlegrounds': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/578080/library_600x900.jpg',
  'Forza Horizon 6': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1551360/library_600x900.jpg',
  'Apex Legends': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1172470/library_600x900.jpg',
  'R.E.P.O.': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/3211510/library_600x900.jpg',
  'Grand Theft Auto V': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/271590/library_600x900.jpg',
  'Slay the Spire 2': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2868470/library_600x900.jpg',
  'Battlefield 6': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1517290/library_600x900.jpg',
  'Tom Clancy\'s Rainbow Six Siege': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/359550/library_600x900.jpg',
  'Call of Duty: Warzone': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/1962660/header.jpg',
  'EA Sports FC 26': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2592390/header.jpg',
  'Marvel Rivals': 'https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/2760740/header.jpg'
};

const specialSlugs: Record<string, string> = {
  'Minecraft': 'minecraft',
  'Roblox': 'roblox',
  'Fortnite': 'fortnite',
  'League of Legends': 'league-of-legends',
  'Valorant': 'valorant',
  'World of Warcraft': 'world-of-warcraft'
};

const specialFallbacks: Record<string, string> = {
  'Minecraft': 'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
  'Roblox': 'https://upload.wikimedia.org/wikipedia/en/2/20/Roblox_2022_Logo_White.svg',
  'Fortnite': 'https://upload.wikimedia.org/wikipedia/en/4/44/Fortnite_cover.jpg',
  'League of Legends': 'https://upload.wikimedia.org/wikipedia/commons/0/0e/League_of_Legends_2019_vector.svg',
  'Valorant': 'https://upload.wikimedia.org/wikipedia/en/e/e3/Valorant_cover.jpg',
  'World of Warcraft': 'https://upload.wikimedia.org/wikipedia/en/courier/wow_box_art.jpg'
};

const StyledPlaceholder: React.FC<{ title: string; isDarkMode: boolean }> = ({ title, isDarkMode }) => {
  return (
    <div className={`w-full h-full bg-gradient-to-br ${isDarkMode ? 'from-[#1c1430] via-[#140e23] to-[#0d0917]' : 'from-slate-800 via-slate-900 to-slate-950'} flex flex-col justify-center items-center p-4 text-center select-none border border-slate-800`}>
      <span className="font-heading font-black text-xs md:text-sm text-slate-100 uppercase tracking-widest leading-snug line-clamp-4 px-1">
        {title}
      </span>
      <span className="text-[9px] text-[#ee710b] font-black uppercase mt-3 tracking-widest bg-[#ee710b]/10 px-1.5 py-0.5 border border-[#ee710b]/20">
        NO SOURCE
      </span>
    </div>
  );
};

const GameCard: React.FC<GameCardProps> = ({ game, onClick, compact = false, minimal = false, isDarkMode = false, rank }) => {
  const [imgSrc, setImgSrc] = useState<string>(
    game.coverUrl && game.coverUrl.startsWith('/covers/') 
      ? game.coverUrl 
      : (rawgImageCache[game.title] || game.coverUrl)
  );
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (game.coverUrl && game.coverUrl.startsWith('/covers/')) {
      setImgSrc(game.coverUrl);
      setHasError(false);
      return;
    }

    setImgSrc(rawgImageCache[game.title] || game.coverUrl);
    setHasError(false);

    // If we have cached this game's background image, use it directly
    if (rawgImageCache[game.title] && rawgImageCache[game.title] !== game.coverUrl) {
      setImgSrc(rawgImageCache[game.title]);
      return;
    }

    let isMounted = true;
    const apiKey = 'fa731d161d764789b7080a84ca0a213e'; // public active RAWG API key
    const query = encodeURIComponent(game.title);

    const specialSlug = specialSlugs[game.title];
    if (specialSlug) {
      fetch(`https://api.rawg.io/api/games/${specialSlug}?key=${apiKey}`)
        .then(res => {
          if (!res.ok) throw new Error('API key or request limit error');
          return res.json();
        })
        .then(data => {
          if (data && data.background_image) {
            rawgImageCache[game.title] = data.background_image;
            if (isMounted) {
              setImgSrc(data.background_image);
            }
          } else {
            const fallback = specialFallbacks[game.title];
            if (fallback) {
              rawgImageCache[game.title] = fallback;
              if (isMounted) {
                setImgSrc(fallback);
              }
            }
          }
        })
        .catch(err => {
          console.warn(`RAWG fetch failed for special slug ${specialSlug}, using static fallback`, err);
          const fallback = specialFallbacks[game.title];
          if (fallback) {
            rawgImageCache[game.title] = fallback;
            if (isMounted) {
              setImgSrc(fallback);
            }
          }
        });
    } else {
      fetch(`https://api.rawg.io/api/games?key=${apiKey}&search=${query}&page_size=1`)
        .then(res => {
          if (!res.ok) throw new Error('API key or request limit error');
          return res.json();
        })
        .then(data => {
          if (data && data.results && data.results.length > 0) {
            const bgImg = data.results[0].background_image;
            if (bgImg) {
              rawgImageCache[game.title] = bgImg;
              if (isMounted) {
                setImgSrc(bgImg);
              }
            }
          }
        })
        .catch(err => {
          console.warn('RAWG image load failed, falling back to static asset', err);
        });
    }

    return () => {
      isMounted = false;
    };
  }, [game.title, game.coverUrl]);

  if (minimal) {
    return (
      <div 
        onClick={() => onClick(game.id)}
        className={`relative group cursor-pointer active:scale-95 transition-all aspect-[3/4] overflow-hidden rounded-none shadow-sm border ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-white'}`}
      >
        {hasError ? (
          <StyledPlaceholder title={game.title} isDarkMode={isDarkMode} />
        ) : (
          <img 
            src={imgSrc} 
            alt={game.title} 
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-all ${isDarkMode ? 'grayscale-[0.2] group-hover:grayscale-0' : ''}`} 
          />
        )}
        {rank !== undefined && (
          <div className="absolute top-1 left-1 bg-[#ee710b] text-white text-[8px] font-black px-1.5 py-0.5 tracking-tighter">
            #{rank}
          </div>
        )}
        <div className={`absolute top-1 right-1 backdrop-blur px-1 py-0.5 rounded-none flex items-center gap-0.5 border ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-100'}`}>
          <Star size={8} className="fill-yellow-500 text-yellow-500" />
          <span className={`text-[8px] font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.rating}</span>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        onClick={() => onClick(game.id)}
        className={`flex items-center gap-3 p-3 rounded-none border active:scale-95 transition-all cursor-pointer shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
      >
        {hasError ? (
          <div className="w-16 h-20 bg-gradient-to-br from-[#1c1430] to-[#0d0917] flex flex-col justify-center items-center p-1 text-center border border-slate-800 select-none shrink-0">
            <span className="font-heading font-black text-[8px] text-slate-200 uppercase tracking-tight leading-none line-clamp-3">
              {game.title}
            </span>
          </div>
        ) : (
          <img 
            src={imgSrc} 
            alt={game.title} 
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`w-16 h-20 object-cover rounded-none shadow-sm ${isDarkMode ? 'grayscale-[0.2]' : ''}`} 
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</h4>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{game.genre[0]}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={12} className="fill-yellow-500 text-yellow-500" />
            <span className={`text-xs font-black ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{game.rating}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={() => onClick(game.id)}
      className="relative group cursor-pointer active:scale-95 transition-all w-full"
    >
      <div className={`overflow-hidden rounded-none shadow-sm aspect-[3/4] mb-3 border relative transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'}`}>
        {hasError ? (
          <StyledPlaceholder title={game.title} isDarkMode={isDarkMode} />
        ) : (
          <img 
            src={imgSrc} 
            alt={game.title} 
            referrerPolicy="no-referrer"
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isDarkMode ? 'grayscale-[0.2] group-hover:grayscale-0' : ''}`} 
          />
        )}
        <div className={`absolute top-2 right-2 backdrop-blur-md px-2 py-1 rounded-none flex items-center gap-1 border ${isDarkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/90 border-slate-100'}`}>
          <Star size={12} className="fill-yellow-500 text-yellow-500" />
          <span className={`text-xs font-black ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.rating}</span>
        </div>
      </div>
      <h3 className={`font-bold text-sm line-clamp-2 px-1 leading-tight uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{game.title}</h3>
      <p className="text-[11px] text-slate-500 mt-1 px-1 font-bold uppercase tracking-wider">{game.developer}</p>
    </div>
  );
};

export default GameCard;
