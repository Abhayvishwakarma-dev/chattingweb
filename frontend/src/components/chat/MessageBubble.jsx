import React, { useState } from 'react';
import { format } from 'date-fns';
import { FaCheck, FaCheckDouble, FaReply, FaImage, FaVideo, FaFile, FaPlay } from 'react-icons/fa';

const MessageBubble = ({ message, isOwn }) => {
  const [showTime, setShowTime] = useState(false);
  const isReply = message.replyTo;

  const getStatusIcon = () => {
    if (!isOwn) return null;
    
    switch (message.status) {
      case 'sent':
        return <FaCheck className="text-xs text-gray-400" />;
      case 'delivered':
        return <FaCheckDouble className="text-xs text-gray-400" />;
      case 'read':
        return <FaCheckDouble className="text-xs text-blue-500" />;
      default:
        return null;
    }
  };

  const getTime = () => {
    return format(new Date(message.createdAt), 'hh:mm a');
  };

  const getMediaIcon = (type) => {
    switch (type) {
      case 'image':
        return <FaImage className="text-2xl" />;
      case 'video':
        return <FaVideo className="text-2xl" />;
      case 'audio':
        return <FaPlay className="text-2xl" />;
      case 'document':
        return <FaFile className="text-2xl" />;
      default:
        return null;
    }
  };

  const renderMedia = () => {
    if (!message.mediaUrl) return null;

    switch (message.type) {
      case 'image':
        return (
          <div className="relative group">
            <img
              src={message.mediaUrl}
              alt="Shared image"
              className="rounded-lg max-w-full max-h-80 object-cover cursor-pointer hover:opacity-90 transition"
              onClick={() => window.open(message.mediaUrl, '_blank')}
            />
            {message.content && (
              <p className="mt-1 text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'video':
        return (
          <div className="relative group">
            <video
              src={message.mediaUrl}
              controls
              className="rounded-lg max-w-full max-h-80"
              poster={message.thumbnail || ''}
            />
            {message.content && (
              <p className="mt-1 text-sm">{message.content}</p>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-black/5">
            <button className="w-8 h-8 rounded-full bg-whatsapp-green text-white flex items-center justify-center hover:scale-105 transition">
              <FaPlay className="text-sm" />
            </button>
            <div className="flex-1">
              <div className="h-1 bg-gray-300 rounded-full">
                <div className="h-1 bg-whatsapp-green rounded-full w-1/3"></div>
              </div>
              <p className="text-xs mt-1 opacity-75">Audio message</p>
            </div>
            <span className="text-xs opacity-75">0:30</span>
          </div>
        );

      case 'document':
        return (
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-black/5 hover:bg-black/10 transition cursor-pointer">
            <div className="w-10 h-10 bg-whatsapp-green/20 rounded-lg flex items-center justify-center">
              <FaFile className="text-whatsapp-green text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.content || 'Document'}</p>
              <p className="text-xs opacity-75">Click to download</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-1`}
      onMouseEnter={() => setShowTime(true)}
      onMouseLeave={() => setShowTime(false)}
    >
      <div
        className={`max-w-[75%] relative ${
          isOwn
            ? 'bg-whatsapp-green text-white rounded-l-lg rounded-tr-lg'
            : 'bg-white text-gray-800 rounded-r-lg rounded-tl-lg'
        } px-3 py-2 shadow-sm`}
      >
        {/* Reply Preview */}
        {isReply && (
          <div className={`text-xs mb-1 p-2 rounded border-l-4 ${
            isOwn ? 'border-white/30 bg-white/10' : 'border-gray-300 bg-gray-50'
          }`}>
            <p className="font-medium text-xs opacity-75">Reply</p>
            <p className="truncate">{message.replyTo.content || 'Media'}</p>
          </div>
        )}

        {/* Message Content */}
        {message.type === 'text' && (
          <p className="text-sm break-words whitespace-pre-wrap">
            {message.content}
          </p>
        )}

        {/* Media Content */}
        {message.type !== 'text' && renderMedia()}

        {/* Message Footer */}
        <div className={`flex items-center justify-end space-x-1 mt-1 ${
          isOwn ? 'text-white/70' : 'text-gray-400'
        }`}>
          <span className="text-[10px]">{getTime()}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;