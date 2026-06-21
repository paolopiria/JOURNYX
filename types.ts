
export interface Game {
  id: string;
  title: string;
  coverUrl: string;
  rating: number;
  releaseDate: string;
  genre: string[];
  platform: string[];
  description: string;
  developer: string;
  // User-specific stats
  timePlayed?: string;
  trophiesCount?: number;
  totalTrophies?: number;
  // Unique genre stats
  kdRatio?: number;
  timeInFirst?: string;
}

export interface Review {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
  commentsCount: number;
}

export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverUrl?: string;
  bio: string;
  stats: {
    reviews: number;
    followers: number;
    following: number;
    gamesPlayed: number;
  };
  journyx?: string[];
  followersList?: { id: string; name: string; avatar: string; handle: string }[];
  followingList?: { id: string; name: string; avatar: string; handle: string }[];
  linkedProfiles?: {
    platform: 'playstation' | 'xbox' | 'nintendo' | 'pc';
    username: string;
    connected: boolean;
  }[];
}

export interface HelpRequest {
  id: string;
  gameId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  timestamp: string;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  attachment?: {
    type: 'image' | 'video';
    url: string;
  };
}

export interface Chat {
  id: string;
  gameId: string;
  gameTitle: string;
  participants: {
    id: string;
    name: string;
    avatar: string;
  }[];
  lastMessage: string;
  timestamp: string;
  unread: boolean;
  messages: Message[];
}

export type ViewType = 'home' | 'search' | 'profile' | 'game-detail' | 'notifications' | 'chat';