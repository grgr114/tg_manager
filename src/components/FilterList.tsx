import { motion } from 'framer-motion';
import { RefreshCw, Search, ToggleLeft, ToggleRight, Filter as FilterIcon } from 'lucide-react';
import { useState } from 'react';
import type { Filter } from '../App';

interface FilterListProps {
  filters: Filter[];
  onToggle: (chatId: string, enabled: boolean) => void;
  onRefresh: () => void;
}

export default function FilterList({ filters, onToggle, onRefresh }: FilterListProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'enabled' | 'disabled'>('all');

  const filtered = filters.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = 
      filterType === 'all' ||
      (filterType === 'enabled' && f.auto_reply) ||
      (filterType === 'disabled' && !f.auto_reply);
    return matchesSearch && matchesFilter;
  });

  const enabledCount = filters.filter(f => f.auto_reply).length;
  const disabledCount = filters.filter(f => !f.auto_reply).length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Фильтры автоответа</h1>
          <p className="text-[#8B90A0] text-sm mt-1">
            Выберите кому AI будет отвечать автоматически
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onRefresh}
          className="p-2.5 rounded-xl bg-[#2A2F45] text-[#8B90A0] hover:text-white transition-all"
        >
          <RefreshCw className="w-5 h-5" />
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-4">
          <p className="text-2xl font-bold text-white">{filters.length}</p>
          <p className="text-xs text-[#8B90A0] mt-1">Всего чатов</p>
        </div>
        <div className="bg-[#1E2235] border border-[#4CD964]/30 rounded-2xl p-4">
          <p className="text-2xl font-bold text-[#4CD964]">{enabledCount}</p>
          <p className="text-xs text-[#8B90A0] mt-1">AI отвечает</p>
        </div>
        <div className="bg-[#1E2235] border border-[#FF9500]/30 rounded-2xl p-4">
          <p className="text-2xl font-bold text-[#FF9500]">{disabledCount}</p>
          <p className="text-xs text-[#8B90A0] mt-1">AI игнорирует</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
          <input
            type="text"
            placeholder="Поиск чата..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#1E2235] border border-[#2A2F45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#2AABEE] transition-colors"
          />
        </div>
        <div className="flex gap-1 bg-[#1E2235] border border-[#2A2F45] rounded-xl p-1">
          {(['all', 'enabled', 'disabled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilterType(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all
                ${filterType === f
                  ? 'bg-[#2AABEE]/20 text-[#2AABEE]'
                  : 'text-[#8B90A0] hover:text-white'
                }`}
            >
              {f === 'all' ? 'Все' : f === 'enabled' ? 'Активные' : 'Отключённые'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter List */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-[#8B90A0]">
            <FilterIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Чаты не найдены</p>
          </div>
        ) : (
          filtered.map((filter, index) => (
            <motion.div
              key={filter.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="flex items-center gap-4 bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-4 hover:border-[#2A2F45]/80 transition-all"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-[#2A2F45] flex items-center justify-center text-xl flex-shrink-0">
                {filter.avatar}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-white font-medium truncate">{filter.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                    filter.type === 'private' ? 'bg-[#2AABEE]/20 text-[#2AABEE]' :
                    filter.type === 'group' ? 'bg-[#7C5CFC]/20 text-[#7C5CFC]' :
                    'bg-[#FF9500]/20 text-[#FF9500]'
                  }`}>
                    {filter.type === 'private' ? 'Личный' : filter.type === 'group' ? 'Группа' : 'Канал'}
                  </span>
                </div>
                <p className="text-xs text-[#8B90A0] mt-0.5">
                  {filter.auto_reply ? 'AI будет отвечать автоматически' : 'AI будет игнорировать'}
                </p>
              </div>

              {/* Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onToggle(filter.id, !filter.auto_reply)}
                className="flex-shrink-0"
              >
                {filter.auto_reply ? (
                  <ToggleRight className="w-10 h-10 text-[#4CD964]" />
                ) : (
                  <ToggleLeft className="w-10 h-10 text-[#8B90A0]" />
                )}
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Info */}
      <div className="mt-6 p-4 bg-[#1E2235] border border-[#2A2F45] rounded-2xl">
        <p className="text-xs text-[#8B90A0]">
          <span className="text-[#7C5CFC]">💡 Подсказка:</span> Включите автоответ только для важных чатов. AI будет анализировать контекст и отвечать только если это необходимо.
        </p>
      </div>
    </div>
  );
}
