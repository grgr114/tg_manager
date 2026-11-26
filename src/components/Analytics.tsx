import { motion } from 'framer-motion';
import { MessageSquare, Users, Activity, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import type { Chat, WSEvent } from '../App';

interface AnalyticsProps {
  events: WSEvent[];
  chats: Chat[];
}

export default function Analytics({ events, chats }: AnalyticsProps) {
  const incomingCount = events.filter(e => e.type === 'incoming_message').length;
  const aiRepliedCount = events.filter(e => e.type === 'ai_replied').length;
  const aiSkippedCount = events.filter(e => e.type === 'ai_skip').length;
  const cooldownCount = events.filter(e => e.type === 'cooldown_skip').length;

  const stats = [
    { label: 'Входящих сообщений', value: incomingCount, icon: MessageSquare, color: '#2AABEE' },
    { label: 'AI ответил', value: aiRepliedCount, icon: CheckCircle, color: '#4CD964' },
    { label: 'AI пропустил (SKIP)', value: aiSkippedCount, icon: Zap, color: '#7C5CFC' },
    { label: 'Кулдаун', value: cooldownCount, icon: AlertCircle, color: '#FF9500' },
  ];

  // Recent events
  const recentEvents = events.slice(-20).reverse();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Аналитика</h1>
        <p className="text-[#8B90A0] text-sm mt-1">Статистика работы AI-агента в реальном времени</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#2A2F45] flex items-center justify-center">
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[#8B90A0] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Chat activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Users className="w-4 h-4 text-[#2AABEE]" />
            Активные чаты ({chats.length})
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {chats.slice(0, 10).map((chat) => (
              <div key={chat.id} className="flex items-center gap-3 p-2 rounded-lg bg-[#141722]">
                <div className="w-8 h-8 rounded-full bg-[#2A2F45] flex items-center justify-center text-sm">
                  {chat.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white truncate">{chat.name}</p>
                  <p className="text-xs text-[#8B90A0]">{chat.type} • {chat.unread} непрочитанных</p>
                </div>
              </div>
            ))}
            {chats.length === 0 && (
              <p className="text-[#8B90A0] text-sm text-center py-4">Нет данных</p>
            )}
          </div>
        </motion.div>

        {/* Event Log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-[#7C5CFC]" />
            Лог событий
          </h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {recentEvents.map((event, i) => (
              <div key={i} className="flex items-start gap-2 p-2 rounded-lg bg-[#141722] text-xs">
                <span className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${
                  event.type === 'ai_replied' ? 'bg-[#4CD964]' :
                  event.type === 'ai_skip' ? 'bg-[#7C5CFC]' :
                  event.type === 'incoming_message' ? 'bg-[#2AABEE]' :
                  event.type === 'cooldown_skip' ? 'bg-[#FF9500]' :
                  'bg-[#8B90A0]'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">
                    {event.type === 'incoming_message' && `📩 ${event.chat_name}: ${event.text?.slice(0, 50)}`}
                    {event.type === 'ai_replied' && `✅ AI ответил в "${event.chat_name}": ${event.text?.slice(0, 50)}`}
                    {event.type === 'ai_skip' && `⏭️ AI пропустил "${event.chat_name}"`}
                    {event.type === 'ai_thinking' && `🤔 AI думает о "${event.chat_name}"`}
                    {event.type === 'cooldown_skip' && `⏳ Кулдаун для "${event.chat_name}" (${event.remaining}с)`}
                    {event.type === 'busy_changed' && `🔄 Busy: ${event.busy ? 'ON' : 'OFF'}`}
                    {event.type === 'error' && `❌ Ошибка: ${event.error}`}
                    {!['incoming_message', 'ai_replied', 'ai_skip', 'ai_thinking', 'cooldown_skip', 'busy_changed', 'error'].includes(event.type) && event.type}
                  </p>
                  {event.timestamp && (
                    <p className="text-[#8B90A0] text-[10px]">{new Date(event.timestamp).toLocaleTimeString()}</p>
                  )}
                </div>
              </div>
            ))}
            {recentEvents.length === 0 && (
              <p className="text-[#8B90A0] text-sm text-center py-4">Событий пока нет</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
