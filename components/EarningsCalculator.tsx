import React, { useState, useMemo } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Calculator, Users, Phone, TrendingUp, Info, Wallet, Briefcase, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, Button, Badge } from './ui';

export const EarningsCalculator: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  // State voor user inputs
  const [hoursPerWeek, setHoursPerWeek] = useState(20);
  const [placementsPerMonth, setPlacementsPerMonth] = useState(10); 

  // Constanten volgens de VVC regels
  const HOURLY_RATE = 30; // Euro per uur tijdens bellen
  const PLACEMENT_BONUS = 300; // Euro per plaatsing
  const PASSIVE_INCOME_PER_USER = 25; // Euro per maand passief

  // Berekeningen
  const monthlyBaseSalary = hoursPerWeek * 4 * HOURLY_RATE;
  const monthlyBonus = placementsPerMonth * PLACEMENT_BONUS;
  
  // Data genereren voor de grafiek (12 maanden projectie)
  const chartData = useMemo(() => {
    let data = [];
    let accumulatedPlacements = 0;

    for (let month = 1; month <= 12; month++) {
      accumulatedPlacements += placementsPerMonth;
      
      const passiveIncome = accumulatedPlacements * PASSIVE_INCOME_PER_USER;
      const totalMonthlyIncome = monthlyBaseSalary + monthlyBonus + passiveIncome;

      data.push({
        name: `Mnd ${month}`,
        Uurloon: monthlyBaseSalary,
        Bonussen: monthlyBonus,
        Passief: passiveIncome,
        Totaal: totalMonthlyIncome,
        Accumulated: accumulatedPlacements
      });
    }
    return data;
  }, [hoursPerWeek, placementsPerMonth, monthlyBaseSalary, monthlyBonus]);

  // Totalen na 1 jaar
  const yearEndMonthlyIncome = chartData[11].Totaal;
  const totalYearEarnings = chartData.reduce((acc, curr) => acc + curr.Totaal, 0);
  const totalVrienden = placementsPerMonth * 12;

  // Helper voor valuta opmaak
  const formatEuro = (amount: number) => {
    return new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
  };

  return (
    <Card className="p-0 overflow-hidden shadow-lg border-t-4 border-t-gold-500 transition-all duration-300">
        <div className="p-6 md:p-8">
            <div 
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer select-none group"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2 group-hover:text-brand-600 transition-colors">
                        <Calculator className="text-brand-600" /> Verdiensten Calculator
                    </h2>
                    <p className="text-slate-500">Projecteer je inkomsten op basis van uren en plaatsingen.</p>
                </div>
                <div className="flex gap-4 items-center self-end md:self-center">
                    <Badge variant="warning">Beta Feature</Badge>
                    <div className="p-2 rounded-full hover:bg-slate-100 transition-colors">
                        {isExpanded ? <ChevronUp size={24} className="text-slate-400" /> : <ChevronDown size={24} className="text-slate-400" />}
                    </div>
                </div>
            </div>

            {isExpanded && (
                <div className="mt-8 animate-fade-in">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Inputs Column */}
                        <div className="space-y-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
                            {/* Slider: Hours */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="flex items-center text-slate-700 font-bold text-xs uppercase tracking-wider">
                                        <Phone size={14} className="mr-2 text-brand-600" /> Beluren / Week
                                    </label>
                                    <span className="text-2xl font-black text-brand-600">{hoursPerWeek}u</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="40"
                                    step="1"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 hover:accent-brand-500 transition-all"
                                />
                            </div>

                            {/* Slider: Placements */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <label className="flex items-center text-slate-700 font-bold text-xs uppercase tracking-wider">
                                        <Users size={14} className="mr-2 text-brand-600" /> Plaatsingen / Maand
                                    </label>
                                    <span className="text-2xl font-black text-brand-600">{placementsPerMonth}</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="50"
                                    step="1"
                                    value={placementsPerMonth}
                                    onChange={(e) => setPlacementsPerMonth(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600 hover:accent-brand-500 transition-all"
                                />
                            </div>

                            {/* Breakdown Box */}
                            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cashflow Maand 1</h3>
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Basisloon</span>
                                        <span className="font-bold text-slate-800">{formatEuro(monthlyBaseSalary)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Bonussen</span>
                                        <span className="font-bold text-slate-800">{formatEuro(monthlyBonus)}</span>
                                    </div>
                                    <div className="border-t border-slate-100 my-2 pt-2 flex justify-between text-lg font-black text-brand-600">
                                        <span>Totaal</span>
                                        <span>{formatEuro(monthlyBaseSalary + monthlyBonus)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Chart & Results Column */}
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-gold-500 text-white p-5 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={64}/></div>
                                    <div className="relative z-10">
                                        <div className="text-yellow-100 text-xs font-bold uppercase tracking-widest mb-1">Inkomen in Maand 12</div>
                                        <div className="text-3xl font-black">{formatEuro(yearEndMonthlyIncome)}</div>
                                        <div className="mt-2 text-sm font-medium bg-black/10 inline-block px-2 py-1 rounded">
                                            + {formatEuro(chartData[11].Passief)} passief / mnd
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bg-slate-800 text-white p-5 rounded-xl shadow-md flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-4 opacity-10"><Wallet size={64}/></div>
                                    <div className="relative z-10">
                                        <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Jaartotaal (Jaar 1)</div>
                                        <div className="text-3xl font-black">{formatEuro(totalYearEarnings)}</div>
                                        <div className="mt-2 text-sm font-medium text-slate-300">
                                            Netwerk: {totalVrienden} leden
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-grow bg-slate-50 rounded-xl border border-slate-200 p-4 min-h-[300px]">
                                <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">Inkomensgroei Projectie</h3>
                                <ResponsiveContainer width="100%" height={250}>
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="gradPassief" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-gold-500)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--color-gold-500)" stopOpacity={0.1}/>
                                            </linearGradient>
                                            <linearGradient id="gradBonus" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="var(--color-brand-500)" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="var(--color-brand-500)" stopOpacity={0.1}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border-med)" />
                                        <XAxis 
                                            dataKey="name" 
                                            stroke="var(--color-text-muted)" 
                                            fontSize={10} 
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                        />
                                        <YAxis 
                                            stroke="var(--color-text-muted)" 
                                            fontSize={10} 
                                            fontWeight={600}
                                            tickLine={false}
                                            axisLine={false}
                                            tickFormatter={(value) => `€${value/1000}k`}
                                        />
                                        <Tooltip 
                                            contentStyle={{ 
                                                backgroundColor: 'var(--color-bg-card)', 
                                                borderColor: 'var(--color-border-med)', 
                                                borderRadius: '12px',
                                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                            }}
                                            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
                                            formatter={(value: number) => formatEuro(value)}
                                        />
                                        <Area type="monotone" dataKey="Uurloon" stackId="1" stroke="none" fill="var(--color-text-strong)" fillOpacity={0.8} name="Basis" />
                                        <Area type="monotone" dataKey="Bonussen" stackId="1" stroke="none" fill="url(#gradBonus)" name="Bonussen" />
                                        <Area type="monotone" dataKey="Passief" stackId="1" stroke="var(--color-gold-600)" fill="url(#gradPassief)" name="Passief" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex gap-4 p-4 bg-brand-50 rounded-lg border border-brand-100 text-sm text-brand-900">
                        <Info className="shrink-0 text-brand-600" size={20} />
                        <p>
                            <strong>Model uitleg:</strong> Elke plaatsing levert direct <strong>€300,-</strong> op én genereert <strong>€25,-/maand</strong> passief inkomen zolang het lid actief blijft. 
                            Bij {placementsPerMonth} plaatsingen/maand groeit je passieve inkomen met {formatEuro(placementsPerMonth * 25)} per maand.
                        </p>
                    </div>
                </div>
            )}
        </div>
    </Card>
  );
};