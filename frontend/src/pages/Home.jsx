import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ChatList from '../components/ChatList';
import MessageBubble from '../components/MessageBubble';
import MessageInput from '../components/MessageInput';
import { fetchAllMessages, sendMessage } from '../services/whatsappApi';
import './Home.css';

const YOUR_NUMBER = '918329446654';
const SOCKET_SERVER_URL = 'https://mychatapp-backend.onrender.com';

const generateMessageId = () => {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 12).toUpperCase();
  const base = `HB${timestamp}${randomStr}`;
  const base64 = btoa(base);
  return `wamid.${base64}`;
};

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔁 Real-time updates with socket.io
  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      console.log('✅ Socket connected');
    });

    // New message added
    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    // Message status updated (sent → delivered/read)
    socket.on('status_update', (updatedMsg) => {
      setMessages((prev) =>
        prev.map((m) =>
          m.message_id === updatedMsg.message_id
            ? { ...m, ...updatedMsg }
            : m
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // 🔃 Initial load
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const data = await fetchAllMessages();
      setMessages(data);
    } catch (err) {
      setError('Failed to load messages. Check backend.');
    } finally {
      setLoading(false);
    }
  };

  const getGroupedMessages = () => {
    return messages.reduce((acc, msg) => {
      acc[msg.wa_id] = acc[msg.wa_id] || [];
      acc[msg.wa_id].push(msg);
      return acc;
    }, {});
  };

  const handleSend = async (text) => {
    if (!selectedUser || !text.trim()) return;

    const grouped = getGroupedMessages();
    const newMessage = {
      message_id: generateMessageId(),
      wa_id: selectedUser,
      name: grouped[selectedUser]?.[0]?.name || '',
      from: YOUR_NUMBER,
      message: text.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent',
    };

    try {
      await sendMessage(newMessage);
      setMessages((prev) => [...prev, newMessage]); // Optimistic update
    } catch (err) {
      console.error('❌ Error sending message:', err);
      alert('Failed to send message. Try again.');
    }
  };

  const grouped = getGroupedMessages();

  return (
    <div className="home">
      <div className="sidebar">
        <div className="sidebar-header">Chats</div>
        {loading ? (
          <div className="loading">Loading chats...</div>
        ) : (
          <ChatList
            chats={Object.keys(grouped).map((wa_id) => ({
              wa_id,
              name: grouped[wa_id]?.[0]?.name || 'Unknown',
              messages: grouped[wa_id],
            }))}
            onSelect={setSelectedUser}
          />
        )}
      </div>

      <div className="chat-window">
        {loading ? (
          <div className="loading">Loading chat window...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : selectedUser ? (
          <>
            <div className="chat-header">
              <strong>{grouped[selectedUser]?.[0]?.name || 'Unknown'}</strong>
              <div className="chat-number">+{selectedUser}</div>
            </div>

            <div className="messages">
              {(grouped[selectedUser] || [])
                .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
                .map((msg) => (
                  <MessageBubble key={msg.message_id} message={msg} />
                ))}
            </div>

            <MessageInput onSend={handleSend} />
          </>
        ) : (
          <div className="no-chat-selected">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
