import { useState } from 'react';
import { motion } from 'framer-motion';
import { Key, Shield, Smartphone, Check, AlertCircle, Copy, Eye, EyeOff, RefreshCw, Server } from 'lucide-react';

interface ConnectionPanelProps {
  isConnected: boolean;
  onToggleConnection: () => void;
}

export default function ConnectionPanel({ isConnected, onToggleConnection }: ConnectionPanelProps) {
  const [apiId, setApiId] = useState('');
  const [apiHash, setApiHash] = useState('');
  const [phone, setPhone] = useState('');
  const [showHash, setShowHash] = useState(false);
  const [qwenApiKey, setQwenApiKey] = useState('');
  const [showQwenKey, setShowQwenKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Настройки подключения</h1>
        <p className="text-[#8B90A0] text-sm mt-1">Настройте подключение к Telegram и Qwen AI</p>
      </div>

      {/* Connection Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl p-6 mb-6 border ${
          isConnected
            ? 'bg-gradient-to-r from-[#1a2e1a] to-[#1a2e2e] border-[#4CD964]/30'
            : 'bg-gradient-to-r from-[#2e1a1a] to-[#2e2e1a] border-red-500/30'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isConnected ? 'bg-[#4CD964]/20' : 'bg-red-500/20'
            }`}>
              {isConnected ? (
                <Check className="w-7 h-7 text-[#4CD964]" />
              ) : (
                <AlertCircle className="w-7 h-7 text-red-400" />
              )}
            </div>
            <div>
              <h3 className="text-white font-semibold text-lg">
                {isConnected ? 'Подключено к Telegram' : 'Не подключено'}
              </h3>
              <p className="text-[#8B90A0] text-sm">
                {isConnected ? 'Аккаунт активен, сессия MTProto работает' : 'Необходимо настроить подключение'}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggleConnection}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
              isConnected
                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                : 'bg-[#4CD964]/20 text-[#4CD964] hover:bg-[#4CD964]/30'
            }`}
          >
            {isConnected ? 'Отключить' : 'Подключить'}
          </motion.button>
        </div>
      </motion.div>

      {/* Telegram API Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6 mb-4"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#2AABEE]/20 flex items-center justify-center">
            <Smartphone className="w-5 h-5 text-[#2AABEE]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Telegram API (MTProto)</h3>
            <p className="text-[#8B90A0] text-xs">Получите на my.telegram.org</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#8B90A0] mb-1.5 block">API ID</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
              <input
                type="text"
                value={apiId}
                onChange={(e) => setApiId(e.target.value)}
                placeholder="12345678"
                className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8B90A0]/50 focus:outline-none focus:border-[#2AABEE] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8B90A0] mb-1.5 block">API Hash</label>
            <div className="relative">
              <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
              <input
                type={showHash ? 'text' : 'password'}
                value={apiHash}
                onChange={(e) => setApiHash(e.target.value)}
                placeholder="0123456789abcdef0123456789abcdef"
                className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl pl-10 pr-12 py-2.5 text-sm text-white placeholder-[#8B90A0]/50 focus:outline-none focus:border-[#2AABEE] transition-colors"
              />
              <button
                onClick={() => setShowHash(!showHash)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B90A0] hover:text-white transition-colors"
              >
                {showHash ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8B90A0] mb-1.5 block">Номер телефона</label>
            <div className="relative">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+7 999 123 45 67"
                className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-[#8B90A0]/50 focus:outline-none focus:border-[#2AABEE] transition-colors"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Qwen AI Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6 mb-4"
      >
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-[#7C5CFC]/20 flex items-center justify-center">
            <Server className="w-5 h-5 text-[#7C5CFC]" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Qwen AI API</h3>
            <p className="text-[#8B90A0] text-xs">Ключ для доступа к модели Qwen</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-[#8B90A0] mb-1.5 block">API Key</label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8B90A0]" />
              <input
                type={showQwenKey ? 'text' : 'password'}
                value={qwenApiKey}
                onChange={(e) => setQwenApiKey(e.target.value)}
                placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl pl-10 pr-12 py-2.5 text-sm text-white placeholder-[#8B90A0]/50 focus:outline-none focus:border-[#7C5CFC] transition-colors"
              />
              <button
                onClick={() => setShowQwenKey(!showQwenKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8B90A0] hover:text-white transition-colors"
              >
                {showQwenKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="text-sm text-[#8B90A0] mb-1.5 block">Модель</label>
            <select className="w-full bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#7C5CFC] transition-colors">
              <option>Qwen-Max</option>
              <option>Qwen-Plus</option>
              <option>Qwen-Turbo</option>
              <option>Qwen-Long</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Backend Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-6 mb-4"
      >
        <h3 className="text-white font-semibold mb-3">🔧 Архитектура бэкенда</h3>
        <div className="bg-[#141722] rounded-xl p-4 font-mono text-xs text-[#8B90A0] space-y-1">
          <p className="text-[#4CD964]"># Backend Stack для TeleQwen AI</p>
          <p className="text-[#2AABEE]">telegram_client</p>
          <p>├── Telethon / Pyrogram (MTProto)</p>
          <p>├── Обработка событий (NewMessage)</p>
          <p>├── Чтение истории сообщений</p>
          <p>└── Отправка сообщений</p>
          <p className="mt-2 text-[#7C5CFC]">qwen_agent</p>
          <p>├── OpenAI-compatible API</p>
          <p>├── Контекст переписки</p>
          <p>├── Анализ тона и саммари</p>
          <p>└── Генерация ответов</p>
          <p className="mt-2 text-[#FF9500]">api_server</p>
          <p>├── FastAPI / Flask</p>
          <p>├── WebSocket для real-time</p>
          <p>└── REST API для фронтенда</p>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#2AABEE] to-[#7C5CFC] text-white font-medium text-sm shadow-lg shadow-[#2AABEE]/20 flex items-center justify-center gap-2"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4" />
            Сохранено!
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            Сохранить настройки
          </>
        )}
      </motion.button>
    </div>
  );
}
