import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { MissionList, MissionDetail } from './pages/Missions';
import { Community } from './pages/Community';
import { Boastplug, WoningVrij, Investbotiq, Djobba, Spontiva } from './pages/Apps';
import { Prospects, Talents, ReferralPage } from './pages/Network';
import { Profile } from './pages/Profile';
import { Chat } from './pages/Chat';
import { CURRENT_USER, MOCK_MISSIONS, MOCK_NOTIFICATIONS, MOCK_USERS, MOCK_TEAMS } from './constants';
import { User, Mission, Notification, UserStatus, MissionStatus } from './types';
import { CheckCircle } from 'lucide-react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Level Up Toast Component
const LevelUpModal: React.FC<{ level: number, onClose: () => void }> = ({ level, onClose }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100 animate-bounce-in border border-slate-200">
            <div className="w-20 h-20 bg-yellow-400 rounded-full mx-auto flex items-center justify-center mb-6 shadow-lg shadow-yellow-200">
                <span className="text-4xl">🎉</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Level Up!</h2>
            <p className="text-slate-600 mb-6">Gefeliciteerd! Je hebt <span className="text-brand-600 font-bold">Level {level}</span> bereikt.</p>
            <button onClick={onClose} className="w-full bg-brand-600 text-white py-3 rounded-xl font-bold shadow-lg hover:bg-brand-700 transition-all">
                Geweldig!
            </button>
        </div>
    </div>
);

const AppContent: React.FC = () => {
  // State Simulation (In a real app, this would be Redux/Context/React Query)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User>(CURRENT_USER);
  const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [showLevelUp, setShowLevelUp] = useState<number | null>(null);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCompleteMission = (missionId: string) => {
    setMissions(prev => prev.map(m => m.id === missionId ? { ...m, status: MissionStatus.COMPLETED } : m));
    
    // Simulate Level Up logic: 1 Mission = +1 Level (as per requirements)
    const newLevel = user.level + 1;
    setUser(prev => ({ ...prev, level: newLevel, xp: 0 }));
    setShowLevelUp(newLevel);
    
    // Add Notification
    const newNotif: Notification = {
        id: Date.now().toString(),
        title: 'Onboarding Voltooid',
        message: 'Goed gedaan! Je hebt een nieuw level bereikt.',
        type: 'success',
        read: false,
        timestamp: Date.now()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  if (!isAuthenticated) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout} notificationsCount={notifications.filter(n => !n.read).length}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} activeMissions={missions.filter(m => m.status === MissionStatus.IN_PROGRESS || m.status === MissionStatus.AVAILABLE || (m.status === MissionStatus.COMPLETED && m.id === 'm_001'))} notifications={notifications} />} />
          <Route path="/onboarding" element={<MissionList missions={missions} />} />
          <Route path="/onboarding/:id" element={<MissionDetail missions={missions} onCompleteMission={handleCompleteMission} />} />
          <Route path="/community" element={<Community users={MOCK_USERS} teams={MOCK_TEAMS} />} />
          <Route path="/chat" element={<Chat user={user} />} />
          
          {/* Profile Route */}
          <Route path="/profile" element={<Profile user={user} />} />
          {/* Settings Redirect to Profile */}
          <Route path="/settings" element={<Navigate to="/profile" replace />} />
          
          {/* Business & Network Routes */}
          <Route path="/prospects" element={<Prospects />} />
          <Route path="/talents" element={<Talents />} />
          <Route path="/referral" element={<ReferralPage />} />
          
          {/* Apps Routes */}
          <Route path="/boastplug" element={<Boastplug />} />
          <Route path="/woningvrij" element={<WoningVrij />} />
          <Route path="/airbnb" element={<Navigate to="/woningvrij" replace />} />
          <Route path="/investbotiq" element={<Investbotiq />} />
          <Route path="/djobba" element={<Djobba />} />
          <Route path="/spontiva" element={<Spontiva />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
      
      {showLevelUp && <LevelUpModal level={showLevelUp} onClose={() => setShowLevelUp(null)} />}
    </Router>
  );
};

const App: React.FC = () => {
    return (
        <LanguageProvider>
            <ThemeProvider>
                <AppContent />
            </ThemeProvider>
        </LanguageProvider>
    );
};

export default App;