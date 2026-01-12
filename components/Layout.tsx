import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { User } from '../types';
import { useTheme, Theme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  LayoutDashboard, 
  Target, 
  Users, 
  MessageSquare, 
  User as UserIcon,
  LogOut, 
  Menu, 
  X,
  Bell,
  Laptop,
  Home,
  TrendingUp,
  Briefcase,
  UserPlus,
  Gift,
  Search,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  PanelLeftClose,
  PanelLeftOpen,
  Sun,
  Monitor,
  Heart,
  Zap,
  Globe
} from 'lucide-react';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
  notificationsCount: number;
}

export const Layout: React.FC<LayoutProps> = ({ user, children, onLogout, notificationsCount }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Persistent Sidebar State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('vvc-sidebar-collapsed');
        return saved === 'true';
    }
    return false;
  });

  useEffect(() => {
      localStorage.setItem('vvc-sidebar-collapsed', isSidebarCollapsed.toString());
  }, [isSidebarCollapsed]);

  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  
  // Scroll handling
  const mainRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (mainRef.current) {
        mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);
  
  const navGroups = [
    {
      title: t('nav.platform'),
      items: [
        { icon: <LayoutDashboard size={20} />, label: t('nav.dashboard'), path: '/' },
        { icon: <Target size={20} />, label: t('nav.onboarding'), path: '/onboarding' },
        { icon: <Users size={20} />, label: t('nav.community'), path: '/community' },
        { icon: <MessageSquare size={20} />, label: t('nav.chat'), path: '/chat' },
      ]
    },
    {
      title: t('nav.network'),
      items: [
        { icon: <Briefcase size={20} />, label: t('nav.prospects'), path: '/prospects' },
        { icon: <UserPlus size={20} />, label: t('nav.talents'), path: '/talents' },
        { icon: <Gift size={20} />, label: t('nav.referral'), path: '/referral' },
      ]
    },
    {
      title: t('nav.apps'),
      items: [
        { icon: <Laptop size={20} />, label: t('nav.boastplug'), path: '/boastplug' },
        { icon: <Home size={20} />, label: t('nav.woningvrij'), path: '/woningvrij' },
        { icon: <TrendingUp size={20} />, label: 'Investbotiq', path: '/investbotiq' },
        { icon: <Search size={20} />, label: 'DJOBBA', path: '/djobba' },
        { icon: <Zap size={20} />, label: 'Spontiva', path: '/spontiva' },
      ]
    }
  ];

  const toggleGroup = (title: string) => {
    setCollapsedGroups(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const NavContent = () => (
    <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300">
      {/* Brand */}
      <div className={`p-4 flex items-center justify-between bg-white border-b border-slate-100 h-20 transition-all`}>
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
             <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold shadow-sm shrink-0">V</div>
             {!isSidebarCollapsed && <span className="font-bold text-sm text-slate-800 tracking-tight whitespace-nowrap overflow-hidden" title="Verdienende Vrienden Club">Verdienende Vrienden Club</span>}
        </div>
        {/* Header Toggle (Desktop only, visible when expanded) */}
        {!isSidebarCollapsed && (
            <button 
                onClick={() => setIsSidebarCollapsed(true)}
                className="hidden md:flex text-slate-400 hover:text-slate-600 p-1.5 rounded-md hover:bg-slate-50 transition-colors"
                title="Menu inklappen"
            >
                <PanelLeftClose size={18} />
            </button>
        )}
      </div>

      {/* User Profile Snippet */}
      <div className="p-4 bg-white border-b border-slate-100">
         <NavLink to="/profile" className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'space-x-3'} p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer`}>
             <img src={user.avatarUrl} alt="Profile" className="w-9 h-9 rounded-full border border-slate-200 shrink-0" />
             {!isSidebarCollapsed && (
             <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-800 truncate">{user.firstName} {user.lastName}</p>
                <div className="flex items-center space-x-1.5">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">Lvl {user.level}</span>
                </div>
             </div>
             )}
         </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-6 scrollbar-hide">
        {navGroups.map((group, idx) => (
          <div key={idx} className="mb-2">
            {!isSidebarCollapsed && group.title ? (
              <button 
                onClick={() => toggleGroup(group.title)}
                className="w-full px-3 mb-2 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition-colors focus:outline-none"
              >
                <span>{group.title}</span>
                {collapsedGroups[group.title] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
              </button>
            ) : isSidebarCollapsed && group.title ? (
                 <div className="w-full h-px bg-slate-200 my-4 mx-auto w-1/2"></div>
            ) : null}
            
            <div className={`space-y-0.5 overflow-hidden transition-all duration-300 ${!isSidebarCollapsed && collapsedGroups[group.title || ''] ? 'max-h-0 opacity-0' : 'max-h-[500px] opacity-100'}`}>
              {group.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  title={isSidebarCollapsed ? item.label : ''}
                  className={({ isActive }) => 
                    `flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm' 
                        : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={`shrink-0 ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                        {item.icon}
                      </span>
                      {!isSidebarCollapsed && <span className="whitespace-nowrap overflow-hidden">{item.label}</span>}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}

        <div className="mt-6 pt-6 border-t border-slate-200">
            <NavLink
              to="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className={({ isActive }) => 
                `flex items-center ${isSidebarCollapsed ? 'justify-center px-0' : 'space-x-3 px-3'} py-2 rounded-lg transition-colors ${
                  isActive ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-600 hover:bg-white hover:text-slate-900'
                }`
              }
            >
              <UserIcon size={20} className="text-slate-400 shrink-0" />
              {!isSidebarCollapsed && <span>{t('nav.profile')}</span>}
            </NavLink>
        </div>
      </nav>

      {/* Footer / Themes / Logout */}
      <div className="p-4 bg-white border-t border-slate-200 space-y-3">
         {/* Language Toggle */}
         {!isSidebarCollapsed && (
             <div className="flex bg-slate-100 p-1 rounded-lg">
                 <button 
                     onClick={() => setLanguage('nl')} 
                     className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${language === 'nl' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     NL
                 </button>
                 <button 
                     onClick={() => setLanguage('en')} 
                     className={`flex-1 text-xs font-bold py-1.5 rounded-md transition-all ${language === 'en' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                 >
                     EN
                 </button>
             </div>
         )}
         {isSidebarCollapsed && (
            <button 
                onClick={() => setLanguage(language === 'nl' ? 'en' : 'nl')}
                className="w-full flex justify-center py-2 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase"
            >
                {language}
            </button>
         )}

         {/* Theme Toggles */}
         {!isSidebarCollapsed ? (
             <div className="flex justify-between items-center bg-slate-100 rounded-lg p-1">
                 <button 
                    onClick={() => setTheme('default')}
                    className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'default' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Default Theme"
                 >
                     <Sun size={14} />
                 </button>
                 <button 
                    onClick={() => setTheme('matrix')}
                    className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'matrix' ? 'bg-black text-green-400 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Matrix Theme"
                 >
                     <Monitor size={14} />
                 </button>
                 <button 
                    onClick={() => setTheme('rose')}
                    className={`flex-1 flex items-center justify-center p-1.5 rounded-md transition-all ${theme === 'rose' ? 'bg-rose-100 text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Rose Gold Theme"
                 >
                     <Heart size={14} />
                 </button>
             </div>
         ) : (
            <div className="flex flex-col gap-2 items-center">
                 <button 
                    onClick={() => setTheme(theme === 'default' ? 'matrix' : theme === 'matrix' ? 'rose' : 'default')}
                    className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200"
                    title="Cycle Theme"
                 >
                    {theme === 'default' ? <Sun size={14}/> : theme === 'matrix' ? <Monitor size={14}/> : <Heart size={14}/>}
                 </button>
            </div>
         )}

        <button 
          onClick={onLogout}
          className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-center space-x-2'} px-3 py-2 w-full text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium`}
          title={t('nav.logout')}
        >
          <LogOut size={18} />
          {!isSidebarCollapsed && <span>{t('nav.logout')}</span>}
        </button>
        
        {/* Bottom Toggle (Only visible if collapsed, or as redundancy) */}
        {isSidebarCollapsed && (
            <button 
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden md:flex items-center justify-center w-full py-2 text-slate-400 hover:text-slate-600 transition-colors"
                title="Menu uitklappen"
            >
                <PanelLeftOpen size={20} />
            </button>
        )}
      </div>
    </div>
  );

  return (
    <div className={`flex h-screen bg-slate-50 transition-colors duration-500 overflow-hidden ${theme === 'matrix' ? 'theme-matrix' : theme === 'rose' ? 'theme-rose' : ''}`}>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Sidebar (Desktop) */}
      <aside className={`hidden md:flex flex-col border-r border-slate-200 bg-slate-50 transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-64'}`}>
        <NavContent />
      </aside>

      {/* Sidebar (Mobile) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-50 transform transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <NavContent />
        <button 
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-4 right-[-40px] bg-white p-2 rounded-lg shadow-lg text-slate-600"
        >
          <X size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-4 md:hidden shrink-0">
          <div className="flex items-center">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-slate-600 mr-4">
              <Menu size={24} />
            </button>
            <span className="font-bold text-base text-slate-800 truncate">Verdienende Vrienden Club</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="relative">
                <Bell size={20} className="text-slate-600" />
                {notificationsCount > 0 && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>}
             </div>
             <img src={user.avatarUrl} className="w-8 h-8 rounded-full border border-slate-200" alt="Profile" />
          </div>
        </header>
        
        {/* Scrollable Main Area */}
        <main ref={mainRef} className="flex-1 overflow-y-auto bg-slate-50 p-4 md:p-8 scroll-smooth">
          <div className="max-w-7xl mx-auto min-h-full pb-20">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
