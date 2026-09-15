import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../../context/ChatContext';
import { useAuth } from '../../context/AuthContext';
import { FaPaperclip, FaSmile, FaMicrophone, FaPaperPlane } from 'react-icons/fa';

const MessageInput = () => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const { currentChat, sendMessageSocket, sendTypingStart, sendTypingStop } = useChat();
  const { user } = useAuth();
  const inputRef = useRef(null);

  const otherParticipant = currentChat?.otherParticipant || 
    currentChat?.participants?.find(p => p._id !== user?._id);

  const handleSend = () => {
    if (!message.trim() || !currentChat) return;

    sendMessageSocket({
      chatId: currentChat._id,
      content: message.trim(),
      type: 'text',
    });

    setMessage('');
    sendTypingStop(otherParticipant?._id, currentChat._id);
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setMessage(value);

    if (!currentChat || !otherParticipant) return;

    if (value.length > 0 && !isTyping) {
      setIsTyping(true);
      sendTypingStart(otherParticipant._id, currentChat._id);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    if (value.length === 0) {
      setIsTyping(false);
      sendTypingStop(otherParticipant._id, currentChat._id);
    } else {
      const timeout = setTimeout(() => {
        setIsTyping(false);
        sendTypingStop(otherParticipant._id, currentChat._id);
      }, 2000);
      setTypingTimeout(timeout);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  if (!currentChat) {
    return (
      <div className="p-4 bg-white border-t border-gray-200">
        <p className="text-center text-gray-400 text-sm">Select a chat to start messaging</p>
      </div>
    );
  }

  return (
    <div className="p-3 bg-white border-t border-gray-200">
      <div className="flex items-end space-x-2 max-w-4xl mx-auto">
        {/* Attachment Button */}
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition flex-shrink-0">
          <FaPaperclip className="text-xl" />
        </button>

        {/* Emoji Button */}
        <button className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition flex-shrink-0 hidden sm:block">
          <FaSmile className="text-xl" />
        </button>

        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={message}
            onChange={handleTyping}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            rows={1}
            className="w-full px-4 py-2 pr-12 bg-gray-100 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-whatsapp-green focus:bg-white transition text-gray-700 placeholder-gray-500 max-h-32"
            style={{ minHeight: '44px' }}
          />
          
          {/* Voice Button (shown when no message) */}
          {!message.trim() && (
            <button className="absolute right-2 bottom-1 text-gray-500 hover:text-whatsapp-green p-1 rounded-full transition">
              <FaMicrophone className="text-xl" />
            </button>
          )}
        </div>

        {/* Send Button */}
        <button
          onClick={handleSend}
          disabled={!message.trim()}
          className={`p-3 rounded-full transition flex-shrink-0 ${
            message.trim()
              ? 'bg-whatsapp-green text-white hover:bg-whatsapp-dark-green shadow-lg hover:shadow-xl'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <FaPaperPlane className="text-lg" />
        </button>
      </div>
    </div>
  );
};

export default MessageInput;