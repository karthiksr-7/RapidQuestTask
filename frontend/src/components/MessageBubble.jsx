// src/components/MessageBubble.jsx
import React from 'react';
import './MessageBubble.css';

const YOUR_NUMBER = '918329446654'; // ✅ Your number

const MessageBubble = ({ message }) => {
  const isOwn = message.from === YOUR_NUMBER;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return '✔';
      case 'delivered':
        return '✔✔';
      case 'read':
        return '✔✔'; // Styled in blue below
      default:
        return '';
    }
  };

  return (
    <div className={`message-row ${isOwn ? 'own' : 'other'}`}>
      <div className={`message-bubble ${isOwn ? 'own-bubble' : 'other-bubble'}`}>
        <div className="message-text">{message.message}</div>

        <div className="message-meta">
          <span className="timestamp">
            {new Date(message.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </span>

          {isOwn && message.status && (
            <span
              className={`status-icon ${message.status === 'read' ? 'read' : ''}`}
              title={message.status}
            >
              {getStatusIcon(message.status)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
