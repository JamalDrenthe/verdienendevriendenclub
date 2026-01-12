import React from 'react';
import { Card, Button, Badge, ProgressBar } from '../components/ui';
import { Laptop, Smartphone, Plus, Calendar, MapPin, TrendingUp, DollarSign, Search, Briefcase, Filter, ArrowUpRight, Home, Zap, CreditCard } from 'lucide-react';

// --- BOASTPLUG (formerly Grover) ---
export const Boastplug: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Laptop className="text-brand-600"/> Boastplug Business</h1>
                <p className="text-slate-500">Beheer je gehuurde tech-apparatuur.</p>
            </div>
            <Button>Nieuw Apparaat</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                    <Laptop size={32} className="text-slate-700" />
                    <Badge variant="success">Actief</Badge>
                </div>
                <h3 className="font-bold text-lg">MacBook Pro 14" M3</h3>
                <p className="text-sm text-slate-500">Space Grey • 16GB RAM</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                    <span className="text-slate-500">Looptijd</span>
                    <span className="font-medium">12 mnd resterend</span>
                </div>
            </Card>

            <Card className="p-6 border-l-4 border-l-green-500">
                <div className="flex justify-between items-start mb-4">
                    <Smartphone size={32} className="text-slate-700" />
                    <Badge variant="success">Actief</Badge>
                </div>
                <h3 className="font-bold text-lg">iPhone 15 Pro</h3>
                <p className="text-sm text-slate-500">Titanium • 256GB</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between text-sm">
                    <span className="text-slate-500">Looptijd</span>
                    <span className="font-medium">18 mnd resterend</span>
                </div>
            </Card>

            <Card className="p-6 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center hover:bg-slate-50 cursor-pointer transition-colors min-h-[200px]">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2 text-slate-400">
                    <Plus size={24} />
                </div>
                <h3 className="font-semibold text-slate-700">Apparaat toevoegen</h3>
                <p className="text-xs text-slate-500 mt-1">Monitoren, tablets, drones...</p>
            </Card>
        </div>
    </div>
  );
};

// --- SPONTIVA ---
export const Spontiva: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><Zap className="text-yellow-500"/> Spontiva</h1>
                <p className="text-slate-500">De financieringsmotor voor jouw groei.</p>
            </div>
            <Button>Nieuwe Aanvraag</Button>
        </div>
        
        {/* Dashboard Cards for Funding */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-slate-900 text-white border-none">
                <p className="text-slate-400 text-sm mb-1">Beschikbaar Krediet</p>
                <h2 className="text-3xl font-bold mb-4">€ 25,000.00</h2>
                <ProgressBar progress={75} colorClass="bg-yellow-500" />
                <p className="text-xs text-slate-400 mt-2">75% van limiet beschikbaar</p>
            </Card>

            <Card className="p-6">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-800">Actieve Financiering</h3>
                        <p className="text-xs text-slate-500">2 lopende trajecten</p>
                    </div>
                 </div>
                 <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                        <span>Marketing Boost Q4</span>
                        <span className="font-bold">€ 5,000</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span>Hardware Upgrade</span>
                        <span className="font-bold">€ 2,500</span>
                    </div>
                 </div>
            </Card>

            <Card className="p-6 flex flex-col justify-center items-center text-center cursor-pointer hover:border-brand-300 transition-colors">
                 <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center text-brand-600 mb-3">
                    <Plus size={24} />
                 </div>
                 <h3 className="font-bold text-slate-800">Snel Krediet</h3>
                 <p className="text-xs text-slate-500 mt-1">Directe goedkeuring tot € 1.000 voor micro-uitgaven.</p>
            </Card>
        </div>

        {/* Recent Transactions / History */}
        <h3 className="font-bold text-slate-800 text-lg">Transactiegeschiedenis</h3>
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
             {/* Simple list */}
             {[
                 { date: '12 Okt', desc: 'Aflossing Marketing Boost', amount: '- € 250.00', status: 'Verwerkt' },
                 { date: '01 Okt', desc: 'Opname Hardware Upgrade', amount: '+ € 2,500.00', status: 'Gestort' },
                 { date: '28 Sep', desc: 'Aflossing Marketing Boost', amount: '- € 250.00', status: 'Verwerkt' },
             ].map((tx, i) => (
                 <div key={i} className="flex items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                     <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                             <CreditCard size={18} />
                         </div>
                         <div>
                             <p className="font-bold text-slate-800">{tx.desc}</p>
                             <p className="text-xs text-slate-500">{tx.date}</p>
                         </div>
                     </div>
                     <div className="text-right">
                         <p className={`font-bold ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-slate-800'}`}>{tx.amount}</p>
                         <Badge variant="neutral">{tx.status}</Badge>
                     </div>
                 </div>
             ))}
        </div>
    </div>
  );
};

