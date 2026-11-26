import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Bot, Sparkles, Send, Copy, RefreshCw, Zap, Brain, FileText, MessageSquare } from 'lucide-react';
import type { Message } from '../App';

const API_BASE = 'http://127.0.0.1:8000';

interface AIAgentProps {
  chatName: string;
  chatId: string;
  messages: Message[];
  onClose: () => void;
  standalone?: boolean;
}

interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const quickActions = [
  { icon: Brain, label: 'Анализ тона', prompt: 'Определи настроение последней переписки' },
  { icon: FileText, label: 'Саммари', prompt: 'Сделай краткое содержание переписки' },
  { icon: Zap, label: 'Предложить ответ', prompt: 'Предложи ответ на последнее сообщение' },
  { icon: MessageSquare, label: 'Перевести', prompt: 'Переведи последнее сообщение на английский' },
];

export default function AIAgent({ chatName, chatId, messages, onClose, standalone }: AIAgentProps) {
  const [aiMessages, setAiMessages] = useState<AIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const formatConversation = () => {
    if (messages.length === 0) return 'Переписка пуста';
    return messages
      .slice(-15)
      .map(m => `[${m.time}] ${m.sender === 'me' ? 'Я' : chatName}: ${m.text}`)
      .join('\n');
  };

  const handleSend = async (customPrompt?: string) => {
    const text = customPrompt || input;
    if (!text.trim()) return;

    const userMsg: AIMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text
    };

    setAiMessages(prev => [...prev, userMsg]);
    if (!customPrompt) setInput('');
    setIsTyping(true);

    // Build prompt with conversation context
    const conversation = formatConversation();
    const fullPrompt = `Контекст переписки с "${chatName}":\n${conversation}\n\nЗапрос пользователя: ${text}\n\nОтветь на русском языке:`;

    try {
      const res = await fetch(`${API_BASE}/api/ai/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: fullPrompt }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: AIMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response || 'Нет ответа от AI',
        };
        setAiMessages(prev => [...prev, aiMsg]);
      } else {
        throw new Error('API error');
      }
    } catch (e) {
      const errorMsg: AIMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '⚠️ Ошибка подключения к бэкенду. Убедитесь что бэкенд запущен на http://127.0.0.1:8000',
      };
      setAiMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerClass = standalone
    ? 'max-w-4xl mx-auto p-6 h-full flex flex-col'
    : 'w-96 border-l border-[#2A2F45] bg-[#1B1F2E] flex flex-col';

  return (
    <motion.div
      initial={{ x: standalone ? 0 : 300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: standalone ? 0 : 300, opacity: 0 }}
      className={containerClass}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C5CFC] to-[#2AABEE] flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Qwen AI Ассистент</h3>
            <p className="text-[#8B90A0] text-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#7C5CFC]" />
              {chatName}
            </p>
          </div>
        </div>
        {!standalone && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#8B90A0] hover:bg-[#2A2F45] hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mb-4 flex-shrink-0">
        {quickActions.map((action, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleSend(action.prompt)}
            className="p-3 rounded-xl bg-[#141722] border border-[#2A2F45] hover:border-[#7C5CFC]/50 transition-all text-left group"
          >
            <action.icon className="w-4 h-4 text-[#7C5CFC] mb-1.5 group-hover:text-[#2AABEE] transition-colors" />
            <p className="text-white text-xs font-medium">{action.label}</p>
            <p className="text-[#8B90A0] text-[10px] mt-0.5">{action.prompt.slice(0, 30)}...</p>
          </motion.button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {aiMessages.length === 0 && (
          <div className="text-center text-[#8B90A0] text-sm py-8">
            <Bot className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>Задайте вопрос AI или используйте быстрые действия</p>
          </div>
        )}
        {aiMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[90%] px-4 py-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-gradient-to-r from-[#7C5CFC] to-[#5B3FD9] text-white rounded-br-md'
                  : 'bg-[#141722] border border-[#2A2F45] text-[#E8EAF0] rounded-bl-md'
              }`}
            >
              <div className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</div>
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#2A2F45]/50">
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="text-[#8B90A0] hover:text-white transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button className="text-[#8B90A0] hover:text-white transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-[#141722] border border-[#2A2F45] px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 bg-[#7C5CFC] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#7C5CFC] rounded-full typing-dot" />
                <div className="w-2 h-2 bg-[#7C5CFC] rounded-full typing-dot" />
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="flex-shrink-0">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Спросите AI..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-[#141722] border border-[#2A2F45] rounded-xl px-4 py-2.5 text-sm text-white placeholder-[#8B90A0] focus:outline-none focus:border-[#7C5CFC] transition-colors"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleSend()}
            className="p-2.5 rounded-xl bg-gradient-to-r from-[#7C5CFC] to-[#2AABEE] text-white"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
        <p className="text-[10px] text-[#8B90A0] mt-2 text-center">
          Powered by Qwen AI • Контекст: {messages.length} сообщений
        </p>
      </div>
    </motion.div>
  );
}
