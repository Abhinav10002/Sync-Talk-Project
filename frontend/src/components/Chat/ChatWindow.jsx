import React, { useState, useEffect, useRef } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar';
import { Send, Smile } from 'lucide-react';

const ChatWindow = ({ activeChatUser }) => {
  const [messages, setMessages] = useState([]);
  const [textInput, setTextInput] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { liveMessages, setLiveMessages, emitEvent, typingStatuses } = useSocket();
  const { user } = useAuth();
  
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // 1. Fetch Historical Chat Logs on Peer Selection Mutation Change
  useEffect(() => {
    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/messages/${activeChatUser.id}`);
        setMessages(response.data);
        // Reset global real-time buffer cache array whenever we move conversation contexts
        setLiveMessages([]);
      } catch (err) {
        console.error('Failed to aggregate historical chat records:', err);
      } finally {
        setLoading(false);
      }
    };

    if (activeChatUser?.id) {
      fetchChatHistory();
    }
  }, [activeChatUser?.id, setLiveMessages]);

  // 2. Intercept Live Buffered Message Arrays and append them safely to current UI view states
  useEffect(() => {
    if (liveMessages.length > 0) {
      const latestMsg = liveMessages[liveMessages.length - 1];
      
      // Structural Condition Verification: Ensure incoming message belongs explicitly to this dialogue context
      const belongsToCurrentChat = 
        (latestMsg.sender_id === user.id && latestMsg.recipient_id === activeChatUser.id) ||
        (latestMsg.sender_id === activeChatUser.id && latestMsg.recipient_id === user.id);

      if (belongsToCurrentChat) {
        setMessages((prev) => [...prev, latestMsg]);
      }
    }
  }, [liveMessages, activeChatUser.id, user.id]);

  // 3. Auto-Scroll Viewport Canvas to anchor latest messages safely into view focus layout frame
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 4. Handle Submitting Text Messages Over the WebSocket Channel Pipe
  const handleSendMessage = (e) => {
    e.preventDefault();
    const cleanText = textInput.trim();
    if (!cleanText) return;

    // Dispatch raw JSON payloads out over the active stateful WS pipeline network broker context layer
    emitEvent('private_message', {
      recipient_id: activeChatUser.id,
      content: cleanText
    });

    setTextInput('');
    // Clear typing indicator immediately upon broadcast submit trigger action event execution
    emitEvent('typing_status', { recipient_id: activeChatUser.id, is_typing: false });
  };

  // 5. Broadcast Dynamic Typing Indicator Pulse Events
  const handleInputChange = (e) => {
    setTextInput(e.target.value);

    // Emit live event indicating active client interaction state
    emitEvent('typing_status', { recipient_id: activeChatUser.id, is_typing: true });

    // Debounce listener to clear state automatically after 2.5 seconds of input inactivity
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      emitEvent('typing_status', { recipient_id: activeChatUser.id, is_typing: false });
    }, 2500);
  };

  const isPeerTyping = typingStatuses[activeChatUser.id];

  return (
    <div className="w-full h-full flex flex-col bg-chatBg">
      {/* Structural Interactive Ribbon Top Bar Header Layout Panel Element */}
      <div className="p-4 bg-panelBg border-b border-gray-800/60 flex items-center gap-3">
        <UserAvatar username={activeChatUser.username} isOnline={false} size="md" />
        <div>
          <h2 className="text-sm font-bold text-white tracking-wide">@{activeChatUser.username}</h2>
          <p className="text-[10px] text-gray-500 font-medium">Direct Peer Session Connection Active</p>
        </div>
      </div>

      {/* Primary Message Stream Rendering Container Screen Box Panel Shell Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar bg-chatBg/30">
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-accentColor border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-xs text-gray-600 font-medium tracking-wide">
            Beginning of an encrypted, secure chat stream line timeline with @{activeChatUser.username}.
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === user.id;
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md text-sm ${
                  isMe 
                    ? 'bg-accentColor text-white rounded-br-none' 
                    : 'bg-panelBg text-gray-200 rounded-bl-none border border-gray-800/40'
                }`}>
                  <p className="leading-relaxed break-words">{msg.content}</p>
                  <p className={`text-[9px] text-right mt-1 font-medium ${isMe ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        
        {/* Dynamic Live Peer Activity Input Feed Feedback Banner Component Grid Element */}
        {isPeerTyping && (
          <div className="flex justify-start animate-pulse">
            <div className="bg-panelBg text-xs text-gray-400 px-4 py-2 rounded-xl border border-gray-800/40 flex items-center gap-1.5 font-medium">
              <span className="flex gap-0.5 items-center justify-center">
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </span>
              @{activeChatUser.username} is typing...
            </div>
          </div>
        )}
        
        {/* Hidden anchor pointer box monitoring view transitions for programmatic viewport focus scroll lock hooks */}
        <div ref={messagesEndRef} />
      </div>

      {/* Form Interface Layout Payload Dispatch Bar Row Footer Panel Element */}
      <form onSubmit={handleSendMessage} className="p-4 bg-panelBg/50 border-t border-gray-800/60 flex items-center gap-3">
        <button type="button" className="text-gray-500 hover:text-gray-300 transition-colors p-1 rounded-lg">
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          value={textInput}
          onChange={handleInputChange}
          placeholder={`Message @${activeChatUser.username}...`}
          className="flex-1 bg-chatBg border border-gray-800 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentColor/60 transition-colors"
        />
        <button
          type="submit"
          disabled={!textInput.trim()}
          className="p-2.5 bg-accentColor hover:bg-indigo-600 disabled:bg-gray-800 disabled:text-gray-600 rounded-xl text-white transition-all shadow-md shadow-indigo-500/10 disabled:shadow-none"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default ChatWindow;