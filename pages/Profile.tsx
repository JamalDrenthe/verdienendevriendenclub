import React, { useState } from 'react';
import { User } from '../types';
import { Card, Button, Input, Badge, ProgressBar } from '../components/ui';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  MapPin, 
  Calendar, 
  Briefcase, 
  Edit2, 
  Save, 
  Award, 
  TrendingUp, 
  Clock, 
  CheckCircle,
  Sun,
  Monitor,
  Heart,
  Camera,
  Upload
} from 'lucide-react';

interface ProfileProps {
  user: User;
}

export const Profile: React.FC<ProfileProps> = ({ user: initialUser }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState(initialUser);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'ACCOUNT' | 'PREFS'>('OVERVIEW');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      bio: user.bio || '',
      specializations: user.specializations.join(', '),
  });

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
      setUser(prev => ({ 
          ...prev, 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          bio: formData.bio,
          specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
          avatarUrl: avatarPreview || prev.avatarUrl
      }));
      setIsEditing(false);
      setAvatarPreview(null);
      // Here you would typically call an API to update the user
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-800">{t('profile.title')}</h1>
                <p className="text-slate-500">{t('profile.subtitle')}</p>
            </div>
            <div className="flex gap-2">
                 <Button 
                    variant={activeTab === 'OVERVIEW' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('OVERVIEW')}
                 >
                    {t('profile.tab.overview')}
                 </Button>
                 <Button 
                    variant={activeTab === 'ACCOUNT' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('ACCOUNT')}
                 >
                    {t('profile.tab.account')}
                 </Button>
                 <Button 
                    variant={activeTab === 'PREFS' ? 'primary' : 'ghost'} 
                    size="sm"
                    onClick={() => setActiveTab('PREFS')}
                 >
                    {t('profile.tab.preferences')}
                 </Button>
            </div>
        </div>

        {/* --- HEADER CARD --- */}
        <Card className="p-8 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                 <UserIcon size={200} />
             </div>
             
             <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center md:items-start">
                 <div className="relative">
                     <img src={user.avatarUrl} alt="Profile" className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover" />
                     <div className="absolute bottom-1 right-1 bg-green-500 border-2 border-white w-6 h-6 rounded-full"></div>
                 </div>
                 
                 <div className="flex-1 text-center md:text-left">
                     <div className="flex flex-col md:flex-row items-center md:items-end gap-2 mb-2">
                         <h2 className="text-3xl font-bold text-slate-800">{user.firstName} {user.lastName}</h2>
                         <Badge variant="info">Team Alpha</Badge>
                     </div>
                     <p className="text-slate-500 max-w-lg mb-4">{user.bio}</p>
                     
                     <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-600">
                         <span className="flex items-center gap-1"><MapPin size={14}/> Amsterdam, NL</span>
                         <span className="flex items-center gap-1"><Briefcase size={14}/> {user.specializations[0] || 'N/A'}</span>
                         <span className="flex items-center gap-1"><Calendar size={14}/> Joined Oct 2023</span>
                     </div>
                 </div>

                 <div className="w-full md:w-64 bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('profile.level')}</span>
                         <span className="text-2xl font-black text-brand-600">{user.level}</span>
                     </div>
                     <div className="flex justify-between items-center mb-1 text-xs text-slate-500">
                         <span>{t('profile.xp')}</span>
                         <span>{user.xp} / 100</span>
                     </div>
                     <ProgressBar progress={user.xp} />
                 </div>
             </div>
        </Card>

        {/* --- CONTENT AREA --- */}
        
        {activeTab === 'OVERVIEW' && (
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Stats Column */}
                 <div className="space-y-6">
                     <Card className="p-6">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Award size={18} className="text-gold-500"/> {t('profile.stats')}</h3>
                         <div className="space-y-4">
                             <div className="flex justify-between items-center">
                                 <span className="text-slate-500 text-sm">{t('profile.completed')}</span>
                                 <span className="font-bold text-slate-800">42</span>
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-slate-500 text-sm">{t('profile.earned')}</span>
                                 <span className="font-bold text-green-600">€ 3,450</span>
                             </div>
                             <div className="flex justify-between items-center">
                                 <span className="text-slate-500 text-sm">{t('profile.hours')}</span>
                                 <span className="font-bold text-slate-800">128u</span>
                             </div>
                         </div>
                     </Card>

                     <Card className="p-6">
                         <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={18} className="text-brand-500"/> Skills</h3>
                         <div className="flex flex-wrap gap-2">
                             {user.specializations.map(spec => (
                                 <Badge key={spec} variant="neutral">{spec}</Badge>
                             ))}
                             <Badge variant="success">React</Badge>
                             <Badge variant="success">TypeScript</Badge>
                             <Badge variant="warning">Design</Badge>
                         </div>
                     </Card>
                 </div>

                 {/* Activity Column */}
                 <div className="md:col-span-2">
                     <Card className="p-6 h-full">
                         <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2"><Clock size={18} className="text-slate-400"/> Recente Activiteit</h3>
                         <div className="space-y-6 relative">
                             <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100"></div>
                             
                             {[
                                 { title: 'Level 4 Bereikt', date: 'Vandaag', icon: <Award size={14} className="text-gold-500"/>, color: 'bg-gold-100' },
                                 { title: 'Missie "Q4 Marketing" Voltooid', date: 'Gisteren', icon: <CheckCircle size={14} className="text-green-500"/>, color: 'bg-green-100' },
                                 { title: 'Nieuwe skill "TypeScript" toegevoegd', date: '3 dagen geleden', icon: <TrendingUp size={14} className="text-blue-500"/>, color: 'bg-blue-100' },
                                 { title: 'Profiel bijgewerkt', date: '1 week geleden', icon: <UserIcon size={14} className="text-slate-500"/>, color: 'bg-slate-100' }
                             ].map((item, i) => (
                                 <div key={i} className="flex gap-4 relative">
                                     <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center border-4 border-white z-10 shrink-0`}>
                                         {item.icon}
                                     </div>
                                     <div className="pt-2">
                                         <p className="font-bold text-slate-800 text-sm">{item.title}</p>
                                         <p className="text-xs text-slate-500">{item.date}</p>
                                     </div>
                                 </div>
                             ))}
                         </div>
                     </Card>
                 </div>
             </div>
        )}

        {activeTab === 'ACCOUNT' && (
            <Card className="p-8">
                 <div className="flex justify-between items-center mb-6">
                     <h3 className="text-lg font-bold text-slate-800">Persoonlijke Gegevens</h3>
                     {!isEditing ? (
                         <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                             <Edit2 size={14} className="mr-2"/> Bewerken
                         </Button>
                     ) : (
                         <div className="flex gap-2">
                             <Button variant="ghost" size="sm" onClick={() => { setIsEditing(false); setAvatarPreview(null); }}>Annuleren</Button>
                             <Button size="sm" onClick={handleSave}><Save size={14} className="mr-2"/> {t('profile.save')}</Button>
                         </div>
                     )}
                 </div>

                 {isEditing && (
                    <div className="mb-8 flex flex-col md:flex-row items-center gap-6 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300">
                        <div className="relative group">
                            <img 
                                src={avatarPreview || user.avatarUrl} 
                                alt="Avatar Preview" 
                                className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" 
                            />
                            <div className="absolute bottom-0 right-0 bg-brand-600 text-white rounded-full p-2 shadow-sm border border-white">
                                <Camera size={16} />
                            </div>
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-sm font-bold text-slate-800 mb-1">Profielfoto wijzigen</h4>
                            <p className="text-xs text-slate-500 mb-4 max-w-xs">Upload een nieuwe foto om je profiel persoonlijker te maken. JPG, PNG of GIF (max 5MB).</p>
                            <div className="flex gap-3 justify-center md:justify-start">
                                <label className="cursor-pointer bg-white border border-slate-300 hover:border-brand-500 hover:text-brand-600 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-all shadow-sm flex items-center">
                                    <Upload size={16} className="mr-2"/>
                                    Foto Uploaden
                                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                </label>
                                {avatarPreview && (
                                    <Button variant="ghost" size="sm" onClick={() => setAvatarPreview(null)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                        Herstellen
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                 )}

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <Input 
                        label="Voornaam" 
                        value={formData.firstName} 
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                     />
                     <Input 
                        label="Achternaam" 
                        value={formData.lastName} 
                        disabled={!isEditing}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                     />
                     <div className="md:col-span-2">
                        <Input 
                            label="Email Adres" 
                            value={formData.email} 
                            disabled={!isEditing}
                            icon={<Mail size={16}/>}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2">
                        <Input 
                            label="Specialisaties (komma gescheiden)" 
                            value={formData.specializations} 
                            disabled={!isEditing}
                            icon={<Briefcase size={16}/>}
                            onChange={(e) => setFormData({...formData, specializations: e.target.value})}
                        />
                     </div>
                     <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">{t('profile.bio')}</label>
                        <textarea 
                            className="block w-full rounded-lg border border-slate-300 p-3 text-sm focus:ring-brand-500 focus:border-brand-500 disabled:bg-slate-50 disabled:text-slate-500"
                            rows={4}
                            disabled={!isEditing}
                            value={formData.bio}
                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                        />
                     </div>
                 </div>

                 <div className="mt-8 pt-8 border-t border-slate-100">
                     <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Shield size={18}/> Beveiliging</h3>
                     <Button variant="outline">Wachtwoord Wijzigen</Button>
                     <p className="text-xs text-slate-400 mt-2">Laatst gewijzigd: 3 maanden geleden</p>
                 </div>
            </Card>
        )}

        {activeTab === 'PREFS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">{t('profile.theme')}</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setTheme('default')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${theme === 'default' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
                        >
                            <span className="flex items-center gap-3"><Sun size={20} className="text-orange-500"/> Default (Light)</span>
                            {theme === 'default' && <CheckCircle size={18} className="text-brand-600"/>}
                        </button>
                        <button 
                            onClick={() => setTheme('matrix')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${theme === 'matrix' ? 'border-green-500 bg-slate-900 text-green-400' : 'border-slate-200 hover:border-green-200'}`}
                        >
                            <span className="flex items-center gap-3"><Monitor size={20}/> Matrix Protocol</span>
                            {theme === 'matrix' && <CheckCircle size={18}/>}
                        </button>
                        <button 
                            onClick={() => setTheme('rose')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${theme === 'rose' ? 'border-rose-500 bg-rose-50 text-rose-600' : 'border-slate-200 hover:border-rose-200'}`}
                        >
                            <span className="flex items-center gap-3"><Heart size={20}/> Rose Gold</span>
                            {theme === 'rose' && <CheckCircle size={18}/>}
                        </button>
                    </div>
                </Card>

                <Card className="p-6">
                    <h3 className="font-bold text-slate-800 mb-4">{t('profile.lang')}</h3>
                    <div className="space-y-3">
                        <button 
                            onClick={() => setLanguage('nl')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === 'nl' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
                        >
                            <span className="flex items-center gap-3">🇳🇱 Nederlands</span>
                            {language === 'nl' && <CheckCircle size={18} className="text-brand-600"/>}
                        </button>
                        <button 
                            onClick={() => setLanguage('en')}
                            className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${language === 'en' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-brand-200'}`}
                        >
                            <span className="flex items-center gap-3">🇬🇧 English</span>
                            {language === 'en' && <CheckCircle size={18} className="text-brand-600"/>}
                        </button>
                    </div>
                </Card>
            </div>
        )}
    </div>
  );
};