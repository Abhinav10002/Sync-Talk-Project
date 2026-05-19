import React, { useState } from 'react';
import Sidebar from '../components/Chat/Sidebar';
import ChatWindow from '../components/Chat/ChatWindow'; // <-- IMPORT CHAT WINDOW
import { MessageSquareOff } from 'lucide-react';

const Dashboard = () => {
  const [activeChatUser, setActiveChatUser] = useState(null);

  return (
    <div className="w-full h-full flex bg-chatBg overflow-hidden">
      {/* Left Column Structural Panel Container Layout Sidebar */}
      <Sidebar activeChatUser={activeChatUser} setActiveChatUser={setActiveChatUser} />

      {/* Right Column Core Messaging Terminal Stage Arena */}
      <div className="flex-1 h-full flex flex-col min-w-0 bg-chatBg">
        {activeChatUser ? (
          /* Mount our active chat connection stream window layout */
          <ChatWindow activeChatUser={activeChatUser} /> // <-- MOUNT CHAT WINDOW
        ) : (
          /* Empty Default State Greeting Landing Matrix Element Vector Canvas View */
          <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 select-none">
            <div className="p-4 bg-panelBg rounded-3xl border border-gray-800/60 text-gray-400 shadow-xl mb-4">
              <MessageSquareOff className="w-10 h-10 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-gray-200">No Active Chat Selected</h3>
            <p className="text-xs text-gray-500 max-w-xs mt-1">
              Select a peer contact profile row configuration from the sidebar left layout column to initialize an encrypted real-time duplex dialogue feed window.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;