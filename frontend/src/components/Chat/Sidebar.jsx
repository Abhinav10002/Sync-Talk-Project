import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useSocket } from '../../context/SocketContext';
import { useAuth } from '../../context/AuthContext';
import UserAvatar from '../UserAvatar';
import { LogOut, MessageSquare, Search } from 'lucide-react';

const Sidebar = ({ activeChatUser, setActiveChatUser }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { onlineUsers } = useSocket();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const response = await api.get('/users/');
        setUsers(response.data);
      } catch (err) {
        console.error('Failed to load user directory logs:', err);
      }
    };
    fetchDirectory();
  }, []);

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full md:w-80 h-full flex flex-col bg-panelBg border-r border-gray-800/80">
      {/* Brand Ribbon Header */}
      <div className="p-4 border-b border-gray-800/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-accentColor rounded-lg text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg text-white tracking-wide">SyncTalk</span>
        </div>
      </div>

      {/* Directory Search Input */}
      <div className="p-3">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-chatBg border border-gray-800 rounded-xl text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-accentColor/60 transition-colors"
          />
        </div>
      </div>

      {/* User Directory List Grid */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {filteredUsers.map((item) => {
          const isUserOnline = onlineUsers[item.id] !== undefined ? onlineUsers[item.id] : item.is_online;
          const isSelected = activeChatUser?.id === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveChatUser(item)}
              className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-200 ${
                isSelected
                  ? 'bg-accentColor text-white shadow-lg shadow-indigo-500/10'
                  : 'hover:bg-chatBg/60 text-gray-300'
              }`}
            >
              <UserAvatar username={item.username} isOnline={isUserOnline} />
              <div className="flex-1 text-left min-w-0">
                <p className={`font-semibold text-sm truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}>
                  @{item.username}
                </p>
                <p className={`text-xs truncate ${isSelected ? 'text-indigo-200' : 'text-gray-500'}`}>
                  {isUserOnline ? 'Online now' : 'Offline'}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Logged In User Footer Profile Card */}
      <div className="p-3 border-t border-gray-800/60 bg-chatBg/40 flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0">
          <UserAvatar username={user?.username} isOnline={true} size="sm" />
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-300 truncate">@{user?.username}</p>
            <p className="text-[10px] text-green-500 flex items-center gap-1 font-medium">Session Active</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
          title="Sign Out Account"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;