import React, { useState } from 'react';
import { User, Team } from '../types';
import { Card, Input, Button, Badge } from '../components/ui';
import { Search, MapPin, Briefcase, MessageSquare, Filter } from 'lucide-react';

interface CommunityProps {
  users: User[];
  teams: Team[];
}

export const Community: React.FC<CommunityProps> = ({ users, teams }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'MEMBERS' | 'TEAMS'>('MEMBERS');

  const filteredUsers = users.filter(u => 
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.specializations.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">Community</h1>
                <p className="text-slate-500">Vind leden, teams en breid je netwerk uit.</p>
            </div>
        </div>

        {/* Search & Filter Bar */}
        <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Input 
                        placeholder="Zoek op naam, skill of level..." 
                        icon={<Search size={18} />} 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant={activeTab === 'MEMBERS' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('MEMBERS')}
                    >
                        Leden
                    </Button>
                    <Button 
                        variant={activeTab === 'TEAMS' ? 'primary' : 'outline'}
                        onClick={() => setActiveTab('TEAMS')}
                    >
                        Teams
                    </Button>
                    <Button variant="ghost" className="hidden md:flex">
                        <Filter size={18} className="mr-2" /> Filters
                    </Button>
                </div>
            </div>
        </Card>

        {/* Grid Results */}
        {activeTab === 'MEMBERS' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map(user => (
                    <Card key={user.id} className="p-6 hover:shadow-lg transition-all group">
                        <div className="flex items-start justify-between mb-4">
                            <img src={user.avatarUrl} alt={user.firstName} className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                            <Badge variant="success">Lvl {user.level}</Badge>
                        </div>
                        <h3 className="font-bold text-lg text-slate-800">{user.firstName} {user.lastName}</h3>
                        <p className="text-sm text-slate-500 mb-4 flex items-center gap-1">
                            <Briefcase size={14} /> {user.specializations[0] || 'Member'}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-6">
                            {user.specializations.slice(0, 3).map((spec, i) => (
                                <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                                    {spec}
                                </span>
                            ))}
                        </div>

                        <div className="flex gap-2 mt-auto">
                            <Button variant="outline" size="sm" className="flex-1">Profiel</Button>
                            <Button variant="secondary" size="sm"><MessageSquare size={16} /></Button>
                        </div>
                    </Card>
                ))}
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {teams.map(team => (
                    <Card key={team.id} className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-xl text-slate-800">{team.name}</h3>
                            <span className="text-2xl font-bold text-brand-600">{team.score} XP</span>
                        </div>
                        <p className="text-slate-500 mb-4">{team.members.length} leden</p>
                        <div className="flex -space-x-2 overflow-hidden mb-6">
                             {team.members.map((m, i) => (
                                <img key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" src={`https://picsum.photos/32/32?random=${i}`} alt=""/>
                             ))}
                        </div>
                        <Button className="w-full">Bekijk Team</Button>
                    </Card>
                 ))}
            </div>
        )}
    </div>
  );
};
