import { motion } from 'framer-motion';
import { MessageSquare, BarChart3, Bot, Settings, Wifi, WifiOff, Filter, Calendar } from 'lucide-react';
import type { View } from '../App';

interface SidebarProps {
  currentView: View;
  setCurrentView: (view: View) => void;
  isConnected: boolean;
  totalUnread: number;
}

export default function Sidebar({ currentView, setCurrentView, isConnected, totalUnread }: SidebarProps) {
  const navItems = [
    { id: 'chats' as View, icon: MessageSquare, label: 'Чаты', badge: totalUnread },
    { id: 'filters' as View, icon: Filter, label: 'Фильтры' },
    { id: 'calendar' as View, icon: Calendar, label: 'Календарь' },
    { id: 'analytics' as View, icon: BarChart3, label: 'Аналитика' },
    { id: 'agent' as View, icon: Bot, label: 'AI Агент' },
    { id: 'settings' as View, icon: Settings, label: 'Настройки' },
  ];

  return (
    <div className="w-16 lg:w-64 bg-[#1B1F2E] border-r border-[#2A2F45] flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-[#2A2F45]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2AABEE] to-[#7C5CFC] flex items-center justify-center text-white font-bold text-sm">
            TQ
          </div>
          <div className="hidden lg:block">
            <h1 className="text-white font-semibold text-sm">TeleQwen AI</h1>
            <p className="text-[#8B90A0] text-xs">Telegram Manager</p>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="px-3 py-3 hidden lg:block">
        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isConnected ? 'bg-[#1a2e1a]' : 'bg-[#2e1a1a]'}`}>
          {isConnected ? (
            <Wifi className="w-3.5 h-3.5 text-[#4CD964]" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-red-400" />
          )}
          <span className={`text-xs ${isConnected ? 'text-[#4CD964]' : 'text-red-400'}`}>
            {isConnected ? 'Подключено' : 'Отключено'}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <motion.button
              key={item.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative
                ${isActive
                  ? 'bg-gradient-to-r from-[#2AABEE]/20 to-[#7C5CFC]/20 text-white'
                  : 'text-[#8B90A0] hover:text-white hover:bg-[#2A2F45]/50'
                }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-gradient-to-b from-[#2AABEE] to-[#7C5CFC] rounded-r-full"
                />
              )}
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block text-sm font-medium">{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="hidden lg:flex ml-auto bg-[#2AABEE] text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] justify-center">
                  {item.badge}
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-[#2A2F45] hidden lg:block">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7C5CFC] to-[#2AABEE] flex items-center justify-center text-white text-xs font-bold">
            U
          </div>
          <div>
            <p className="text-white text-xs font-medium">User Account</p>
            <p className="text-[#8B90A0] text-xs">+7 *** *** ** 42</p>
          </div>
        </div>
      </div>
    </div>
  );
}
