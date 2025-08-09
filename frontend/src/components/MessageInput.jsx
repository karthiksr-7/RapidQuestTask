// src/components/MessageInput.jsx
import React, { useState } from 'react';
import './MessageInput.css'; // Optional for custom styles

const MessageInput = ({ onSend }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    const trimmed = text.trim();
    if (trimmed === '') return;
    onSend(trimmed);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent newline if textarea
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        placeholder="Type a message"
        aria-label="Message input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
      />
      <button onClick={handleSend} disabled={text.trim() === ''} aria-label="Send message">
        Send
      </button>
    </div>
  );
};

export default MessageInput;
