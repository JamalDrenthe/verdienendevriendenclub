import React from 'react';
import { Card, Button, Input, Badge } from '../components/ui';
import { Briefcase, MoreHorizontal, Phone, Mail, UserPlus, Gift, Copy, Share2, CheckCircle } from 'lucide-react';

// --- PROSPECTS ---
export const Prospects: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
             <div>
                <h1 className="text-2xl font-bold text-slate-800">Sales Prospects</h1>
                <p className="text-slate-500">Beheer je leads en potentiële klanten.</p>
            </div>
            <Button>+ Nieuwe Prospect</Button>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Naam</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Bedrijf</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Contact</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase">Actie</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {[
                        { name: 'Karel De Grote', company: 'Imperial BV', status: 'New', email: 'karel@imp.nl' },
                        { name: 'Sophie Visser', company: 'Ocean Tech', status: 'Contacted', email: 's.visser@ocean.com' },
                        { name: 'Mark Rutte', company: 'Torentje Inc.', status: 'Qualified', email: 'mark@gov.nl' },
                        { name: 'Ali B', company: 'Voice Media', status: 'Lost', email: 'ali@voice.nl' },
                    ].map((lead, i) => (
                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                            <td className="p-4 font-medium text-slate-800">{lead.name}</td>
                            <td className="p-4 text-slate-600">{lead.company}</td>
                            <td className="p-4">
                                <Badge variant={lead.status === 'New' ? 'info' : lead.status === 'Qualified' ? 'success' : lead.status === 'Lost' ? 'error' : 'warning'}>
                                    {lead.status}
                                </Badge>
                            </td>
                            <td className="p-4 flex gap-2 text-slate-400">
                                <Mail size={16} className="hover:text-brand-600 cursor-pointer"/>
                                <Phone size={16} className="hover:text-brand-600 cursor-pointer"/>
                            </td>
                            <td className="p-4 text-slate-400">
                                <MoreHorizontal size={18} className="cursor-pointer hover:text-slate-600" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

// --- TALENTS ---
export const Talents: React.FC = () => {
    return (
      <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
               <div>
                  <h1 className="text-2xl font-bold text-slate-800">Talent Pool</h1>
                  <p className="text-slate-500">Potentiële kandidaten voor VVC.</p>
              </div>
              <Button variant="secondary"><UserPlus size={18} className="mr-2"/> Talent Aandragen</Button>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                  <Card key={i} className="p-6 relative group">
                      <div className="absolute top-4 right-4">
                          <Badge variant="neutral">Open to Work</Badge>
                      </div>
                      <div className="flex flex-col items-center text-center">
                          <img src={`https://picsum.photos/100/100?random=${i+100}`} className="w-20 h-20 rounded-full mb-4 border-4 border-slate-50 shadow-sm" alt="Talent" />
                          <h3 className="font-bold text-lg text-slate-800">Kandidaat #{100+i}</h3>
                          <p className="text-sm text-slate-500 mb-4">Senior Frontend Developer</p>
                          <div className="flex flex-wrap gap-2 justify-center mb-6">
                              {['React', 'TypeScript', 'Node.js'].map(skill => (
                                  <span key={skill} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{skill}</span>
                              ))}
                          </div>
                          <Button variant="outline" size="sm" className="w-full">Bekijk Profiel</Button>
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    );
};

// --- REFERRAL ---
export const ReferralPage: React.FC = () => {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="text-center py-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-2xl text-white shadow-xl">
               <Gift size={64} className="mx-auto mb-4 text-white drop-shadow-md" />
               <h1 className="text-4xl font-extrabold mb-2">Nodig Vrienden Uit</h1>
               <p className="text-xl opacity-90 mb-8 max-w-lg mx-auto">Verdien <span className="font-bold bg-white/20 px-2 rounded">500 XP</span> en premium status voor elke vriend die een missie voltooit.</p>
               
               <div className="max-w-md mx-auto bg-white p-2 rounded-xl flex shadow-lg">
                   <div className="flex-1 px-4 flex items-center text-slate-500 font-mono text-sm bg-slate-50 rounded-lg mr-2 overflow-hidden whitespace-nowrap">
                       vvc.work/invite/sanne-8821
                   </div>
                   <Button className="shrink-0 bg-slate-900 hover:bg-slate-800 text-white">
                       <Copy size={18} className="mr-2"/> Kopieer
                   </Button>
               </div>
               
               <div className="flex justify-center gap-4 mt-8">
                   <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
                       <Share2 size={18} /> Deel via WhatsApp
                   </button>
                   <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-medium transition-colors">
                       <Mail size={18} /> Deel via Email
                   </button>
               </div>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-slate-800 mb-1">12</div>
                  <p className="text-slate-500 text-sm">Uitnodigingen Verstuurd</p>
              </Card>
              <Card className="p-6 text-center border-brand-200 border">
                  <div className="text-3xl font-bold text-brand-600 mb-1">3</div>
                  <p className="text-slate-500 text-sm">Leden Aangebracht</p>
              </Card>
              <Card className="p-6 text-center">
                  <div className="text-3xl font-bold text-gold-500 mb-1">1500</div>
                  <p className="text-slate-500 text-sm">XP Verdiend</p>
              </Card>
          </div>
  
          <h3 className="font-bold text-slate-800 text-lg mt-8">Jouw Referrals</h3>
          <div className="space-y-4">
              {[
                  { name: 'Peter Pan', date: '2 dagen geleden', status: 'Geregistreerd', xp: 0 },
                  { name: 'Wendy Darling', date: '1 week geleden', status: 'Actief (Lvl 2)', xp: 500 },
                  { name: 'Captain Hook', date: '3 weken geleden', status: 'Actief (Lvl 5)', xp: 500 },
              ].map((ref, i) => (
                  <Card key={i} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                              {ref.name.charAt(0)}
                          </div>
                          <div>
                              <p className="font-bold text-slate-800">{ref.name}</p>
                              <p className="text-xs text-slate-500">{ref.date}</p>
                          </div>
                      </div>
                      <div className="text-right">
                          <Badge variant={ref.xp > 0 ? 'success' : 'neutral'}>{ref.status}</Badge>
                          {ref.xp > 0 && <p className="text-xs text-gold-600 font-bold mt-1">+{ref.xp} XP verdiend</p>}
                      </div>
                  </Card>
              ))}
          </div>
      </div>
    );
  };