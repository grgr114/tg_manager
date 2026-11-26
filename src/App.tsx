import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatView from './components/ChatView';
import AIAgent from './components/AIAgent';
import Analytics from './components/Analytics';
import ConnectionPanel from './components/ConnectionPanel';
import FilterList from './components/FilterList';
import CalendarView from './components/CalendarView';

const API_BASE = 'http://127.0.0.1:8000';

export type View = 'chats' | 'analytics' | 'agent' | 'settings' | 'filters' | 'calendar';

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

export interface StatusResponse {
  connected: boolean;
  user: string;
  busy: boolean;
}

export interface WSEvent {
  type: string;
  [key: string]: any;
}

export interface Filter {
  id: string;
  name: string;
  avatar: string;
  type: 'private' | 'group' | 'channel';
  auto_reply: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  source: string;
  created_at: string;
}

export default function App() {
  const [currentView, setCurrentView] = useState<View>('chats');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [status, setStatus] = useState<StatusResponse>({ connected: false, user: '', busy: false });
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [wsEvents, setWsEvents] = useState<WSEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filter[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  // Fetch status from backend
  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/status`);
      if (res.ok) {
        const data = await res.json();
        setStatus(data);
      }
    } catch (e) {
      console.error('Failed to fetch status:', e);
      setStatus({ connected: false, user: '', busy: false });
    }
  }, []);

  // Fetch chats from backend
  const fetchChats = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/chats`);
      if (res.ok) {
        const data = await res.json();
        setChats(data);
      }
    } catch (e) {
      console.error('Failed to fetch chats:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for a chat
  const fetchMessages = useCallback(async (chatId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/chats/${chatId}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(prev => ({ ...prev, [chatId]: data }));
      }
    } catch (e) {
      console.error('Failed to fetch messages:', e);
    }
  }, []);

  // Fetch filters
  const fetchFilters = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/filters`);
      if (res.ok) {
        const data = await res.json();
        setFilters(data);
      }
    } catch (e) {
      console.error('Failed to fetch filters:', e);
    }
  }, []);

  // Fetch calendar events
  const fetchCalendar = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/calendar`);
      if (res.ok) {
        const data = await res.json();
        setCalendarEvents(data);
      }
    } catch (e) {
      console.error('Failed to fetch calendar:', e);
    }
  }, []);

  // Toggle filter
  const toggleFilter = async (chatId: string, enabled: boolean) => {
    try {
      await fetch(`${API_BASE}/api/filters/${chatId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      setFilters(prev => prev.map(f => f.id === chatId ? { ...f, auto_reply: enabled } : f));
    } catch (e) {
      console.error('Failed to toggle filter:', e);
    }
  };

  // Delete calendar event
  const deleteCalendarEvent = async (eventId: string) => {
    try {
      await fetch(`${API_BASE}/api/calendar/${eventId}`, { method: 'DELETE' });
      setCalendarEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (e) {
      console.error('Failed to delete calendar event:', e);
    }
  };

  // WebSocket connection
  useEffect(() => {
    let ws: WebSocket | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout>;

    const connect = () => {
      try {
        ws = new WebSocket('ws://127.0.0.1:8000/ws');

        ws.onopen = () => {
          console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data) as WSEvent;
            setWsEvents(prev => [...prev.slice(-99), data]);

            // Handle events
            if (data.type === 'init') {
              setStatus({
                connected: data.connected,
                user: data.user,
                busy: data.busy,
              });
            } else if (data.type === 'busy_changed') {
              setStatus(prev => ({ ...prev, busy: data.busy }));
            } else if (data.type === 'incoming_message' || data.type === 'ai_replied') {
              // Refresh chats list
              fetchChats();
            } else if (data.type === 'filter_changed') {
              setFilters(prev => prev.map(f => f.id === data.chat_id ? { ...f, auto_reply: data.enabled } : f));
            } else if (data.type === 'calendar_events_added') {
              fetchCalendar();
            } else if (data.type === 'calendar_event_created') {
              setCalendarEvents(prev => [...prev, data.event]);
            } else if (data.type === 'calendar_event_deleted') {
              setCalendarEvents(prev => prev.filter(e => e.id !== data.event_id));
            }
          } catch (e) {
            console.error('WS message parse error:', e);
          }
        };

        ws.onclose = () => {
          console.log('WebSocket disconnected, reconnecting in 3s...');
          reconnectTimer = setTimeout(connect, 3000);
        };

        ws.onerror = () => {
          ws?.close();
        };
      } catch (e) {
        reconnectTimer = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      clearTimeout(reconnectTimer);
      ws?.close();
    };
  }, [fetchChats]);

  // Initial data fetch
  useEffect(() => {
    fetchStatus();
    fetchChats();
    fetchFilters();
    fetchCalendar();
  }, [fetchStatus, fetchChats, fetchFilters, fetchCalendar]);

  // Fetch messages when chat is selected
  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat);
    }
  }, [selectedChat, fetchMessages]);

  // Toggle busy mode
  const toggleBusy = async (enabled: boolean) => {
    try {
      await fetch(`${API_BASE}/api/busy`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      setStatus(prev => ({ ...prev, busy: enabled }));
    } catch (e) {
      console.error('Failed to toggle busy:', e);
    }
  };

  const selectedChatData = chats.find(c => c.id === selectedChat);
  const selectedMessages = selectedChat ? (messages[selectedChat] || []) : [];
  const totalUnread = chats.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#141722]">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        isConnected={status.connected}
        totalUnread={totalUnread}
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
                loading={loading}
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
                      {!status.connected && (
                        <p className="text-sm mt-2 text-[#FF9500]">Бэкенд не подключён</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* AI Agent Panel */}
              <AnimatePresence>
                {showAIAgent && (
                  <AIAgent
                    chatName={selectedChatData?.name || ''}
                    chatId={selectedChat || ''}
                    messages={selectedMessages}
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
              <Analytics events={wsEvents} chats={chats} />
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
              <AIAgent chatName="Все чаты" chatId="" messages={[]} onClose={() => setCurrentView('chats')} standalone />
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
                status={status}
                onToggleBusy={toggleBusy}
                wsEvents={wsEvents}
              />
            </motion.div>
          )}

          {currentView === 'filters' && (
            <motion.div
              key="filters"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              <FilterList
                filters={filters}
                onToggle={toggleFilter}
                onRefresh={fetchFilters}
              />
            </motion.div>
          )}

          {currentView === 'calendar' && (
            <motion.div
              key="calendar"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-auto"
            >
              <CalendarView
                events={calendarEvents}
                onDelete={deleteCalendarEvent}
                onRefresh={fetchCalendar}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
