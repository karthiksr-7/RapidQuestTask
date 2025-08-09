// src/components/ChatWindow.jsx
import React, { useEffect, useRef } from 'react';
//import './ChatWindow.css'; // Optional for styling

const ChatWindow = ({ messages, currentUser }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="chat-window" ref={scrollRef}>
      {messages.map((msg) => {
        const isOwn = msg.from !== msg.wa_id;
        return (
          <div key={msg._id} className={`message-bubble ${isOwn ? 'sent' : 'received'}`}>
            <div className="message-text">{msg.message}</div>
            <div className="message-info">
              <span className="timestamp">
                {new Date(msg.timestamp).toLocaleString()}
              </span>
              <span className="status">✔️ {msg.status}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatWindow;
