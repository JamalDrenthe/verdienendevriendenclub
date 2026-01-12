import React from 'react';
import { User, Mission, Notification, MissionStatus } from '../types';
import { Card, Button, ProgressBar, Badge } from '../components/ui';
import { TrendingUp, Zap, Users, CheckCircle, ChevronRight, AlertCircle, Clock, Target, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { EarningsCalculator } from '../components/EarningsCalculator';

interface DashboardProps {
  user: User;
  activeMissions: Mission[];
  notifications: Notification[];
}

export const Dashboard: React.FC<DashboardProps> = ({ user, activeMissions, notifications }) => {
  const { t } = useLanguage();
  const upcomingMission = activeMissions.find(m => m.isPrio && m.status === MissionStatus.AVAILABLE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Card */}
        <Card className="p-6 md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
                <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{t('dash.welcome')}, {user.firstName}!</h2>
                <p className="text-slate-500 mb-6">{t('dash.teamPerf')}</p>
                
                <div className="flex items-end justify-between mb-2">
                    <span className="text-3xl font-extrabold text-brand-600">Level {user.level}</span>
                    <span className="text-sm font-medium text-slate-500">{user.xp} / 100 XP</span>
                </div>
                <ProgressBar progress={user.xp} colorClass="bg-gradient-to-r from-brand-500 to-brand-400" />
                <div className="mt-4 flex gap-3">
                    <Link to="/onboarding">
                        <Button size="sm">{t('dash.toOnboarding')}</Button>
                    </Link>
                    <Button variant="outline" size="sm">{t('dash.profile')}</Button>
                </div>
            </div>
        </Card>

        {/* Prio Action Card */}
        <Card className="p-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
            <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-white/10 rounded-lg">
                    <Zap className="text-yellow-400" size={24} />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Prio</span>
            </div>
            {upcomingMission ? (
                <>
                    <h3 className="text-lg font-bold mb-2 line-clamp-2">{upcomingMission.title}</h3>
                    <p className="text-slate-300 text-sm mb-6 line-clamp-2">{upcomingMission.description}</p>
                    <Link to={`/onboarding/${upcomingMission.id}`}>
                        <Button variant="secondary" className="w-full">{t('dash.start')}</Button>
                    </Link>
                </>
            ) : (
                <div className="flex flex-col items-center justify-center h-40">
                    <CheckCircle className="text-green-400 mb-2" size={32} />
                    <p className="text-center text-sm text-slate-300">{t('dash.allUpdated')}</p>
                </div>
            )}
        </Card>
      </div>

      {/* Earnings Calculator Section */}
      <EarningsCalculator />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Feed & Active Missions */}
        <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">{t('dash.activeOnboarding')}</h3>
                <Link to="/onboarding" className="text-sm text-brand-600 font-medium hover:text-brand-700">{t('dash.viewAll')}</Link>
            </div>
            
            <div className="space-y-4">
                {activeMissions.slice(0, 3).map(mission => (
                    <Card key={mission.id} className="p-4 flex items-center justify-between hover:border-brand-200 transition-colors group">
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${mission.isPrio ? 'bg-yellow-100 text-yellow-600' : 'bg-blue-100 text-blue-600'}`}>
                                {mission.isPrio ? <Zap size={20} /> : <Target size={20} />}
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-800 group-hover:text-brand-600 transition-colors">{mission.title}</h4>
                                <div className="flex items-center text-xs text-slate-500 space-x-2">
                                    <span>{mission.category}</span>
                                    <span>•</span>
                                    <span>{mission.steps.filter(s => s.completed).length}/{mission.steps.length} {t('dash.steps')}</span>
                                </div>
                            </div>
                        </div>
                        <Link to={`/onboarding/${mission.id}`}>
                            <Button variant="ghost" size="sm"><ChevronRight size={20} /></Button>
                        </Link>
                    </Card>
                ))}
                {activeMissions.length === 0 && (
                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-slate-300">
                        <p className="text-slate-500">{t('dash.noActive')}</p>
                    </div>
                )}
            </div>

            <h3 className="text-lg font-bold text-slate-800 mt-8">{t('dash.news')}</h3>
            <Card className="p-0 overflow-hidden">
                {[1, 2].map((i) => (
                    <div key={i} className="p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                        <div className="flex space-x-3">
                            <img src={`https://picsum.photos/40/40?random=${i}`} className="w-10 h-10 rounded-full" alt="User" />
                            <div>
                                <p className="text-sm text-slate-800"><span className="font-bold">Team Alpha</span> heeft een nieuwe mijlpaal bereikt.</p>
                                <p className="text-xs text-slate-500 mt-1">2 uur geleden</p>
                            </div>
                        </div>
                    </div>
                ))}
            </Card>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
            {/* Notifications Widget */}
            <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <AlertCircle size={18} /> {t('dash.notifications')}
                    </h3>
                    <Badge variant="info">{notifications.filter(n => !n.read).length} {t('dash.new')}</Badge>
                </div>
                <div className="space-y-3">
                    {notifications.slice(0, 4).map(notif => (
                        <div key={notif.id} className={`text-sm p-2 rounded ${notif.read ? 'opacity-60' : 'bg-brand-50'}`}>
                            <p className="font-medium text-slate-800">{notif.title}</p>
                            <p className="text-slate-500 text-xs">{notif.message}</p>
                        </div>
                    ))}
                </div>
            </Card>

            {/* Team Widget */}
            <Card className="p-5">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                        <Users size={18} /> {t('dash.myTeam')}
                    </h3>
                </div>
                <div className="space-y-3">
                    {/* Mock Team Members */}
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <div className="relative">
                                    <img src={`https://picsum.photos/32/32?random=${i+10}`} className="w-8 h-8 rounded-full" alt="Team member" />
                                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Lid {i}</p>
                                    <p className="text-[10px] text-slate-500">Lvl {10+i}</p>
                                </div>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MessageSquare size={14} /></Button>
                        </div>
                    ))}
                </div>
                <Button variant="outline" size="sm" className="w-full mt-4">{t('dash.teamOverview')}</Button>
            </Card>
        </div>
      </div>
    </div>
  );
};