import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, Clock, Trash2, Plus, RefreshCw, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import type { CalendarEvent } from '../App';

const API_BASE = 'http://127.0.0.1:8000';

interface CalendarViewProps {
  events: CalendarEvent[];
  onDelete: (id: string) => void;
  onRefresh: () => void;
}

export default function CalendarView({ events, onDelete, onRefresh }: CalendarViewProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  // Sort events by date
  const sortedEvents = [...events].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA - dateB;
  });

  // Group by date
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  sortedEvents.forEach(event => {
    const dateKey = event.date.split(' ')[0] || event.date.split('T')[0];
    if (!groupedEvents[dateKey]) {
      groupedEvents[dateKey] = [];
    }
    groupedEvents[dateKey].push(event);
  });

  const handleCreate = async () => {
    if (!title || !date) return;
    try {
      const res = await fetch(`${API_BASE}/api/calendar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date, description }),
      });
      if (res.ok) {
        setTitle('');
        setDate('');
        setDescription('');
        setShowForm(false);
        onRefresh();
      }
    } catch (e) {
      console.error('Failed to create event:', e);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('ru-RU', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  const formatTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleTimeString('ru-RU', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    } catch {
      return '';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Календарь событий</h1>
          <p className="text-[#8B90A0] text-sm mt-1">
            AI автоматически извлекает события из переписок
          </p>
        </div>
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRefresh}
            className="p-2.5 rounded-xl bg-[#2A2F45] text-[#8B90A0] hover:text-white transition-all"
          >
            <RefreshCw className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2AABEE] to-[#7C5CFC] text-white font-medium text-sm flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Добавить
          </motion.button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5 mb-6"
        >
          <h3 className="text-white font-semibold mb-4">Новое событие</h3>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Название события"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#2AABEE] transition-colors"
            />
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2AABEE] transition-colors"
            />
            <textarea
              placeholder="Описание (опционально)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#2AABEE] transition-colors resize-none"
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleCreate}
                className="px-4 py-2 rounded-xl bg-[#4CD964]/20 text-[#4CD964] font-medium text-sm"
              >
                Создать
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-xl bg-[#2A2F45] text-[#8B90A0] font-medium text-sm"
              >
                Отмена
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">{events.length}</p>
          <p className="text-xs text-[#8B90A0] mt-1">Всего событий</p>
        </div>
        <div className="bg-[#1E2235] border border-[#7C5CFC]/30 rounded-2xl p-4">
          <p className="text-2xl font-bold text-[#7C5CFC]">{Object.keys(groupedEvents).length}</p>
          <p className="text-xs text-[#8B90A0] mt-1">Дней с событиями</p>
        </div>
      </div>

      {/* Events List */}
      {Object.keys(groupedEvents).length === 0 ? (
        <div className="text-center py-12 text-[#8B90A0]">
          <CalendarIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Событий пока нет</p>
          <p className="text-xs mt-1">AI будет автоматически извлекать события из переписок</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedEvents).map(([dateKey, dateEvents]) => (
            <div key={dateKey}>
              <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-[#2AABEE]" />
                {formatDate(dateKey)}
              </h3>
              <div className="space-y-2">
                {dateEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-4 hover:border-[#2A2F45]/80 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2AABEE]/20 to-[#7C5CFC]/20 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-[#2AABEE]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium">{event.title}</p>
                          {event.source && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#7C5CFC]/20 text-[#7C5CFC] flex items-center gap-1">
                              <MessageSquare className="w-2.5 h-2.5" />
                              {event.source}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#8B90A0]">
                          {formatTime(event.date)}
                        </p>
                        {event.description && (
                          <p className="text-sm text-[#8B90A0] mt-2">{event.description}</p>
                        )}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onDelete(event.id)}
                        className="p-2 rounded-lg text-[#8B90A0] hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-6 p-4 bg-[#1E2235] border border-[#2A2F45] rounded-2xl">
        <p className="text-xs text-[#8B90A0]">
          <span className="text-[#7C5CFC]">🤖 AI-извлечение:</span> Когда включён режим Busy, AI анализирует переписки и автоматически добавляет встречи, дедлайны и важные события в календарь.
        </p>
      </div>
    </div>
  );
}