// --- WONINGVRIJ (formerly Airbnb) ---
export const WoningVrij: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="bg-gradient-to-r from-[#FF385C] to-[#BD1E59] rounded-2xl p-8 text-white shadow-lg">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2"><Home /> WoningVrij</h1>
                    <p className="text-white/90 mt-2">Boek unieke werkplekken en verblijven wereldwijd.</p>
                </div>
                <div className="bg-white p-2 rounded-lg flex shadow-lg w-full md:w-auto">
                     <div className="flex items-center px-4 border-r border-slate-100">
                        <MapPin size={18} className="text-slate-400 mr-2" />
                        <input className="outline-none text-slate-800 placeholder-slate-400" placeholder="Waar ga je heen?" />
                     </div>
                     <div className="flex items-center px-4 border-r border-slate-100">
                        <Calendar size={18} className="text-slate-400 mr-2" />
                        <input className="outline-none text-slate-800 placeholder-slate-400 w-24" placeholder="Data" />
                     </div>
                     <button className="bg-[#FF385C] hover:bg-[#D90B3E] text-white px-6 py-2 rounded-md font-bold transition-colors">
                        Zoek
                     </button>
                </div>
            </div>
        </div>

        <h3 className="font-bold text-slate-800 text-lg">Aanbevolen voor jou</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
                <Card key={i} className="overflow-hidden hover:shadow-lg transition-all group cursor-pointer">
                    <div className="relative h-48 bg-slate-200">
                        <img src={`https://picsum.photos/600/400?random=${i+50}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Stay" />
                        <span className="absolute top-2 left-2 bg-white px-2 py-1 rounded text-xs font-bold shadow">Work-ready</span>
                    </div>
                    <div className="p-4">
                        <div className="flex justify-between items-start">
                            <h4 className="font-bold text-slate-900">Modern Appartement</h4>
                            <span className="text-sm font-semibold">€ 120/n</span>
                        </div>
                        <p className="text-slate-500 text-sm mt-1">Amsterdam, Nederland</p>
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                            <span className="flex items-center"><Laptop size={12} className="mr-1"/> Fast Wifi</span>
                            <span className="flex items-center"><Briefcase size={12} className="mr-1"/> Desk</span>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    </div>
  );
};

// --- INVESTBOTIQ ---
export const Investbotiq: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in bg-slate-900 min-h-[calc(100vh-6rem)] -m-8 p-8 text-slate-100">
        <div className="flex justify-between items-center border-b border-slate-800 pb-6">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-500 rounded-lg flex items-center justify-center">
                    <TrendingUp size={24} className="text-white"/>
                 </div>
                 <div>
                    <h1 className="text-2xl font-bold">INVESTBOTIQ</h1>
                    <p className="text-slate-400 text-sm">Automated Crypto & Stock Portfolio</p>
                 </div>
             </div>
             <div className="flex gap-2">
                 <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">Instellingen</Button>
                 <Button className="bg-indigo-600 hover:bg-indigo-700 border-none">Stort Geld</Button>
             </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm font-medium mb-1">Totale Waarde</p>
                <h2 className="text-4xl font-bold text-white mb-2">€ 12,450.32</h2>
                <span className="inline-flex items-center text-green-400 text-sm font-medium bg-green-400/10 px-2 py-1 rounded">
                    <ArrowUpRight size={14} className="mr-1" /> +5.2% (24u)
                </span>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm font-medium mb-1">Bot Status</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-lg font-bold text-white">Active Trading</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">Laatste trade: 5 min geleden (BTC/EUR)</p>
            </div>

            <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
                <p className="text-slate-400 text-sm font-medium mb-1">Winst deze maand</p>
                <h2 className="text-2xl font-bold text-white mb-2">+ € 842.00</h2>
                <ProgressBar progress={75} colorClass="bg-indigo-500" />
                <p className="text-right text-xs text-slate-400 mt-2">Doel: € 1,120.00</p>
            </div>
        </div>

        {/* Mock Chart Area */}
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700 h-64 flex items-center justify-center">
            <p className="text-slate-500 italic">Interactive Chart Visualization Placeholder</p>
            {/* Simple CSS Bars */}
            <div className="flex items-end gap-2 ml-4 h-32">
                {[40, 60, 45, 70, 85, 65, 90, 80, 95, 100, 90, 110].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-4 bg-indigo-500/50 hover:bg-indigo-500 rounded-t transition-colors"></div>
                ))}
            </div>
        </div>
    </div>
  );
};

// --- DJOBBA ---
export const Djobba: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center bg-purple-900 text-white p-8 rounded-2xl shadow-lg">
            <div>
                 <h1 className="text-3xl font-bold flex items-center gap-2 mb-2"><Search /> DJOBBA</h1>
                 <p className="text-purple-200">De interne marktplaats voor micro-taken en gigs.</p>
            </div>
            <div className="hidden md:block">
                 <Button className="bg-white text-purple-900 hover:bg-purple-50 border-none font-bold">Plaats een Gig</Button>
            </div>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2">
            {['Alles', 'Design', 'Vertaling', 'Development', 'Admin', 'Research'].map((cat, i) => (
                <button key={cat} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${i === 0 ? 'bg-purple-600 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-purple-50'}`}>
                    {cat}
                </button>
            ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[
                 { title: 'Logo Redesign voor Team Alpha', price: '€ 250', tags: ['Design', 'Spoed'] },
                 { title: 'Vertaling Contract NL-FR', price: '€ 75', tags: ['Vertaling'] },
                 { title: 'Data Entry Excel Sheet', price: '€ 40', tags: ['Admin'] },
                 { title: 'React Component Fix', price: '€ 100', tags: ['Dev', 'React'] }
             ].map((job, i) => (
                 <Card key={i} className="p-6 hover:border-purple-300 transition-colors cursor-pointer">
                     <div className="flex justify-between items-start mb-2">
                        <Badge variant="neutral">{job.tags[0]}</Badge>
                        <span className="font-bold text-lg text-purple-700">{job.price}</span>
                     </div>
                     <h3 className="font-bold text-slate-800 text-lg mb-2">{job.title}</h3>
                     <p className="text-slate-500 text-sm mb-4">Geplaatst door <span className="font-medium text-slate-700">Team Management</span> • 2 uur geleden</p>
                     <div className="flex gap-2">
                        {job.tags.map(t => <span key={t} className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded">{t}</span>)}
                     </div>
                 </Card>
             ))}
        </div>
    </div>
  );
};