import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, Phone, Video, MoreVertical, Smile, Paperclip, Check, CheckCheck } from 'lucide-react';
import type { Chat, Message } from '../App';

interface ChatViewProps {
  chat: Chat;
  messages: Message[];
  onToggleAI: () => void;
  showAI: boolean;
}

export default function ChatView({ chat, messages, onToggleAI, showAI }: ChatViewProps) {
  const [inputText, setInputText] = useState('');

  const renderStatus = (status?: string) => {
    if (!status) return null;
    if (status === 'read') return <CheckCheck className="w-3.5 h-3.5 text-[#2AABEE]" />;
    if (status === 'delivered') return <CheckCheck className="w-3.5 h-3.5 text-[#8B90A0]" />;
    return <Check className="w-3.5 h-3.5 text-[#8B90A0]" />;
  };

  return (
    <div className="flex-1 flex flex-col bg-[#141722]">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-[#2A2F45] bg-[#1B1F2E]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#2A2F45] flex items-center justify-center text-lg">
            {chat.avatar}
          </div>
          <div>
            <h3 className="text-white font-medium text-sm">{chat.name}</h3>
            <p className="text-xs text-[#8B90A0]">
              {chat.online ? (
                <span className="text-[#4CD964]">онлайн</span>
              ) : (
                'был(а) недавно'
              )}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onToggleAI}
            className={`p-2 rounded-xl transition-all ${showAI ? 'bg-[#7C5CFC]/20 text-[#7C5CFC]' : 'text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white'}`}
            title="AI Ассистент"
          >
            <Bot className="w-5 h-5" />
          </motion.button>
          <button className="p-2 rounded-xl text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white transition-all">
            <Phone className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white transition-all">
            <Video className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-xl text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white transition-all">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${
                msg.sender === 'me'
                  ? 'bg-gradient-to-r from-[#2AABEE] to-[#229ED9] text-white rounded-br-md'
                  : 'bg-[#1E2235] text-[#E8EAF0] rounded-bl-md border border-[#2A2F45]'
              }`}
            >
              <p className="text-sm leading-relaxed">{msg.text}</p>
              <div className={`flex items-center gap-1 mt-1 ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                <span className={`text-[10px] ${msg.sender === 'me' ? 'text-white/60' : 'text-[#8B90A0]'}`}>
                  {msg.time}
                </span>
                {msg.sender === 'me' && renderStatus(msg.status)}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-[#2A2F45] bg-[#1B1F2E]/50">
        <div className="flex items-center gap-2">
          <button className="p-2.5 rounded-xl text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white transition-all">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Написать сообщение..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#2AABEE] transition-colors"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B90A0] hover:text-white transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#2AABEE] to-[#7C5CFC] text-white shadow-lg shadow-[#2AABEE]/20"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
