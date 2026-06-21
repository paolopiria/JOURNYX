
import React, { useState, useEffect, useRef } from 'react';
import { ViewType, Game, User, HelpRequest, Chat } from './types';
import HomeView from './views/HomeView';
import SearchView from './views/SearchView';
import ProfileView from './views/ProfileView';
import GameDetailView from './views/GameDetailView';
import NotificationsView from './views/NotificationsView';
import ChatView from './views/ChatView';
import BottomNav from './components/BottomNav';
import { MOCK_GAMES, WAITED_2026_GAMES, CURRENT_USER, MOCK_HELP_REQUESTS } from './mockData';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [history, setHistory] = useState<ViewType[]>(['home']);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [journyx, setJournyx] = useState<string[]>(CURRENT_USER.journyx || []);
  const [journyxRatings, setJournyxRatings] = useState<Record<string, number>>(() => {
    return {
      'p1': 5,
      'p2': 4,
      'p10': 5
    };
  });
  const [helpRequests, setHelpRequests] = useState<HelpRequest[]>(MOCK_HELP_REQUESTS);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(() => [
    {
      id: 'chat-1',
      gameId: 'p1',
      gameTitle: 'Counter-Strike 2',
      participants: [
        { id: CURRENT_USER.id, name: CURRENT_USER.name, avatar: CURRENT_USER.avatar },
         { id: 'user-2', name: 'ViperNeon_X', avatar: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=150&h=150&fit=crop' }
      ],
      lastMessage: 'That would be awesome! When are you free?',
      timestamp: '5m ago',
      unread: true,
      messages: [
        { id: 'm1', senderId: 'user-2', text: 'Hey there! I saw you have logged a lot of hours on CS2!', timestamp: '12m ago' },
        { id: 'm2', senderId: 'user-2', text: 'Can you help me with the recoil pattern on AK-47?', timestamp: '10m ago' },
        { id: 'm2-reply1', senderId: CURRENT_USER.id, text: "Yeah, absolutely! The main key is the first 10 bullets go straight up, then you drag down and slightly left. It's a muscle memory thing.", timestamp: '8m ago' },
        { id: 'm2-reply2', senderId: CURRENT_USER.id, text: "I can open a practice server and we can do a couple of sprays together.", timestamp: '7m ago' },
        { id: 'm2-ans', senderId: 'user-2', text: 'That would be awesome! When are you free?', timestamp: '5m ago' }
      ]
    },
    {
      id: 'chat-2',
      gameId: 'p10',
      gameTitle: "Baldur's Gate 3",
      participants: [
        { id: CURRENT_USER.id, name: CURRENT_USER.name, avatar: CURRENT_USER.avatar },
         { id: 'user-3', name: 'AstroViking_TV', avatar: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=150&h=150&fit=crop' }
      ],
      lastMessage: 'Thanks for the build tips, it worked perfectly!',
      timestamp: '1h ago',
      unread: false,
      messages: [
        { id: 'm3', senderId: CURRENT_USER.id, text: "Try spec'ing into Storm Sorcery, it really helps with mobility.", timestamp: '2h ago' },
        { id: 'm4', senderId: 'user-3', text: 'Thanks for the build tips, it worked perfectly!', timestamp: '1h ago' }
      ]
    }
  ]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  // Global scroll reset on every state change that impacts the UI view
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [currentView, selectedGameId]);

  const navigateTo = (view: ViewType, id: string | null = null) => {
    if (view === 'game-detail' && id) {
      setSelectedGameId(id);
    } else {
      setSelectedGameId(null);
    }
    if (view === 'chat' && id) {
      setSelectedChatId(id);
      // Mark chat as read when opening
      setChats(prev => prev.map(c => c.id === id ? { ...c, unread: false } : c));
    } else if (view !== 'chat') {
      setSelectedChatId(null);
    }
    setCurrentView(view);
    setHistory(prev => [...prev, view]);
  };

  const handleBack = () => {
    if (history.length > 1) {
      const newHistory = [...history];
      newHistory.pop();
      const previousView = newHistory[newHistory.length - 1];
      setCurrentView(previousView);
      setHistory(newHistory);
      if (previousView !== 'game-detail') {
        setSelectedGameId(null);
      }
      if (previousView !== 'chat') {
        setSelectedChatId(null);
      }
    } else {
      setCurrentView('home');
      setSelectedGameId(null);
      setSelectedChatId(null);
    }
  };

  const handleSendMessage = (chatId: string, text: string, attachment?: { type: 'image' | 'video'; url: string }) => {
    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: 'Just now',
      attachment
    };
    setChats(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessage: text || (attachment ? `Sent an ${attachment.type}` : ''),
          timestamp: 'Just now'
        };
      }
      return chat;
    }));
  };

  const toggleWishlist = (gameId: string) => {
    setWishlist(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  };

  const toggleJournyx = (gameId: string) => {
    setJournyx(prev => 
      prev.includes(gameId) 
        ? prev.filter(id => id !== gameId) 
        : [...prev, gameId]
    );
  };

  const addHelpRequest = (gameId: string) => {
    const newRequest: HelpRequest = {
      id: `h-${Date.now()}`,
      gameId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      timestamp: 'Just now'
    };
    setHelpRequests(prev => [newRequest, ...prev]);
  };

  const startChat = (request: HelpRequest, gameTitle: string) => {
    const newChatId = `c-${Date.now()}`;
    const newChat: Chat = {
      id: newChatId,
      gameId: request.gameId,
      gameTitle: gameTitle,
      participants: [
        { id: user.id, name: user.name, avatar: user.avatar },
        { id: request.userId, name: request.userName, avatar: request.userAvatar }
      ],
      lastMessage: 'I need some help on this gametile!',
      timestamp: 'Just now',
      unread: true,
      messages: [
        { id: `m-init-${Date.now()}`, senderId: request.userId, text: "Hey! I put out a help request. Can you help me out?", timestamp: 'Just now' }
      ]
    };
    setChats(prev => [newChat, ...prev]);
    setHelpRequests(prev => prev.filter(h => h.id !== request.id));
    navigateTo('chat', newChatId);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomeView 
            onSelectGame={(id) => navigateTo('game-detail', id)} 
            onNavigate={navigateTo} 
            wishlist={wishlist}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            user={user}
          />
        );
      case 'search':
        return <SearchView onSelectGame={(id) => navigateTo('game-detail', id)} isDarkMode={isDarkMode} />;
      case 'profile':
        return (
          <ProfileView 
            onSelectGame={(id) => navigateTo('game-detail', id)} 
            wishlist={wishlist}
            journyx={journyx}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            isOnline={isOnline}
            setIsOnline={setIsOnline}
            user={user}
            onUpdateUser={setUser}
            journyxRatings={journyxRatings}
          />
        );
      case 'notifications':
        return (
          <NotificationsView 
            chats={chats} 
            isDarkMode={isDarkMode} 
            onSelectChat={(chatId) => navigateTo('chat', chatId)} 
            currentUserId={user.id}
          />
        );
      case 'chat':
        const activeChat = chats.find(c => c.id === selectedChatId);
        return activeChat ? (
          <ChatView 
            chat={activeChat}
            currentUserId={user.id}
            onBack={handleBack}
            isDarkMode={isDarkMode}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <NotificationsView 
            chats={chats} 
            isDarkMode={isDarkMode} 
            onSelectChat={(chatId) => navigateTo('chat', chatId)} 
            currentUserId={user.id}
          />
        );
      case 'game-detail':
        const allPossibleGames = [...MOCK_GAMES, ...WAITED_2026_GAMES];
        const foundGame = allPossibleGames.find(g => g.id === selectedGameId);

        return foundGame ? (
          <GameDetailView 
            game={foundGame} 
            onBack={handleBack} 
            isWishlisted={wishlist.includes(foundGame.id)}
            onToggleWishlist={() => toggleWishlist(foundGame.id)}
            isJournyx={journyx.includes(foundGame.id)}
            onToggleJournyx={() => toggleJournyx(foundGame.id)}
            helpRequests={helpRequests.filter(h => h.gameId === foundGame.id)}
            onAddHelpRequest={() => addHelpRequest(foundGame.id)}
            onStartChat={(req) => startChat(req, foundGame.title)}
            isDarkMode={isDarkMode}
            userRating={journyxRatings[foundGame.id] || 0}
            onUpdateRating={(rating) => setJournyxRatings(prev => ({ ...prev, [foundGame.id]: rating }))}
          />
        ) : <HomeView onSelectGame={(id) => navigateTo('game-detail', id)} onNavigate={navigateTo} wishlist={wishlist} />;
      default:
        return <HomeView onSelectGame={(id) => navigateTo('game-detail', id)} onNavigate={navigateTo} wishlist={wishlist} />;
    }
  };

  return (
    <div className={`flex flex-col h-screen max-w-md mx-auto relative shadow-2xl overflow-hidden border-x rounded-none transition-colors duration-300 ${isDarkMode ? 'dark bg-[#140e23] border-slate-800' : 'bg-white border-slate-200'}`}>
      <main ref={mainRef} className={`flex-1 ${currentView === 'chat' ? 'pb-0' : 'pb-24'} overflow-y-auto no-scrollbar scroll-smooth transition-colors duration-300 ${isDarkMode ? 'bg-[#140e23]' : 'bg-white'}`}>
        {renderView()}
      </main>

      {currentView !== 'chat' && (
        <BottomNav currentView={currentView} onNavigate={navigateTo} isDarkMode={isDarkMode} />
      )}
    </div>
  );
};

export default App;
