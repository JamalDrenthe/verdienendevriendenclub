import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mission, MissionStatus, MissionCategory, MissionStep } from '../types';
import { Card, Button, Badge, ProgressBar, Input } from '../components/ui';
import { Lock, Check, ChevronRight, Upload, Calendar, ArrowLeft, Link as LinkIcon, FileText, Search, Filter, SlidersHorizontal, X, Zap, Coins, Clock, ChevronDown, ChevronUp, Sparkles, Send, MessageCircle, HelpCircle } from 'lucide-react';

// --- Mission List Component ---

interface MissionListProps {
  missions: Mission[];
}

export const MissionList: React.FC<MissionListProps> = ({ missions }) => {
  // Tabs State
  const [activeTab, setActiveTab] = useState<'OPEN' | 'COMPLETED' | 'PAYOUTS' | 'FAQ'>('OPEN');

  // State for filters (OPEN tab)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MissionCategory | 'ALL'>('ALL');
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filters state
  const [statusFilter, setStatusFilter] = useState<'ALL' | MissionStatus>('ALL');
  const [onlyPrio, setOnlyPrio] = useState(false);
  const [levelRange, setLevelRange] = useState<{min: string, max: string}>({ min: '', max: '' });

  // Get unique categories for the filter list
  const categories = useMemo(() => Array.from(new Set(missions.map(m => m.category))).sort(), [missions]);

  // Derived state: Filtered Missions (OPEN tab)
  const filteredMissions = useMemo(() => {
    return missions.filter(mission => {
      // Base filter logic:
      // If a specific status is selected in the filter, it overrides the Tab constraint.
      // Otherwise, the Tab determines which missions are shown (Open vs Completed).
      if (statusFilter === 'ALL') {
        if (activeTab === 'OPEN' && mission.status === MissionStatus.COMPLETED) return false;
        if (activeTab === 'COMPLETED' && mission.status !== MissionStatus.COMPLETED) return false;
      }

      // 1. Text Search (Title & Description)
      const matchesSearch = 
        mission.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        mission.description.toLowerCase().includes(searchQuery.toLowerCase());

      // 2. Category Filter
      const matchesCategory = selectedCategory === 'ALL' || mission.category === selectedCategory;

      // 3. Status Filter (Only relevant if filters are active)
      const matchesStatus = statusFilter === 'ALL' || mission.status === statusFilter;

      // 4. Priority Filter
      const matchesPrio = !onlyPrio || mission.isPrio;

      // 5. Level Range Filter
      const reqLevel = mission.requirements?.minLevel || 0;
      const min = levelRange.min === '' ? 0 : parseInt(levelRange.min);
      const max = levelRange.max === '' ? 999 : parseInt(levelRange.max);
      const matchesLevel = reqLevel >= min && reqLevel <= max;

      return matchesSearch && matchesCategory && matchesStatus && matchesPrio && matchesLevel;
    });
  }, [missions, searchQuery, selectedCategory, statusFilter, onlyPrio, levelRange, activeTab]);

  // Reset all filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('ALL');
    setStatusFilter('ALL');
    setOnlyPrio(false);
    setLevelRange({ min: '', max: '' });
    setShowFilters(false);
  };

  const activeFilterCount = (statusFilter !== 'ALL' ? 1 : 0) + (onlyPrio ? 1 : 0) + (levelRange.min !== '' || levelRange.max !== '' ? 1 : 0);

  // FAQ Data
  const faqItems = [
    { q: "Hoe verdien ik een nieuw level?", a: "Elke voltooide taak staat gelijk aan +1 Level. Je ontvangt direct je XP en reward na goedkeuring." },
    { q: "Wanneer worden uitbetalingen gedaan?", a: "Uitbetalingen worden elke vrijdag verwerkt voor alle goedgekeurde en 'Uitgekeerd' status taken van die week." },
    { q: "Wat betekent een 'Locked' status?", a: "Dit betekent dat je nog niet het vereiste level hebt bereikt of een voorgaande taak moet afronden." },
    { q: "Kan ik een taak annuleren?", a: "Ja, zolang je deze nog niet hebt ingediend ter review kun je stoppen en later verdergaan." },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Onboarding</h1>
          <p className="text-slate-500">Voltooi taken om in level te stijgen en XP te verdienen.</p>
        </div>
      </div>

      {/* Main Navigation Menu (Tabs) */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-1">
        <button 
            onClick={() => setActiveTab('OPEN')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] border-b-2 ${activeTab === 'OPEN' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
            Openstaand
        </button>
        <button 
            onClick={() => setActiveTab('COMPLETED')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] border-b-2 ${activeTab === 'COMPLETED' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
            Afgerond
        </button>
        <button 
            onClick={() => setActiveTab('PAYOUTS')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] border-b-2 ${activeTab === 'PAYOUTS' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
            Uitgekeerd
        </button>
        <button 
            onClick={() => setActiveTab('FAQ')} 
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors relative top-[1px] border-b-2 ${activeTab === 'FAQ' ? 'border-brand-600 text-brand-600 bg-brand-50/50' : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
        >
            Vragen
        </button>
      </div>

      {/* --- TAB CONTENT: OPEN & COMPLETED (Shared Logic) --- */}
      {(activeTab === 'OPEN' || activeTab === 'COMPLETED') && (
      <>
        {/* Search & Filter Bar */}
        <Card className="p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                    <Input 
                        placeholder={activeTab === 'COMPLETED' ? "Zoek in afgeronde taken..." : "Zoek op titel, beschrijving of trefwoord..."}
                        icon={<Search size={18} />} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full"
                    />
                </div>
                <div className="flex gap-2">
                    <Button 
                        variant={showFilters ? 'secondary' : 'outline'}
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <SlidersHorizontal size={18} />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="bg-brand-600 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[1.25rem]">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                    {activeFilterCount > 0 && (
                        <Button variant="ghost" onClick={clearFilters} className="text-slate-500 hover:text-red-500">
                            <X size={18} />
                        </Button>
                    )}
                </div>
            </div>

            {/* Expanded Filters Panel */}
            {showFilters && (
                <div className="pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                    {/* Status */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                        <select 
                            className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-brand-500 focus:border-brand-500 bg-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                        >
                            <option value="ALL">Alle statussen</option>
                            <option value={MissionStatus.AVAILABLE}>Beschikbaar</option>
                            <option value={MissionStatus.IN_PROGRESS}>In Uitvoering</option>
                            <option value={MissionStatus.LOCKED}>Vergrendeld</option>
                            <option value={MissionStatus.COMPLETED}>Voltooid</option>
                        </select>
                    </div>

                    {/* Level Requirement Range */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Level Bereik</label>
                        <div className="flex items-center gap-2">
                            <input 
                                type="number" 
                                placeholder="Min" 
                                min="0"
                                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                value={levelRange.min}
                                onChange={(e) => setLevelRange(prev => ({ ...prev, min: e.target.value }))}
                            />
                            <span className="text-slate-400 font-medium">-</span>
                            <input 
                                type="number" 
                                placeholder="Max" 
                                min="0"
                                className="w-full rounded-lg border border-slate-300 p-2 text-sm focus:ring-brand-500 focus:border-brand-500"
                                value={levelRange.max}
                                onChange={(e) => setLevelRange(prev => ({ ...prev, max: e.target.value }))}
                            />
                        </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-end pb-2">
                        <label className="flex items-center cursor-pointer group">
                            <div className="relative">
                                <input 
                                    type="checkbox" 
                                    className="sr-only" 
                                    checked={onlyPrio} 
                                    onChange={(e) => setOnlyPrio(e.target.checked)} 
                                />
                                <div className={`block w-10 h-6 rounded-full transition-colors ${onlyPrio ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
                                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${onlyPrio ? 'translate-x-4' : ''}`}></div>
                            </div>
                            <div className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900 flex items-center gap-2">
                                <Zap size={16} className={onlyPrio ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'} />
                                Alleen Prio Taken
                            </div>
                        </label>
                    </div>
                </div>
            )}
        </Card>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            <Button 
                variant={selectedCategory === 'ALL' ? 'primary' : 'outline'} 
                size="sm" 
                onClick={() => setSelectedCategory('ALL')}
                className="whitespace-nowrap rounded-full px-4"
            >
                Alles
            </Button>
            {categories.map(cat => (
                <Button 
                    key={cat}
                    variant={selectedCategory === cat ? 'primary' : 'outline'} 
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className="whitespace-nowrap rounded-full px-4"
                >
                    {cat}
                </Button>
            ))}
        </div>

        {/* Results Grid */}
        {filteredMissions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMissions.map(mission => (
                <Card key={mission.id} className={`flex flex-col h-full ${mission.status === MissionStatus.LOCKED ? 'opacity-70 bg-slate-50' : 'hover:border-brand-300 transition-colors'}`}>
                    <div className="p-6 flex-1">
                        <div className="flex justify-between items-start mb-4">
                            <Badge variant={mission.isPrio ? 'warning' : 'info'}>{mission.category}</Badge>
                            {mission.status === MissionStatus.LOCKED && <Lock size={16} className="text-slate-400" />}
                            {mission.status === MissionStatus.COMPLETED && <Check size={16} className="text-green-500" />}
                        </div>
                        <h3 className="font-bold text-lg text-slate-800 mb-2">{mission.title}</h3>
                        <p className="text-sm text-slate-500 line-clamp-3">{mission.description}</p>
                    </div>
                    <div className="p-6 border-t border-slate-100 bg-slate-50/50 mt-auto">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-brand-600">+{mission.xpReward} XP / +1 Level</span>
                            {mission.status === MissionStatus.LOCKED ? (
                                <span className="text-xs text-slate-400 font-medium">Vereist Lvl {mission.requirements?.minLevel}</span>
                            ) : mission.status === MissionStatus.COMPLETED ? (
                                <span className="text-xs text-green-600 font-bold uppercase tracking-wider">Voltooid</span>
                            ) : (
                                <Link to={`/onboarding/${mission.id}`}>
                                    <Button size="sm" variant={mission.isPrio ? 'secondary' : 'primary'}>
                                        Starten <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                </Link>
                            )}
                        </div>
                    </div>
                </Card>
                ))}
            </div>
        ) : (
            /* Empty State */
            <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
                    <Search size={32} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                    {activeTab === 'COMPLETED' ? "Geen afgeronde taken" : "Geen taken gevonden"}
                </h3>
                <p className="text-slate-500 max-w-md mx-auto mb-6">
                    {activeTab === 'COMPLETED' ? "Voltooi taken om ze hier terug te zien." : "Probeer je zoektermen aan te passen of verwijder enkele filters."}
                </p>
                {activeTab === 'OPEN' && <Button variant="outline" onClick={clearFilters}>Filters wissen</Button>}
            </div>
        )}
      </>
      )}

      {/* --- TAB CONTENT: PAYOUTS --- */}
      {activeTab === 'PAYOUTS' && (
          <div className="space-y-6">
               <Card className="p-6 border-l-4 border-l-green-500 bg-green-50/50">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <Coins size={24} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Totaal Uitgekeerd</h2>
                            <p className="text-slate-500">Jouw totale verdiensten tot nu toe</p>
                        </div>
                        <div className="ml-auto text-right">
                             <span className="block text-2xl font-bold text-green-600">€ 450,00</span>
                             <span className="text-xs text-slate-500">Laatste update: Vandaag</span>
                        </div>
                    </div>
               </Card>

               <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
                   <div className="p-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700 flex items-center gap-2">
                       <Clock size={16} /> Transactiegeschiedenis
                   </div>
                   <div className="divide-y divide-slate-100">
                       {/* Mock Data based on completed missions found in system, or just generic mock for now */}
                       {[
                           { id: 'tx_1', title: 'Onboarding Compleet', date: '12 Okt 2023', amount: '€ 50,00', status: 'Betaald' },
                           { id: 'tx_2', title: 'Profiel & Identiteit', date: '14 Okt 2023', amount: '€ 100,00', status: 'Betaald' },
                           { id: 'tx_3', title: 'Check-in Dag 1', date: '15 Okt 2023', amount: '€ 15,00', status: 'In verwerking' },
                           { id: 'tx_4', title: 'NDA Ondertekening', date: '16 Okt 2023', amount: '€ 25,00', status: 'Betaald' },
                       ].map((tx) => (
                           <div key={tx.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between hover:bg-slate-50 transition-colors">
                               <div className="mb-2 md:mb-0">
                                   <h4 className="font-bold text-slate-800">{tx.title}</h4>
                                   <p className="text-xs text-slate-500">{tx.date}</p>
                               </div>
                               <div className="flex items-center gap-4">
                                   <span className="font-mono font-medium text-slate-700">{tx.amount}</span>
                                   <Badge variant={tx.status === 'Betaald' ? 'success' : 'warning'}>{tx.status}</Badge>
                               </div>
                           </div>
                       ))}
                   </div>
                   <div className="p-4 text-center border-t border-slate-100">
                       <button className="text-sm text-brand-600 font-medium hover:underline">Bekijk alle transacties</button>
                   </div>
               </div>
          </div>
      )}

      {/* --- TAB CONTENT: FAQ --- */}
      {activeTab === 'FAQ' && (
          <div className="max-w-3xl mx-auto space-y-6">
              <div className="text-center mb-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-100 text-brand-600 mb-4">
                      <HelpCircle size={32} />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-800">Veelgestelde Vragen</h2>
                  <p className="text-slate-500">Hulp nodig bij je onboarding?</p>
              </div>

              <div className="space-y-4">
                  {faqItems.map((item, idx) => (
                      <Card key={idx} className="p-6 transition-all hover:shadow-md">
                          <h3 className="font-bold text-lg text-slate-800 mb-2 flex items-start gap-3">
                              <span className="text-brand-300 font-black text-xl">Q.</span>
                              {item.q}
                          </h3>
                          <div className="pl-8 text-slate-600 leading-relaxed">
                              {item.a}
                          </div>
                      </Card>
                  ))}
              </div>

              <div className="bg-brand-50 rounded-xl p-8 text-center mt-8">
                  <h3 className="font-bold text-slate-800 mb-2">Staat je vraag er niet tussen?</h3>
                  <p className="text-slate-600 mb-6">Neem contact op met community support voor verdere assistentie.</p>
                  <Link to="/chat">
                    <Button>Naar Support Chat</Button>
                  </Link>
              </div>
          </div>
      )}
    </div>
  );
};

// --- Mission Detail & Execution Component ---

interface MissionDetailProps {
  missions: Mission[];
  onCompleteMission: (missionId: string) => void;
}

export const MissionDetail: React.FC<MissionDetailProps> = ({ missions, onCompleteMission }) => {
  const { id } = useParams<{ id: string }>();
  const mission = missions.find(m => m.id === id);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  // New Tab State for Detail View
  const [detailTab, setDetailTab] = useState<'INSTRUCTIONS' | 'ASK_AI' | 'FAQ'>('INSTRUCTIONS');
  
  // Ask AI State
  const [aiMessage, setAiMessage] = useState('');
  const [aiChatHistory, setAiChatHistory] = useState<{role: 'user' | 'ai', text: string}[]>([
      { role: 'ai', text: 'Hallo! Ik ben je AI-coach. Heb je vragen over deze stap of de instructies?' }
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [aiChatHistory, detailTab]);

  if (!mission) return <div>Mission not found</div>;

  const currentStep = mission.steps[currentStepIndex];
  const progress = (completedSteps.length / mission.steps.length) * 100;

  const handleInputChange = (stepId: string, value: any) => {
    setFormData(prev => ({ ...prev, [stepId]: value }));
  };

  const handleFileUpload = (stepId: string, file: File | undefined) => {
    if (!file) return;
    
    // Clear current value to show upload state and start progress
    handleInputChange(stepId, undefined);
    setUploadProgress(prev => ({ ...prev, [stepId]: 0 }));
    
    let p = 0;
    const interval = setInterval(() => {
        p += 20;
        setUploadProgress(prev => ({ ...prev, [stepId]: p }));
        
        if (p >= 100) {
            clearInterval(interval);
            setTimeout(() => {
                handleInputChange(stepId, file.name);
            }, 300);
        }
    }, 150);
  };

  const handleNextStep = () => {
    // Mock Validation
    if (currentStep.requiredInputType && !formData[currentStep.id]) {
      // Allow false for boolean (checkbox unchecked is a valid state technically, but for this app usually implies checking it)
      if (currentStep.requiredInputType === 'boolean' && formData[currentStep.id] !== true) {
         alert("Vink het vakje aan om te bevestigen.");
         return;
      } else if (currentStep.requiredInputType !== 'boolean') {
          alert("Vul alstublieft het veld in.");
          return;
      }
    }

    if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps(prev => [...prev, currentStep.id]);
    }

    if (currentStepIndex < mission.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleFinish = () => {
     if (currentStep.requiredInputType && !formData[currentStep.id]) {
        if (currentStep.requiredInputType === 'boolean' && formData[currentStep.id] !== true) {
            alert("Vink het vakje aan om te bevestigen.");
            return;
        } else if (currentStep.requiredInputType !== 'boolean') {
            alert("Vul alstublieft het veld in.");
            return;
        }
     }
     if (!completedSteps.includes(currentStep.id)) {
        setCompletedSteps(prev => [...prev, currentStep.id]);
     }

     setIsSubmitting(true);
     setTimeout(() => {
        onCompleteMission(mission.id);
        setIsSubmitting(false);
     }, 1500);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if(!aiMessage.trim()) return;
    
    const userMsg = aiMessage;
    setAiChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
    setAiMessage('');
    setIsAiTyping(true);

    // Simulate AI response
    setTimeout(() => {
        setAiChatHistory(prev => [...prev, { 
            role: 'ai', 
            text: `Op basis van de huidige stap "${currentStep.title}", adviseer ik je om goed te letten op de details in de beschrijving. Zorg dat je input specifiek en volledig is.` 
        }]);
        setIsAiTyping(false);
    }, 1500);
  };

  const renderInput = (step: MissionStep) => {
    switch (step.requiredInputType) {
        case 'text':
        case 'email':
        case 'iban':
        case 'number':
        case 'url':
            return <Input 
                type={step.requiredInputType === 'iban' ? 'text' : step.requiredInputType} 
                placeholder={step.requiredInputType === 'url' ? 'https://...' : `Voer ${step.title.toLowerCase()} in...`}
                value={formData[step.id] || ''}
                icon={step.requiredInputType === 'url' ? <LinkIcon size={16}/> : undefined}
                onChange={(e) => handleInputChange(step.id, e.target.value)}
                className="mt-2"
            />;
        case 'long_text':
             return (
                <textarea
                    className="block w-full rounded-lg border border-slate-300 focus:ring-brand-500 focus:border-brand-500 p-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-1 transition-shadow mt-2 h-32"
                    placeholder="Typ hier je uitgebreide antwoord..."
                    value={formData[step.id] || ''}
                    onChange={(e) => handleInputChange(step.id, e.target.value)}
                />
             );
        case 'select':
            return (
                <select 
                    className="block w-full rounded-lg border border-slate-300 bg-white p-2.5 text-sm focus:ring-brand-500 focus:border-brand-500 mt-2"
                    value={formData[step.id] || ''}
                    onChange={(e) => handleInputChange(step.id, e.target.value)}
                >
                    <option value="">Selecteer een optie...</option>
                    {step.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
            );
        case 'boolean':
            return (
                <div className="flex items-center mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200 cursor-pointer" onClick={() => handleInputChange(step.id, !formData[step.id])}>
                    <input 
                        type="checkbox" 
                        checked={formData[step.id] || false}
                        onChange={(e) => handleInputChange(step.id, e.target.checked)}
                        className="w-5 h-5 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
                    />
                    <label className="ml-3 text-sm font-medium text-slate-900 cursor-pointer">
                        {step.description || 'Ik bevestig dit.'}
                    </label>
                </div>
            );
        case 'file':
            const currentProgress = uploadProgress[step.id] || 0;
            const fileName = formData[step.id];
            // If progress is active but file is not yet set (simulating), it is uploading.
            const isUploading = currentProgress > 0 && !fileName;

            return (
                <div className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center transition-all relative overflow-hidden group ${fileName ? 'border-green-300 bg-green-50/20' : 'border-slate-300 hover:bg-slate-50'}`}>
                    <input 
                        type="file" 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20 disabled:cursor-not-allowed" 
                        onChange={(e) => handleFileUpload(step.id, e.target.files?.[0])}
                        disabled={isUploading}
                    />
                    
                    {isUploading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/95 z-10 px-8">
                             <div className="w-full">
                                <div className="flex justify-between text-xs font-bold text-brand-600 mb-2">
                                    <span>Uploading...</span>
                                    <span>{currentProgress}%</span>
                                </div>
                                <ProgressBar progress={currentProgress} />
                             </div>
                        </div>
                    ) : null}

                    {fileName ? (
                         <div className="relative z-0 animate-fade-in">
                            <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-3 shadow-sm">
                                <Check size={24} strokeWidth={3} />
                            </div>
                            <p className="text-sm font-bold text-slate-800 break-all">{fileName}</p>
                            <p className="text-xs text-green-600 font-bold mt-1 uppercase tracking-wide">Succesvol geüpload</p>
                            <p className="text-xs text-slate-400 mt-4 group-hover:text-brand-600 transition-colors">Klik of sleep om te wijzigen</p>
                         </div>
                    ) : (
                        <div className="relative z-0 opacity-100 transition-opacity duration-200">
                            <div className="mx-auto h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3 group-hover:scale-110 group-hover:bg-brand-50 group-hover:text-brand-500 transition-all duration-300">
                                <Upload size={24} />
                            </div>
                            <p className="text-sm font-medium text-slate-900">Klik om te uploaden</p>
                            <p className="text-xs text-slate-500 mt-1">PNG, JPG of PDF (max 5MB)</p>
                        </div>
                    )}
                </div>
            );
        default:
            return <div className="p-4 bg-slate-50 text-slate-500 text-sm rounded">Geen input vereist, lees de instructie en ga verder.</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
        <Link to="/onboarding" className="inline-flex items-center text-slate-500 hover:text-brand-600 mb-6 transition-colors">
            <ArrowLeft size={20} className="mr-2" /> Terug naar overzicht
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Steps Timeline */}
            <div className="lg:col-span-4 order-2 lg:order-1 space-y-4">
                <Card className="p-6 sticky top-6">
                    <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                        <h2 className="font-bold text-slate-800">Stappenplan</h2>
                        <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">{currentStepIndex + 1}/{mission.steps.length}</span>
                    </div>
                    
                    <div className="relative pl-2">
                        {/* Timeline Connector */}
                        <div className="absolute left-[15px] top-3 bottom-5 w-0.5 bg-slate-100" />

                        <div className="space-y-8 relative">
                            {mission.steps.map((step, idx) => {
                                const isCompleted = idx < currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                const isLocked = idx > currentStepIndex;
                                
                                return (
                                    <div key={step.id} className="flex items-start relative group">
                                        {/* Background patch for icon to hide line */}
                                        <div className="absolute -left-2 -top-2 w-10 h-10 bg-white -z-10 rounded-full" />

                                        {/* Status Indicator */}
                                        <div className={`
                                            flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs border-2 z-10 transition-all duration-300
                                            ${isCompleted 
                                                ? 'bg-green-500 border-green-500 text-white shadow-sm scale-100' 
                                                : isCurrent 
                                                    ? 'bg-white border-brand-600 text-brand-600 ring-4 ring-brand-50 shadow-md scale-110'
                                                    : 'bg-slate-50 border-slate-200 text-slate-400'}
                                        `}>
                                            {isCompleted ? <Check size={16} strokeWidth={3} /> : 
                                             isCurrent ? <div className="w-2.5 h-2.5 bg-brand-600 rounded-full animate-pulse" /> : 
                                             <span className="font-semibold">{idx + 1}</span>}
                                        </div>

                                        {/* Step Info */}
                                        <div className={`ml-4 pt-1 transition-all duration-300 ${isLocked ? 'opacity-50 blur-[0.3px] grayscale' : 'opacity-100'}`}>
                                            <p className={`text-sm font-bold ${isCurrent ? 'text-brand-700' : 'text-slate-800'}`}>
                                                {step.title}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                                                {step.description}
                                            </p>
                                            
                                            {/* Status Badge */}
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {isCurrent && (
                                                    <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-100">
                                                        Huidig
                                                    </span>
                                                )}
                                                {isCompleted && (
                                                    <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                                        Voltooid
                                                    </span>
                                                )}
                                                {isLocked && (
                                                    <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                                                        <Lock size={10} className="mr-1" /> Slot
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-8 order-1 lg:order-2">
                 <Card className="p-8 min-h-[600px] flex flex-col shadow-lg border-t-4 border-t-brand-500">
                    <div className="mb-6">
                        <div className="flex justify-between items-end mb-2">
                             <div>
                                 <h2 className="text-2xl font-extrabold text-slate-900 mb-1">{currentStep.title}</h2>
                                 <p className="text-slate-500 text-sm">Stap {currentStepIndex + 1} van de {mission.steps.length}</p>
                             </div>
                             <span className="text-3xl font-black text-brand-100">{Math.round(progress)}%</span>
                        </div>
                        <ProgressBar progress={progress} />
                    </div>

                    {/* Mission Context Menu */}
                    <div className="flex space-x-6 border-b border-slate-200 mb-6">
                        <button 
                            onClick={() => setDetailTab('INSTRUCTIONS')} 
                            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${detailTab === 'INSTRUCTIONS' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            Instructies
                        </button>
                        <button 
                            onClick={() => setDetailTab('ASK_AI')} 
                            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${detailTab === 'ASK_AI' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            <Sparkles size={14}/> Ask AI
                        </button>
                        <button 
                            onClick={() => setDetailTab('FAQ')} 
                            className={`pb-3 text-sm font-bold border-b-2 transition-colors ${detailTab === 'FAQ' ? 'border-brand-600 text-brand-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                        >
                            FAQ
                        </button>
                    </div>

                    {/* INSTRUCTIONS TAB */}
                    {detailTab === 'INSTRUCTIONS' && (
                        <>
                            <div className="flex-1 bg-slate-50 rounded-xl p-6 border border-slate-100 mb-8 animate-fade-in">
                                <div className="prose prose-slate max-w-none">
                                    <h3 className="text-lg font-bold text-slate-800 mb-2">Instructie</h3>
                                    <p className="text-slate-600 leading-relaxed">{currentStep.description}</p>
                                </div>
                                
                                <div className="mt-8 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
                                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Jouw Invoer</h4>
                                    {renderInput(currentStep)}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                                <Button 
                                    variant="outline" 
                                    disabled={currentStepIndex === 0}
                                    onClick={() => setCurrentStepIndex(prev => prev - 1)}
                                    className="w-32"
                                >
                                    Vorige
                                </Button>

                                {currentStepIndex === mission.steps.length - 1 ? (
                                    <Button 
                                        variant="secondary" 
                                        onClick={handleFinish}
                                        isLoading={isSubmitting}
                                        className="w-48 shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5"
                                    >
                                        Taak Voltooien
                                    </Button>
                                ) : (
                                    <Button 
                                        onClick={handleNextStep}
                                        className="w-48 shadow-md hover:shadow-lg transform transition-all hover:-translate-y-0.5"
                                    >
                                        Volgende Stap <ChevronRight size={16} className="ml-1" />
                                    </Button>
                                )}
                            </div>
                        </>
                    )}

                    {/* ASK AI TAB */}
                    {detailTab === 'ASK_AI' && (
                        <div className="flex-1 flex flex-col h-full animate-fade-in min-h-[400px]">
                             <div className="flex-1 bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 overflow-y-auto max-h-[400px]">
                                 <div className="space-y-4">
                                     {aiChatHistory.map((msg, i) => (
                                         <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                             <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user' ? 'bg-brand-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'}`}>
                                                 {msg.text}
                                             </div>
                                         </div>
                                     ))}
                                     {isAiTyping && (
                                         <div className="flex justify-start">
                                             <div className="bg-white border border-slate-200 p-3 rounded-lg rounded-bl-none flex gap-1 items-center">
                                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                                             </div>
                                         </div>
                                     )}
                                     <div ref={chatEndRef} />
                                 </div>
                             </div>
                             
                             <form onSubmit={handleSendMessage} className="flex gap-2">
                                 <input 
                                     className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                                     placeholder="Typ je vraag..."
                                     value={aiMessage}
                                     onChange={(e) => setAiMessage(e.target.value)}
                                 />
                                 <Button type="submit" disabled={isAiTyping || !aiMessage.trim()}>
                                     <Send size={18} />
                                 </Button>
                             </form>
                             <div className="mt-4 p-3 bg-brand-50 border border-brand-100 rounded-lg flex gap-3 text-xs text-brand-800">
                                 <Sparkles size={16} className="shrink-0 mt-0.5" />
                                 <p>Tip: De AI assistent kan je helpen om complexe instructies samen te vatten of voorbeelden te geven bij de huidige stap.</p>
                             </div>
                        </div>
                    )}

                    {/* FAQ TAB */}
                    {detailTab === 'FAQ' && (
                        <div className="flex-1 animate-fade-in">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <HelpCircle size={20} className="text-brand-500"/> Veelgestelde vragen
                            </h3>
                            <div className="space-y-4">
                                <Card className="p-4 bg-slate-50 border-slate-200">
                                    <h4 className="font-bold text-sm text-slate-900 mb-2">Wat als ik de gevraagde data niet kan vinden?</h4>
                                    <p className="text-sm text-slate-600">Als informatie ontbreekt, markeer dit dan duidelijk in het opmerkingenveld of kies 'N/A' indien mogelijk. Bij twijfel kun je altijd je teamlead raadplegen.</p>
                                </Card>
                                <Card className="p-4 bg-slate-50 border-slate-200">
                                    <h4 className="font-bold text-sm text-slate-900 mb-2">Hoe lang duurt de review?</h4>
                                    <p className="text-sm text-slate-600">Reviews worden doorgaans binnen 24 uur uitgevoerd door een peer of manager. Je ontvangt een notificatie zodra dit is afgerond.</p>
                                </Card>
                                <Card className="p-4 bg-slate-50 border-slate-200">
                                    <h4 className="font-bold text-sm text-slate-900 mb-2">Kan ik een stap overslaan?</h4>
                                    <p className="text-sm text-slate-600">Nee, alle stappen moeten chronologisch worden doorlopen om de integriteit van het proces te waarborgen.</p>
                                </Card>
                            </div>
                        </div>
                    )}
                 </Card>
            </div>
        </div>
    </div>
  );
};