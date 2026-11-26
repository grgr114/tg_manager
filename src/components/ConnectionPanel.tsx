import { motion } from 'framer-motion';
import { Wifi, WifiOff, Bot, Activity, Server, Moon } from 'lucide-react';
import type { StatusResponse, WSEvent } from '../App';

interface ConnectionPanelProps {
  status: StatusResponse;
  onToggleBusy: (enabled: boolean) => void;
  wsEvents: WSEvent[];
}

export default function ConnectionPanel({ status, onToggleBusy, wsEvents }: ConnectionPanelProps) {
  const recentEvents = wsEvents.slice(-10).reverse();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Настройки</h1>
        <p className="text-[#8B90A0] text-sm mt-1">Статус подключения и управление режимами</p>
      </div>

      {/* Telegram Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 mb-4 border ${
          status.connected
            ? 'bg-gradient-to-r from-[#1a2e1a] to-[#1a2e2e] border-[#4CD964]/30'
            : 'bg-gradient-to-r from-[#2e1a1a] to-[#2e2e1a] border-red-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              status.connected ? 'bg-[#4CD964]/20' : 'bg-red-500/20'
            }`}>
              {status.connected ? (
                <Wifi className="w-7 h-7 text-[#4CD964]" />
              ) : (
                <WifiOff className="w-7 h-7 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {status.connected ? 'Telegram подключён' : 'Telegram не подключён'}
              </h3>
              <p className="text-[#8B90A0] text-sm">
                {status.connected
                  ? `Аккаунт: ${status.user}`
                  : 'Проверьте backend/.env и запустите python backend/main.py'
                }
              </p>
            </div>
          </div>
          <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${
            status.connected
              ? 'bg-[#4CD964]/20 text-[#4CD964]'
              : 'bg-red-500/20 text-red-400'
          }`}>
            {status.connected ? 'Online' : 'Offline'}
          </div>
        </div>
      </motion.div>

      {/* Busy Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6 mb-4"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              status.busy ? 'bg-[#7C5CFC]/20' : 'bg-[#2A2F45]'
            }`}>
              {status.busy ? (
                <Bot className="w-7 h-7 text-[#7C5CFC]" />
              ) : (
                <Moon className="w-7 h-7 text-[#8B90A0]" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                Режим Busy {status.busy ? 'активен' : ''}
              </h3>
              <p className="text-[#8B90A0] text-sm">
                {status.busy
                  ? 'AI отвечает на входящие сообщения автоматически'
                  : 'AI не отвечает на сообщения'
                }
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onToggleBusy(!status.busy)}
            disabled={!status.connected}
            className={`px-6 py-3 rounded-xl font-medium text-sm transition-all ${
              !status.connected
                ? 'bg-[#2A2F45] text-[#8B90A0] cursor-not-allowed'
                : status.busy
                  ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                  : 'bg-[#7C5CFC]/20 text-[#7C5CFC] hover:bg-[#7C5CFC]/30'
            }`}
          >
            {status.busy ? 'Выключить' : 'Включить'}
          </motion.button>
        </div>

        {status.busy && (
          <div className="mt-4 p-3 bg-[#141722] rounded-xl">
            <p className="text-xs text-[#8B90A0]">
              <span className="text-[#7C5CFC]">⚡ Логика:</span> Контекст 10 сообщений → Qwen решает: ответить или SKIP • Кулдаун 60 сек на собеседника
            </p>
          </div>
        )}
      </motion.div>

      {/* Backend Architecture Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6 mb-4"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Server className="w-4 h-4 text-[#2AABEE]" />
          Архитектура
        </h3>
        <div className="bg-[#141722] rounded-xl p-4 font-mono text-xs text-[#8B90A0] space-y-1">
          <p className="text-[#4CD964]"># Backend: FastAPI + Telethon + qwen-code-sdk</p>
          <p className="text-[#2AABEE]">telegram_client (MTProto)</p>
          <p>├── Telethon — подключение к Telegram</p>
          <p>├── NewMessage handler — ловит входящие</p>
          <p>├── iter_messages — контекст 10 сообщений</p>
          <p>└── send_message — отправка ответа</p>
          <p className="mt-2 text-[#7C5CFC]">qwen_agent (qwen-code-sdk)</p>
          <p>├── auth_type: "qwen-oauth"</p>
          <p>├── permission_mode: "plan"</p>
          <p>├── cwd: sandbox (пустая папка)</p>
          <p>└── Анализ → ответ или SKIP</p>
          <p className="mt-2 text-[#FF9500]">api_server (FastAPI)</p>
          <p>├── GET /api/status</p>
          <p>├── POST /api/busy, /api/free</p>
          <p>├── GET /api/chats, /api/chats/&#123;id&#125;/messages</p>
          <p>└── WebSocket /ws — real-time события</p>
        </div>
      </motion.div>

      {/* Recent Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6"
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-[#7C5CFC]" />
          Последние события
        </h3>
        <div className="space-y-2">
          {recentEvents.map((event, i) => (
            <div key={i} className="flex items-center gap-2 text-xs p-2 rounded-lg bg-[#141722]">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${
                event.type === 'ai_replied' ? 'bg-[#4CD964]' :
                event.type === 'ai_skip' ? 'bg-[#7C5CFC]' :
                event.type === 'incoming_message' ? 'bg-[#2AABEE]' :
                'bg-[#8B90A0]'
              }`} />
              <span className="text-white truncate flex-1">
                {event.type === 'incoming_message' && `📩 ${event.chat_name}`}
                {event.type === 'ai_replied' && `✅ ${event.chat_name}`}
                {event.type === 'ai_skip' && `⏭️ ${event.chat_name}`}
                {event.type === 'busy_changed' && `🔄 Busy → ${event.busy ? 'ON' : 'OFF'}`}
                {!['incoming_message', 'ai_replied', 'ai_skip', 'busy_changed'].includes(event.type) && event.type}
              </span>
              {event.timestamp && (
                <span className="text-[#8B90A0] flex-shrink-0">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              )}
            </div>
          ))}
          {recentEvents.length === 0 && (
            <p className="text-[#8B90A0] text-sm text-center py-4">Событий пока нет</p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
