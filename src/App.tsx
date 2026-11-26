import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import AIAgent from './components/AIAgent';
import Analytics from './components/Analytics';
import ConnectionPanel from './components/ConnectionPanel';

export type View = 'chats' | 'analytics' | 'agent' | 'settings';

export interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  type: 'private' | 'group' | 'channel';
}

export interface Message {
  id: string;
  text: string;
  sender: 'me' | 'them' | 'ai';
  time: string;
  status?: 'sent' | 'delivered' | 'read';
}

const mockChats: Chat[] = [
  { id: '1', name: 'Алексей Петров', avatar: '👨‍💼', lastMessage: 'Ок, договорились по проекту', time: '14:32', unread: 0, online: true, type: 'private' },
  { id: '2', name: 'Команда разработки', avatar: '💻', lastMessage: 'Марина: Деплой прошёл успешно', time: '13:15', unread: 5, online: false, type: 'group' },
  { id: '3', name: 'Дмитрий К.', avatar: '🧑‍🔬', lastMessage: 'Скинь пожалуйста документы', time: '12:48', unread: 2, online: true, type: 'private' },
  { id: '4', name: 'Клиент — ООО "Вектор"', avatar: '🏢', lastMessage: 'Ждём коммерческое предложение', time: '11:20', unread: 1, online: false, type: 'private' },
  { id: '5', name: 'Мария Сидорова', avatar: '👩‍🎨', lastMessage: 'Дизайн готов, смотри вложение', time: '10:05', unread: 0, online: false, type: 'private' },
  { id: '6', name: 'Crypto Signals', avatar: '📈', lastMessage: 'BTC пробил 100k!', time: '09:30', unread: 12, online: false, type: 'channel' },
  { id: '7', name: 'Иван Козлов', avatar: '🎮', lastMessage: 'Го вечером?', time: 'Вчера', unread: 0, online: true, type: 'private' },
  { id: '8', name: 'HR Отдел', avatar: '👥', lastMessage: 'Напоминание: собрание в 15:00', time: 'Вчера', unread: 0, online: false, type: 'group' },
];

const mockMessages: Record<string, Message[]> = {
  '1': [
    { id: 'm1', text: 'Привет! Как дела с проектом?', sender: 'them', time: '14:00' },
    { id: 'm2', text: 'Привет! Всё идёт по плану, заканчиваю фронтенд', sender: 'me', time: '14:05', status: 'read' },
    { id: 'm3', text: 'Отлично! Когда сможешь показать демо?', sender: 'them', time: '14:10' },
    { id: 'm4', text: 'Думаю завтра к обеду будет готово', sender: 'me', time: '14:15', status: 'read' },
    { id: 'm5', text: 'Ок, договорились по проекту', sender: 'them', time: '14:32' },
  ],
  '2': [
    { id: 'm6', text: 'Ребят, кто может посмотреть PR #142?', sender: 'them', time: '12:30' },
    { id: 'm7', text: 'Я гляну через час', sender: 'me', time: '12:45', status: 'read' },
    { id: 'm8', text: 'Деплой прошёл успешно', sender: 'them', time: '13:15' },
  ],
  '3': [
    { id: 'm9', text: 'Привет, у меня вопрос по API', sender: 'them', time: '12:30' },
    { id: 'm10', text: 'Да, спрашивай', sender: 'me', time: '12:35', status: 'read' },
    { id: 'm11', text: 'Скинь пожалуйста документы', sender: 'them', time: '12:48' },
  ],
  '4': [
    { id: 'm12', text: 'Добрый день! Мы рассмотрели ваше предложение', sender: 'them', time: '10:00' },
    { id: 'm13', text: 'Отлично! Какие будут следующие шаги?', sender: 'me', time: '10:30', status: 'read' },
    { id: 'm14', text: 'Ждём коммерческое предложение', sender: 'them', time: '11:20' },
  ],
};

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chats');
  const [selectedChat, setSelectedChat] = useState<string | null>('1');
  const [isConnected, setIsConnected] = useState(true);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [chats] = useState<Chat[]>(mockChats);
  const [messages] = useState<Record<string, Message[]>>(mockMessages);

  const selectedChatData = chats.find(c => c.id === selectedChat);
  const selectedMessages = selectedChat ? (messages[selectedChat] || []) : [];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#141722]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={isConnected}
        totalUnread={chats.reduce((acc, c) => acc + c.unread, 0)}
      />

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <AnimatePresence mode="wait">
          {currentView === 'chats' && (
            <motion.div
              key="chats"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-1 overflow-hidden"
            >
              {/* Chat List */}
              <ChatList
                chats={chats}
                selectedChat={selectedChat}
                onSelectChat={setSelectedChat}
              />

              {/* Chat View */}
              <div className={`flex-1 flex flex-col ${showAIAgent ? 'lg:w-1/2' : 'w-full'}`}>
                {selectedChatData ? (
                  <ChatView
                    chat={selectedChatData}
                    messages={selectedMessages}
                    onToggleAI={() => setShowAIAgent(!showAIAgent)}
                    showAI={showAIAgent}
                  />
                ) : (
                  <div className="flex-1 flex items-center justify-center text-[#8B90A0]">
                    <div className="text-center">
                      <div className="text-6xl mb-4">💬</div>
                      <p className="text-lg">Выберите чат для просмотра</p>
                    </div>
                  </div>
                )}
              </div>

              {/* AI Agent Panel */}
              <AnimatePresence>
                {showAIAgent && (
                  <AIAgent
                    chatName={selectedChatData?.name || ''}
                    onClose={() => setShowAIAgent(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {currentView === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              <Analytics />
            </motion.div>
          )}

          {currentView === 'agent' && (
            <motion.div
              key="agent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              <AIAgent chatName="Все чаты" onClose={() => setCurrentView('chats')} standalone />
            </motion.div>
          )}

          {currentView === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              <ConnectionPanel
                isConnected={isConnected}
                onToggleConnection={() => setIsConnected(!isConnected)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
