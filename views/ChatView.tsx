import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Plus, X, Video } from 'lucide-react';
import { Chat } from '../types';

interface ChatViewProps {
  chat: Chat;
  currentUserId: string;
  onBack: () => void;
  isDarkMode: boolean;
  onSendMessage: (chatId: string, text: string, attachment?: { type: 'image' | 'video'; url: string }) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ chat, currentUserId, onBack, isDarkMode, onSendMessage }) => {
  const [input, setInput] = useState('');
  const [attachment, setAttachment] = useState<{ file: File; type: 'image' | 'video'; url: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const otherParticipant = chat.participants.find(p => p.id !== currentUserId) || chat.participants[1] || chat.participants[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const type = file.type.startsWith('video/') ? 'video' : 'image';
    const url = URL.createObjectURL(file);
    setAttachment({ file, type, url });
  };

  const handleSend = () => {
    if (!input.trim() && !attachment) return;
    
    let mediaParam = undefined;
    if (attachment) {
      mediaParam = { type: attachment.type, url: attachment.url };
    }
    
    onSendMessage(chat.id, input.trim(), mediaParam);
    setInput('');
    setAttachment(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat.messages]);

  return (
    <div className={`flex flex-col h-full min-h-screen ${isDarkMode ? 'bg-[#140e23] text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Header - Sticky, Fixed, Larger and Elegant */}
      <div className={`sticky top-0 z-50 flex items-center gap-5 px-6 py-5 border-b shadow-sm ${
        isDarkMode 
          ? 'border-slate-800 bg-[#140e23]' 
          : 'border-slate-200 bg-white'
      }`}>
        <button onClick={onBack} className="p-1.5 hover:opacity-75 transition-opacity">
          <ArrowLeft size={22} className={isDarkMode ? 'text-white' : 'text-slate-900'} />
        </button>
        <img 
          src={otherParticipant.avatar} 
          alt={otherParticipant.name} 
          className="w-11 h-11 object-cover rounded-full border border-slate-500/20 shadow-sm" 
        />
        <div>
          <p className={`text-sm font-black uppercase tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {otherParticipant.name}
          </p>
          <p className="text-[10px] text-[#ee710b] font-extrabold uppercase tracking-widest mt-0.5">
            {chat.gameTitle}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 pb-36">
        
        {/* System message — always first */}
        <div className="flex justify-center mb-2">
          <div className={`px-5 py-3.5 border border-dashed rounded-xl text-[10px] font-bold uppercase tracking-widest text-center max-w-[90%] leading-relaxed ${
            isDarkMode 
              ? 'bg-slate-900/40 border-slate-800 text-slate-300' 
              : 'bg-slate-50 border-slate-200 text-slate-600'
          }`}>
            User {otherParticipant.name} accepted the help request for the game {chat.gameTitle} on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}.
          </div>
        </div>

        {/* Conversation */}
        {chat.messages && chat.messages.map((msg) => {
          const isMe = msg.senderId === currentUserId;
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] border p-4 shadow-sm transition-all relative rounded-2xl ${
                isMe 
                  ? `rounded-tr-none ${
                      isDarkMode 
                        ? 'bg-white border-white text-slate-950' 
                        : 'bg-white border-slate-300/80 text-slate-900'
                    }`
                  : `rounded-tl-none ${
                      isDarkMode 
                        ? 'bg-[#ee710b] border-[#ee710b] text-white' 
                        : 'bg-[#ee710b] border-[#ee710b] text-white font-medium'
                    }`
              }`}>
                {/* Media Attachment Viewer */}
                {msg.attachment && (
                  <div className="mb-2 max-w-full overflow-hidden rounded-lg">
                    {msg.attachment.type === 'image' ? (
                      <img 
                        src={msg.attachment.url} 
                        alt="Attachment" 
                        className="max-h-48 w-full object-cover rounded-md"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <video 
                        src={msg.attachment.url} 
                        controls 
                        className="max-h-48 w-full rounded-md"
                      />
                    )}
                  </div>
                )}
                
                <p className="text-[11.5px] leading-relaxed font-sans">{msg.text}</p>
                <p className={`text-[8px] font-mono font-black uppercase tracking-widest text-right mt-2 ${
                  isMe ? 'text-slate-500' : 'text-slate-200'
                }`}>{msg.timestamp}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box with Attachment Function */}
      <div className={`fixed bottom-0 left-0 right-0 max-w-md mx-auto p-4 border-t border-x z-50 transition-colors duration-300 ${
        isDarkMode ? 'bg-[#140e23] border-slate-800' : 'bg-white border-slate-200'
      }`}>
        
        {/* Attachment Preview Panel */}
        {attachment && (
          <div className={`mb-3 p-2.5 border flex items-center justify-between rounded-xl ${
            isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-3">
              {attachment.type === 'image' ? (
                <img src={attachment.url} alt="Preview" className="w-11 h-11 object-cover rounded-lg border border-slate-500/20" />
              ) : (
                <div className="w-11 h-11 bg-[#ee710b]/10 rounded-lg flex items-center justify-center border border-[#ee710b]/20">
                  <Video size={18} className="text-[#ee710b]" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-wider truncate max-w-[180px]">{attachment.file.name}</p>
                <p className="text-[8px] text-[#ee710b] font-extrabold uppercase tracking-widest mt-0.5">{attachment.type}</p>
              </div>
            </div>
            <button 
              onClick={() => setAttachment(null)} 
              className={`p-1.5 rounded-full hover:bg-slate-500/10 transition-colors ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              <X size={15} />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          {/* Hidden File Picker */}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/*" 
            className="hidden" 
          />
          
          {/* Attachment Selector Button */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            type="button"
            className={`w-11 h-11 border flex items-center justify-center transition-all rounded-2xl ${
              isDarkMode 
                ? 'bg-slate-900 border-slate-800 hover:border-[#ee710b] text-[#ee710b]' 
                : 'bg-slate-50 border-slate-200 hover:border-[#764d9a] text-slate-800'
            }`}
            title="Attach photo/video"
          >
            <Plus size={22} strokeWidth={3.5} />
          </button>
          
          {/* Message Text Input */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={attachment ? "ADD CAPTION OR PRESS SEND..." : "TYPE TRANSMISSION..."}
            className={`flex-1 text-[11.5px] font-semibold font-sans px-4 border transition-all uppercase tracking-wider rounded-2xl focus:outline-none ${
              isDarkMode 
                ? 'bg-slate-900/60 border-slate-800 text-white focus:border-[#ee710b]' 
                : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-[#764d9a]'
            }`}
          />
          
          {/* Send Button */}
          <button 
            onClick={handleSend}
            className={`w-11 h-11 border flex items-center justify-center transition-all rounded-2xl ${
              isDarkMode 
                ? 'bg-[#ee710b] border-[#ee710b] hover:bg-orange-600 text-white' 
                : 'bg-[#764d9a] border-[#764d9a] hover:bg-[#5f3c7e] text-white'
            }`}
          >
            <Send size={15} />
          </button>
        </div>
      </div>

    </div>
  );
};

export default ChatView;
