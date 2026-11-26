import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useState } from 'react';
import type { Chat } from '../App';

interface ChatListProps {
  chats: Chat[];
  selectedChat: string | null;
  onSelectChat: (id: string) => void;
  loading?: boolean;
}

export default function ChatList({ chats, selectedChat, onSelectChat, loading }: ChatListProps) {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'private' | 'group' | 'channel'>('all');

  const filteredChats = chats.filter(chat => {
    const matchesSearch = chat.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || chat.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="w-80 bg-[#1B1F2E] border-r border-[#2A2F45] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#2A2F45]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold text-lg">Чаты</h2>
          <span className="text-[#8B90A0] text-xs bg-[#2A2F45] px-2 py-1 rounded-full">
            {filteredChats.length}
          </span>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
          <input
            type="text"
            placeholder="Поиск чатов..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#2AABEE] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-1">
          {(['all', 'private', 'group', 'channel'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filter === f
                  ? 'bg-[#2AABEE]/20 text-[#2AABEE]'
                  : 'text-[#8B90A0] hover:bg-[#2A2F45]'
                }`}
            >
              {f === 'all' ? 'Все' : f === 'private' ? 'Личные' : f === 'group' ? 'Группы' : 'Каналы'}
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-[#2AABEE] rounded-full typing-dot" />
              <div className="w-2 h-2 bg-[#2AABEE] rounded-full typing-dot" />
              <div className="w-2 h-2 bg-[#2AABEE] rounded-full typing-dot" />
            </div>
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-[#8B90A0] text-sm">
            <p>{chats.length === 0 ? 'Нет чатов' : 'Ничего не найдено'}</p>
          </div>
        ) : (
          filteredChats.map((chat, index) => (
            <motion.button
              key={chat.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelectChat(chat.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-all duration-200 border-b border-[#2A2F45]/50
                ${selectedChat === chat.id
                  ? 'bg-gradient-to-r from-[#2AABEE]/10 to-transparent'
                  : 'hover:bg-[#2A2F45]/30'
                }`}
            >
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl
                  ${selectedChat === chat.id
                    ? 'bg-gradient-to-br from-[#2AABEE]/30 to-[#7C5CFC]/30'
                    : 'bg-[#2A2F45]'
                  }`}
                >
                  {chat.avatar}
                </div>
                {chat.online && (
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#4CD964] rounded-full border-2 border-[#1B1F2E]" />
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium truncate ${selectedChat === chat.id ? 'text-white' : 'text-[#E8EAF0]'}`}>
                    {chat.name}
                  </span>
                  <span className="text-xs text-[#8B90A0] flex-shrink-0 ml-2">{chat.time}</span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                  <p className="text-xs text-[#8B90A0] truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="flex-shrink-0 ml-2 bg-[#2AABEE] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </motion.button>
          ))
        )}
      </div>
    </div>
  );
}
