// src/components/ChatList.jsx
import React from 'react';
import './ChatList.css';

const YOUR_NUMBER = '918329446654'; // ✅ Your own number

const getStatusIcon = (status) => {
  switch (status) {
    case 'sent':
      return '✔';
    case 'delivered':
      return '✔✔';
    case 'read':
      return '✔✔'; // Style as blue via CSS if needed
    default:
      return '';
  }
};

const ChatList = ({ chats, onSelect }) => {
  // Sort chats by latest message timestamp (descending)
  const sortedChats = [...chats].sort((a, b) => {
    const lastMsgA = a.messages?.[a.messages.length - 1];
    const lastMsgB = b.messages?.[b.messages.length - 1];

    const timeA = lastMsgA?.timestamp ? new Date(lastMsgA.timestamp) : new Date(0);
    const timeB = lastMsgB?.timestamp ? new Date(lastMsgB.timestamp) : new Date(0);

    return timeB - timeA; // Descending: latest on top
  });

  return (
    <div className="chat-list">
      {sortedChats.map((chat) => {
        const lastMsg = chat.messages?.[chat.messages.length - 1] || {};
        const isOwn = lastMsg.from === YOUR_NUMBER;
        const previewText = lastMsg.message || 'No messages yet';
        const time = lastMsg.timestamp
          ? new Date(lastMsg.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '';

        return (
          <div key={chat.wa_id} className="chat-item" onClick={() => onSelect(chat.wa_id)}>
            <div className="chat-item-top">
              <span className="chat-name">{chat.name || chat.wa_id}</span>
              <span className="chat-time">{time}</span>
            </div>
            <div className="chat-preview">
              {isOwn && (
                <span className={`status-icon ${lastMsg.status}`}>
                  {getStatusIcon(lastMsg.status)}
                </span>
              )}
              <span className="preview-text">{previewText}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
