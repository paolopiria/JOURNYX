import React, { useState, useEffect } from 'react';
import { Game, HelpRequest, Review } from '../types';
import { 
  ArrowLeft, Star, Heart, Share2, Zap, BrainCircuit, HelpCircle, 
  Users, MessageCircle, X, Calendar, Building, ShieldAlert, Check, Copy
} from 'lucide-react';
import { getGameSummary, getGameScoreInsight } from '../geminiService';
import { MOCK_REVIEWS } from '../mockData';
import ReviewCard from '../components/ReviewCard';

interface GameDetailViewProps {
  game: Game;
  onBack: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
  isJournyx: boolean;
  onToggleJournyx: () => void;
  helpRequests: HelpRequest[];
  onAddHelpRequest: () => void;
  onStartChat: (request: HelpRequest) => void;
  isDarkMode: boolean;
  userRating?: number;
  onUpdateRating?: (rating: number) => void;
}

const GameDetailView: React.FC<GameDetailViewProps> = ({ 
  game, 
  onBack, 
  isWishlisted, 
  onToggleWishlist, 
  isJournyx,
  onToggleJournyx,
  helpRequests,
  onAddHelpRequest,
  onStartChat,
  isDarkMode,
  userRating = 0,
  onUpdateRating
}) => {
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [justRequestedHelp, setJustRequestedHelp] = useState(false);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [showRatingToast, setShowRatingToast] = useState(false);

  useEffect(() => {
    const fetchAiInsights = async () => {
      setIsLoadingAi(true);
      const [summary, insight] = await Promise.all([
        getGameSummary(game.title, game.description),
        getGameScoreInsight(game.title, game.rating)
      ]);
      setAiSummary(summary);
      setAiInsight(insight);
      setIsLoadingAi(false);
    };
    fetchAiInsights();
  }, [game]);

  // Generate a realistic active player count based on game rating and ID
  const getActivePlayers = (g: Game) => {
    const customMap: { [key: string]: string } = {
      'p1': '248K',
      'p2': '114.5K',
      'p3': '89.2K',
      'p4': '143K',
      'p5': '21.4K',
      'p6': '48.9K',
      'p7': '34.5K',
      'p8': '76.2K',
      'p9': '51.3K',
      'p10': '320K',
    };
    return customMap[g.id] || `${Math.floor((g.rating || 4.5) * 12.8)}K`;
  };

  const activePlayers = getActivePlayers(game);

  // Get latest 2 reviews for this game
  const latestTwoReviews = (() => {
    const existing = MOCK_REVIEWS.filter(r => r.gameId === game.id);
    if (existing.length >= 2) {
      return existing.slice(-2);
    }
    
    // Custom fallback reviews tailored for the active game
    const fallbackReviews: Review[] = [
      {
        id: `fallback-r1-${game.id}`,
        gameId: game.id,
        userId: 'user-2',
        userName: 'ViperNeon_X',
        userAvatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=150&h=150&fit=crop',
        rating: Math.floor(game.rating) || 5,
        content: `Highly recommend ${game.title}! The narrative depth, stellar pacing, and overall polish is simply outstanding. A must play for fans of this genre!`,
        date: '2d ago',
        likes: 38,
        commentsCount: 4
      },
      {
        id: `fallback-r2-${game.id}`,
        gameId: game.id,
        userId: 'user-3',
        userName: 'AstroViking_TV',
        userAvatar: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=150&h=150&fit=crop',
        rating: Math.ceil(game.rating - 0.5) || 4,
        content: `I am thoroughly impressed by ${game.title}. Since its launch, it has captivated my attention for hours. Definitely pick it up!`,
        date: '4d ago',
        likes: 24,
        commentsCount: 2
      }
    ];

    const merged = [...existing, ...fallbackReviews];
    return merged.slice(0, 2);
  })();

  const handleShare = () => {
    const shareText = `Check out ${game.title} on Journyx - Your Personal Gaming Diary!`;
    const shareUrl = window.location.href;

    if (navigator.share) {
      navigator.share({
        title: game.title,
        text: shareText,
        url: shareUrl,
      })
      .then(() => {
        setShowShareToast(true);
        setTimeout(() => setShowShareToast(false), 2500);
      })
      .catch((err) => {
        // Fallback if rejected/failed
        console.log('Share error or canceled', err);
        fallbackCopyToClipboard();
      });
    } else {
      fallbackCopyToClipboard();
    }
  };

  const fallbackCopyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setShowShareToast(true);
    setTimeout(() => setShowShareToast(false), 2500);
  };

  const handleAddRequest = () => {
    onAddHelpRequest();
    setJustRequestedHelp(true);
    setTimeout(() => setJustRequestedHelp(false), 3000);
  };

  return (
    <div className={`relative animate-in fade-in duration-300 pb-12 min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notification */}
      {showShareToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-[#764d9a] text-white py-3 px-5 shadow-2xl rounded-none animate-in slide-in-from-top-4 border border-purple-400">
          <Copy size={14} />
          <span className="text-[10px] font-black tracking-widest uppercase">LINK COPIED TO CLIPBOARD!</span>
        </div>
      )}

      {/* Header Controls */}
      <div className={`sticky top-0 z-30 px-6 py-4 flex items-center justify-between backdrop-blur-md transition-colors ${isDarkMode ? 'bg-[#140e23]/80 border-b border-slate-800/40' : 'bg-white/80 border-b border-slate-200/40'}`}>
        <button 
          onClick={onBack} 
          className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-800 text-white hover:border-[#764d9a]' : 'bg-white border-slate-250 text-slate-800 hover:border-[#764d9a]'}`}
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        
        <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 max-w-[150px] truncate">
          {game.title}
        </span>

        <div className="flex gap-2.5">
          <button 
            onClick={handleShare}
            className={`w-10 h-10 border flex items-center justify-center transition-colors ${isDarkMode ? 'bg-slate-900/60 border-slate-800 text-white hover:border-[#764d9a]' : 'bg-white border-slate-250 text-slate-800 hover:border-[#764d9a]'}`}
            title="Share Game"
          >
            <Share2 size={16} />
          </button>
          <button 
            onClick={onToggleWishlist} 
            className={`w-10 h-10 border flex items-center justify-center transition-all ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-250'} ${isWishlisted ? 'text-pink-500 border-pink-500/30' : 'text-slate-450 hover:text-pink-500'}`}
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart size={16} className={isWishlisted ? 'fill-pink-500' : ''} />
          </button>
        </div>
      </div>

      {/* Top Banner Cover Background */}
      <div className="relative h-[250px] w-full overflow-hidden">
        <img 
          src={game.coverUrl} 
          referrerPolicy="no-referrer" 
          className="w-full h-full object-cover blur-md opacity-25 scale-105" 
          alt="blur-banner" 
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${isDarkMode ? 'from-[#140e23]' : 'from-slate-50'} via-transparent to-transparent`} />
        
        {/* Floating Cover Asset */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className={`w-[120px] aspect-[3/4] shadow-2xl border-2 overflow-hidden transition-transform duration-500 hover:scale-105 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}>
            <img 
              src={game.coverUrl} 
              referrerPolicy="no-referrer" 
              className="w-full h-full object-cover" 
              alt={game.title} 
            />
          </div>
        </div>
      </div>

      {/* Core Presentation Layer */}
      <div className="px-6 space-y-8 mt-4">
        
        {/* Title & Tags */}
        <div className="text-center space-y-4">
          <h1 className={`text-2xl font-black leading-tight tracking-tight uppercase ${isDarkMode ? 'text-white font-sans' : 'text-slate-900 font-sans'}`}>
            {game.title}
          </h1>

          <div className="flex flex-wrap justify-center gap-1.5">
            {game.genre.map(tag => (
              <span 
                key={tag} 
                className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 border rounded-none ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600'}`}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* General Metadata Details Grid */}
        <div className={`grid grid-cols-4 gap-2.5 p-4 border shadow-sm transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'}`}>
          
          {/* RELEASE YEAR */}
          <div className="text-center flex flex-col justify-center py-1">
            <div className="flex justify-center mb-1 text-slate-400">
              <Calendar size={14} />
            </div>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider mb-0.5">RELEASE</p>
            <p className={`text-xs font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {new Date(game.releaseDate).getFullYear()}
            </p>
          </div>

          {/* PUBLISHER / DEVELOPER */}
          <div className={`text-center flex flex-col justify-center py-1 border-x ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex justify-center mb-1 text-slate-400">
              <Building size={14} />
            </div>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider mb-0.5">PUBLISHER</p>
            <p className={`text-[10px] font-black truncate px-1 uppercase leading-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`} title={game.developer}>
              {game.developer}
            </p>
          </div>

          {/* RATING */}
          <div className={`text-center flex flex-col justify-center py-1 border-r ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
            <div className="flex justify-center mb-1 text-yellow-500">
              <Star size={14} className="fill-yellow-500" />
            </div>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider mb-0.5">RATING</p>
            <p className={`text-xs font-black ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>
              {game.rating} / 5
            </p>
          </div>

          {/* ACTIVE PLAYERS */}
          <div className="text-center flex flex-col justify-center py-1">
            <div className="flex justify-center mb-1 text-emerald-500">
              <Users size={14} />
            </div>
            <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider mb-0.5">PLAYERS</p>
            <p className={`text-xs font-black text-emerald-500`}>
              {activePlayers}
            </p>
          </div>

        </div>

        {/* PERSONAL JOURNYX ENTRY & 5-STAR RATING SYSTEM */}
        <section className={`p-5 border transition-all duration-300 relative overflow-hidden ${isDarkMode ? 'bg-[#21162c] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="absolute top-0 right-0 p-3 opacity-[0.03] pointer-events-none">
            <Star size={72} className="text-[#764d9a] fill-[#764d9a]" />
          </div>

          <div className="flex items-center justify-between mb-3.5 border-b pb-2 border-dashed border-slate-700/30">
            <h3 className={`text-xs font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              MY JOURNYX RECORD
            </h3>
            <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 ${isJournyx ? 'bg-purple-900/40 text-purple-300 border border-purple-500/20' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400 border border-slate-300 dark:border-slate-700'}`}>
              {isJournyx ? 'LOGGED' : 'NOT LOGGED'}
            </span>
          </div>

          {!isJournyx ? (
            <div className="space-y-3">
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium leading-relaxed">
                Log this game to your personal notebook diary to keep track of your hours, unlock statuses, and record your 5-star rating.
              </p>
              <button
                onClick={onToggleJournyx}
                className="w-full text-center text-[10px] font-black py-3 px-4 text-white bg-slate-900 hover:bg-slate-950 dark:bg-[#764d9a] dark:hover:bg-[#764d9a]/90 transition-all flex items-center justify-center gap-2 tracking-[0.2em] border border-slate-800 dark:border-transparent"
              >
                + ADD TO MY JOURNYX
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-xs text-slate-400 dark:text-slate-400 font-medium leading-relaxed">
                This game is logged in your personal gallery. Click on the gold stars below to rate it:
              </p>

              <div className="flex flex-col items-center justify-center p-4 bg-slate-105/20 dark:bg-slate-950/20 border border-slate-200 dark:border-slate-800/20">
                <p className="text-[9px] text-[#764d9a] font-black uppercase tracking-[0.25em] mb-2.5">
                  YOUR CUSTOM RATING
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((starValue) => {
                    const isLit = (hoverRating !== null ? starValue <= hoverRating : starValue <= userRating);
                    return (
                      <button
                        key={starValue}
                        onClick={() => {
                          if (onUpdateRating) {
                            onUpdateRating(starValue);
                            setShowRatingToast(true);
                            setTimeout(() => setShowRatingToast(false), 2000);
                          }
                        }}
                        onMouseEnter={() => setHoverRating(starValue)}
                        onMouseLeave={() => setHoverRating(null)}
                        className="p-1 transition-transform active:scale-125 focus:outline-none"
                        title={`Rate ${starValue} Stars`}
                      >
                        <Star
                          size={28}
                          className={`transition-colors duration-200 ${
                            isLit 
                              ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.3)]' 
                              : 'text-slate-300 dark:text-slate-700'
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                {userRating > 0 ? (
                  <p className="text-[10px] font-black text-amber-500 mt-2.5 uppercase tracking-wider">
                    {userRating} / 5 STARS SELECTED
                  </p>
                ) : (
                  <p className="text-[10px] text-slate-500 mt-2.5 uppercase tracking-wider">
                    UNRATED - SELECT STARS
                  </p>
                )}
              </div>

              {showRatingToast && (
                <div className="text-center text-[9px] font-black text-emerald-500 uppercase tracking-widest animate-pulse">
                  ✓ DIARY RATING UPDATED SUCCESSFULLY!
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                  Logged in your secure game vault
                </span>
                <button
                  onClick={onToggleJournyx}
                  className="text-[9px] text-red-500 hover:text-red-400 font-black uppercase tracking-wider underline cursor-pointer"
                >
                  REMOVE GAME
                </button>
              </div>
            </div>
          )}
        </section>

        {/* LATEST REVIEWS (specifically last two reviews) */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-800/40">
            <h3 className={`text-sm font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              LATEST REVIEWS
            </h3>
          </div>
          <div className="space-y-1">
            {latestTwoReviews.map(review => (
              <ReviewCard key={review.id} review={review} isDarkMode={isDarkMode} />
            ))}
          </div>
        </section>

        {/* AI VERDICT (Gemini Integration) */}
        <section className={`border-l-4 border-[#764d9a] p-6 shadow-sm relative overflow-hidden transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
          <div className="absolute -top-4 -right-4 p-3 opacity-[0.03]">
            <BrainCircuit size={80} className="text-[#764d9a]" />
          </div>
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-[#764d9a] fill-[#764d9a]" />
            <h3 className="text-[10px] font-black text-[#764d9a] uppercase tracking-widest">AI VERDICT SUMMARY</h3>
          </div>
          {isLoadingAi ? (
            <div className="space-y-3 animate-pulse">
              <div className={`h-3 w-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
              <div className={`h-3 w-3/4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />
            </div>
          ) : (
            <>
              <p className={`text-xs italic font-black leading-relaxed mb-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                "{aiInsight}"
              </p>
              <div className="text-[10px] text-slate-400 leading-relaxed font-bold uppercase tracking-tight">
                {aiSummary}
              </div>
            </>
          )}
        </section>

        {/* THE DESCRIPTION BRIEF (GAME SUMMARY) */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 border-b pb-2 border-slate-800/40">
            <h3 className={`text-sm font-black uppercase tracking-[0.15em] ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              THE STORY & LOG
            </h3>
          </div>
          <p className={`text-xs leading-relaxed font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {game.description}
          </p>
        </section>

        {/* COMPREHENSIVE HELP REQUEST SYSTEM */}
        <section className={`p-5 border transition-colors duration-300 ${isDarkMode ? 'bg-[#21162c] border-slate-800' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <h3 className={`text-md font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                HELP REQUEST
              </h3>
            </div>
            <Users size={18} className="text-[#764d9a]" />
          </div>

          <p className="text-xs text-slate-450 font-medium leading-relaxed mb-5">
            Having trouble with a milestone, finding a secret, or looking to group up? Connect with other active players.
          </p>

          <div className="space-y-4">
            {/* Create Help Request Action Block */}
            {justRequestedHelp ? (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center gap-3 justify-center text-emerald-500">
                <Check size={16} />
                <span className="text-[9px] font-black uppercase tracking-widest text-center">YOUR REQUEST HAS BEEN SUBMITTED!</span>
              </div>
            ) : (
              <button 
                onClick={handleAddRequest}
                className="w-full text-center text-[10px] font-black py-4 text-white bg-[#764d9a] hover:bg-[#764d9a]/90 transition-all flex items-center justify-center gap-2 tracking-[0.2em]"
              >
                <HelpCircle size={14} />
                POST NEW HELP REQUEST
              </button>
            )}

            {/* List of Active Help Requests */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between border-b pb-1.5 border-dashed border-slate-700/50">
                <span className="text-[8px] text-slate-400 font-black uppercase tracking-widest">{helpRequests.length} ACTIVE REQUESTS</span>
                <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">LIVE STATUS</span>
              </div>

              {helpRequests.length > 0 ? (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 no-scrollbar">
                  {helpRequests.map(req => (
                    <div 
                      key={req.id} 
                      className={`flex items-center justify-between gap-3 p-3.5 border transition-all ${isDarkMode ? 'bg-slate-900/40 border-slate-800/80 hover:border-[#764d9a]/50' : 'bg-slate-50 border-slate-100 hover:border-[#764d9a]/50'}`}
                    >
                      <div className="flex items-center gap-3">
                        <img 
                          src={req.userAvatar} 
                          referrerPolicy="no-referrer" 
                          alt={req.userName} 
                          className="w-8 h-8 rounded-none object-cover border border-slate-800" 
                        />
                        <div>
                          <p className={`text-[11px] font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                            {req.userName}
                          </p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">
                            Posted {req.timestamp}
                          </p>
                        </div>
                      </div>

                      <button 
                        onClick={() => onStartChat(req)}
                        className="flex items-center gap-1 bg-[#764d9a]/10 hover:bg-[#764d9a] text-[#764d9a] hover:text-white border border-[#764d9a]/20 py-1.5 px-3 transition-colors text-[9px] font-black uppercase tracking-widest"
                        title="Start Chat Session"
                      >
                        <MessageCircle size={12} />
                        <span>CHAT</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`p-6 border border-dashed rounded-none text-center ${isDarkMode ? 'bg-slate-900/20 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                  <p className="text-[9px] text-slate-450 font-black uppercase tracking-widest">NO PENDING SESSIONS</p>
                  <p className="text-[8px] text-slate-450 mt-1 uppercase tracking-tight">BE THE FIRST TO SUBMIT A HELP SIGNAL</p>
                </div>
              )}
            </div>

          </div>
        </section>

      </div>
      


    </div>
  );
};

export default GameDetailView;
