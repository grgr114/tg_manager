import { motion } from 'framer-motion';
import { TrendingUp, MessageSquare, Users, Clock, ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const messagesPerDay = [
  { day: 'Пн', messages: 45, responses: 38 },
  { day: 'Вт', messages: 62, responses: 55 },
  { day: 'Ср', messages: 38, responses: 35 },
  { day: 'Чт', messages: 71, responses: 60 },
  { day: 'Пт', messages: 55, responses: 48 },
  { day: 'Сб', messages: 28, responses: 22 },
  { day: 'Вс', messages: 15, responses: 12 },
];

const responseTimeData = [
  { time: '00', value: 2 },
  { time: '03', value: 1 },
  { time: '06', value: 3 },
  { time: '09', value: 12 },
  { time: '12', value: 18 },
  { time: '15', value: 22 },
  { time: '18', value: 15 },
  { time: '21', value: 8 },
];

const chatDistribution = [
  { name: 'Рабочие', value: 45, color: '#2AABEE' },
  { name: 'Личные', value: 30, color: '#7C5CFC' },
  { name: 'Группы', value: 15, color: '#4CD964' },
  { name: 'Каналы', value: 10, color: '#FF9500' },
];

const stats = [
  { label: 'Сообщений сегодня', value: '147', change: '+12%', up: true, icon: MessageSquare },
  { label: 'Активных чатов', value: '23', change: '+3', up: true, icon: Users },
  { label: 'Ср. время ответа', value: '4.2 мин', change: '-0.8 мин', up: true, icon: Clock },
  { label: 'AI использований', value: '38', change: '+15', up: true, icon: Activity },
];

const topContacts = [
  { name: 'Алексей Петров', messages: 34, avatar: '👨‍💼' },
  { name: 'Команда разработки', messages: 28, avatar: '💻' },
  { name: 'Дмитрий К.', messages: 22, avatar: '🧑‍🔬' },
  { name: 'Клиент — ООО "Вектор"', messages: 18, avatar: '🏢' },
  { name: 'Мария Сидорова', messages: 15, avatar: '👩‍🎨' },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Аналитика</h1>
        <p className="text-[#8B90A0] text-sm mt-1">Обзор вашей активности в Telegram</p>
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
                <stat.icon className="w-5 h-5 text-[#2AABEE]" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-[#4CD964]' : 'text-red-400'}`}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-[#8B90A0] mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Messages per day */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#2AABEE]" />
            Сообщения за неделю
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={messagesPerDay}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F45" />
                <XAxis dataKey="day" stroke="#8B90A0" fontSize={12} />
                <YAxis stroke="#8B90A0" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1B1F2E', border: '1px solid #2A2F45', borderRadius: '12px' }}
                  labelStyle={{ color: '#E8EAF0' }}
                />
                <Bar dataKey="messages" fill="#2AABEE" radius={[4, 4, 0, 0]} />
                <Bar dataKey="responses" fill="#7C5CFC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Response time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#7C5CFC]" />
            Активность по часам
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2A2F45" />
                <XAxis dataKey="time" stroke="#8B90A0" fontSize={12} />
                <YAxis stroke="#8B90A0" fontSize={12} />
                <Tooltip
                  contentStyle={{ background: '#1B1F2E', border: '1px solid #2A2F45', borderRadius: '12px' }}
                  labelStyle={{ color: '#E8EAF0' }}
                />
                <Line type="monotone" dataKey="value" stroke="#7C5CFC" strokeWidth={2} dot={{ fill: '#7C5CFC' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Chat Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4">Распределение чатов</h3>
          <div className="h-40 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chatDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: '#1B1F2E', border: '1px solid #2A2F45', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {chatDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-[#8B90A0]">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-[#1E2235] border border-[#2A2F45] rounded-2xl p-5 lg:col-span-2"
        >
          <h3 className="text-white font-semibold mb-4">Топ контактов</h3>
          <div className="space-y-3">
            {topContacts.map((contact, index) => (
              <div key={contact.name} className="flex items-center gap-3">
                <span className="text-[#8B90A0] text-xs w-4">{index + 1}</span>
                <div className="w-8 h-8 rounded-full bg-[#2A2F45] flex items-center justify-center text-sm">
                  {contact.avatar}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-white">{contact.name}</p>
                  <div className="w-full bg-[#141722] rounded-full h-1.5 mt-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#2AABEE] to-[#7C5CFC]"
                      style={{ width: `${(contact.messages / 34) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-[#8B90A0]">{contact.messages} сообщ.</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
