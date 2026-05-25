import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [liveMessages, setLiveMessages] = useState([]);
  const [typingStatuses, setTypingStatuses] = useState({});
  
  // Use a mutable ref box to monitor connection state across render cycles
  const reconnectTimeoutRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    // Connect to the WebSocket server if a authenticated user profile exists
    if (!user) {
      if (socketRef.current) {
        socketRef.current.close();
      }
      return;
    }

    const connectWebSocket = () => {
      const token = localStorage.getItem('synctalk_token');
      let WS_URL = import.meta.env.VITE_WS_URL;
      if (!WS_URL) {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws";
        WS_URL = `${protocol}://${window.location.host}/ws`;
      }
      
      // Pass the JWT credential securely via handshake query parameters
      const ws = new WebSocket(`${WS_URL}?token=${token}`);
      socketRef.current = ws;

      ws.onopen = () => {
        console.log("SyncTalk WebSocket pipeline established successfully.");
        setSocket(ws);
      };

      ws.onmessage = (event) => {
        const payload = JSON.parse(event.data);
        const { event: eventType, data } = payload;

        switch (eventType) {
          case 'presence_change':
            // Update the global user presence cache map
            setOnlineUsers((prev) => ({
              ...prev,
              [data.user_id]: data.is_online
            }));
            break;

          case 'new_message':
            // Pipe the incoming live message directly into global stream listeners
            setLiveMessages((prev) => [...prev, data]);
            break;

          case 'typing_status':
            // Monitor real-time user activity indicators
            setTypingStatuses((prev) => ({
              ...prev,
              [data.sender_id]: data.is_typing
            }));
            break;

          default:
            break;
        }
      };

      ws.onclose = () => {
        console.warn("SyncTalk WebSocket connection dropped out. Scheduling automatic reconnect...");
        setSocket(null);
        // Requirement: Auto-scroll / Auto-reconnect pipeline logic (Attempt reconnect every 5 seconds)
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 5000);
      };

      ws.onerror = (err) => {
        console.error("WebSocket pipeline hit an unhandled error state:", err);
        ws.close();
      };
    };

    connectWebSocket();

    // Clean up connections on unmount or logout
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) socketRef.current.close();
    };
  }, [user]);

  // Utility method allowing client components to submit structured payloads over the wire
  const emitEvent = (event, data) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ event, data }));
    } else {
      console.error("Failed to broadcast payload: WebSocket session is offline.");
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, liveMessages, setLiveMessages, typingStatuses, emitEvent }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be executed within an active SocketProvider component wrapper.');
  }
  return context;
};