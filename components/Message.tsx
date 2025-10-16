import React from 'react';
import type { ChatMessage } from '../types';
import { MessageRole } from '../types';

interface MessageProps {
  message: ChatMessage;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === MessageRole.USER;

  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-xl flex-shrink-0">
          <span>☁️</span>
        </div>
      )}
      <div
        className={`px-4 py-3 rounded-2xl max-w-md md:max-w-lg whitespace-pre-wrap ${
          isUser
            ? 'bg-teal-500 text-white rounded-br-none'
            : 'bg-slate-200 text-slate-800 rounded-bl-none'
        }`}
      >
        {message.text}
      </div>
       {isUser && (
        <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center font-bold flex-shrink-0">
          <span>あなた</span>
        </div>
      )}
    </div>
  );
};

export default Message;