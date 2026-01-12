import React, { useState, useEffect, useRef } from 'react';
import { User, Lock, Mail, ArrowRight, ShieldCheck, ChevronLeft, Terminal, Cpu, ScanLine, Sun, Monitor, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface AuthProps {
  onLogin: () => void;
}

type AuthView = 'LOGIN' | 'REGISTER' | 'FORGOT';

// --- COMPONENTS ---

// Reusable Tech Input Component (Defined outside to prevent re-renders)
const TechInput = ({ icon: Icon, label, ...props }: any) => (
  <div className="mb-5 group">
    <label className="block text-xs font-mono text-cyan-600/80 mb-1.5 uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-cyan-700 group-focus-within:text-cyan-400 transition-colors">
        <Icon size={18} />
      </div>
      <input
        {...props}
        className="block w-full bg-slate-900/60 border border-slate-700 rounded-lg py-3 pl-11 pr-4 text-cyan-100 placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono text-sm shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)] group-hover:border-slate-600"
      />
      {/* Corner Accents */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-500/0 group-focus-within:border-cyan-500/100 transition-all rounded-tl-sm pointer-events-none"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-500/0 group-focus-within:border-cyan-500/100 transition-all rounded-br-sm pointer-events-none"></div>
    </div>
  </div>
);

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [view, setView] = useState<AuthView>('LOGIN');
  const [loading, setLoading] = useState(false);
  const [scanLinePos, setScanLinePos] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme, setTheme } = useTheme();

  // Form State
  const [formData, setFormData] = useState({
      email: '',
      password: '',
      firstName: '',
      lastName: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- CANVAS ANIMATION LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    let animationFrameId: number;

    // Mouse interaction
    const mouse = { x: -1000, y: -1000 };
    const handleMouseMove = (e: MouseEvent) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Particle Config
    const particleCount = Math.min(80, (width * height) / 15000); // Responsive count
    const connectionDistance = 180;
    const particles: Particle[] = [];

    class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;

        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Slow movement
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            // Cyan/Blue mix
            this.color = Math.random() > 0.5 ? 'rgba(6, 182, 212,' : 'rgba(59, 130, 246,'; 
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx!.beginPath();
            ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx!.fillStyle = this.color + ' 0.6)';
            ctx!.fill();
        }
    }

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    const animate = () => {
        ctx.clearRect(0, 0, width, height);
        
        // Background gradient simulation (Deep space/tech)
        const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, width);
        gradient.addColorStop(0, '#0f172a'); // Slate 900
        gradient.addColorStop(1, '#020617'); // Slate 950
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Grid (Subtle)
        ctx.strokeStyle = 'rgba(6, 182, 212, 0.03)';
        ctx.lineWidth = 1;
        const gridSize = 50;
        // Vertical lines
        for(let x = 0; x < width; x += gridSize) {
             ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
        }
        // Horizontal lines
        for(let y = 0; y < height; y += gridSize) {
             ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
        }

        // Update & Draw Particles & Connections
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    // Opacity based on distance
                    const opacity = 1 - (distance / connectionDistance);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${opacity * 0.2})`; // Cyan lines
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Connection to Mouse
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const mouseDist = Math.sqrt(dx*dx + dy*dy);
            if (mouseDist < 250) {
                 ctx.beginPath();
                 const opacity = 1 - (mouseDist / 250);
                 ctx.strokeStyle = `rgba(59, 130, 246, ${opacity * 0.4})`; // Blue interaction lines
                 ctx.lineWidth = 1;
                 ctx.moveTo(p.x, p.y);
                 ctx.lineTo(mouse.x, mouse.y);
                 ctx.stroke();
            }
        });

        animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('resize', handleResize);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- UI ANIMATION ---
  useEffect(() => {
    const interval = setInterval(() => {
        setScanLinePos(prev => (prev + 1) % 100);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API boot sequence
    setTimeout(() => {
      setLoading(false);
      onLogin();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden font-mono selection:bg-cyan-500/30">
      
      {/* 1. Dynamic Canvas Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* 2. Ambient Overlay Gradients (for depth) */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/20 to-slate-950/80 z-0 pointer-events-none"></div>

      {/* Theme Toggles (Top Right) */}
      <div className="absolute top-6 right-6 z-50 flex gap-2">
         <button 
            onClick={() => setTheme('default')}
            className={`p-2.5 rounded-lg border backdrop-blur-sm transition-all duration-300 ${theme === 'default' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' : 'bg-slate-900/40 border-slate-700 text-slate-500 hover:text-cyan-400 hover:border-cyan-500/50'}`}
            title="System Default"
         >
             <Sun size={18} />
         </button>
         <button 
            onClick={() => setTheme('matrix')}
            className={`p-2.5 rounded-lg border backdrop-blur-sm transition-all duration-300 ${theme === 'matrix' ? 'bg-green-500/20 border-green-500 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'bg-slate-900/40 border-slate-700 text-slate-500 hover:text-green-400 hover:border-green-500/50'}`}
            title="Matrix Protocol"
         >
             <Monitor size={18} />
         </button>
         <button 
            onClick={() => setTheme('rose')}
            className={`p-2.5 rounded-lg border backdrop-blur-sm transition-all duration-300 ${theme === 'rose' ? 'bg-rose-500/20 border-rose-500 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-slate-900/40 border-slate-700 text-slate-500 hover:text-rose-400 hover:border-rose-500/50'}`}
            title="Rose Gold Access"
         >
             <Heart size={18} />
         </button>
      </div>

      {/* --- MAIN INTERFACE --- */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Top Connector Decor */}
        <div className="flex justify-center mb-6 opacity-80">
            <div className="h-8 w-px bg-gradient-to-b from-transparent to-cyan-500"></div>
        </div>

        {/* Holo Card Container */}
        <div className="bg-slate-900/70 backdrop-blur-md border border-cyan-900/50 rounded-2xl p-1 shadow-[0_0_60px_-15px_rgba(6,182,212,0.15)] relative overflow-hidden group">
            
            {/* Tech Border Container */}
            <div className="absolute inset-0 border border-cyan-500/20 rounded-2xl pointer-events-none"></div>
            
            {/* Scanning Line Animation */}
            <div 
                className="absolute left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent pointer-events-none z-20"
                style={{ top: `${scanLinePos}%`, opacity: 0.3 }}
            ></div>

            <div className="bg-slate-950/60 rounded-xl p-8 relative overflow-hidden">
                
                {/* Header */}
                <div className="text-center mb-8 relative">
                    <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 -z-10"></div>
                    <div className="inline-block bg-slate-950/80 px-4 relative backdrop-blur-sm rounded">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.2)] mx-auto mb-2 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cyan-500/5 animate-pulse"></div>
                            <span className="text-3xl font-bold text-cyan-400 relative z-10 drop-shadow-[0_0_5px_rgba(6,182,212,0.8)]">V</span>
                            
                            {/* Micro details */}
                            <div className="absolute top-1 left-1 w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                            <div className="absolute top-1 right-1 w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                            <div className="absolute bottom-1 left-1 w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                            <div className="absolute bottom-1 right-1 w-1 h-1 bg-cyan-500/50 rounded-full"></div>
                        </div>
                    </div>
                    <h1 className="text-xl font-bold text-white tracking-widest mt-2 font-mono">SYSTEM ACCESS</h1>
                    <div className="flex items-center justify-center gap-2 mt-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></span>
                        <p className="text-cyan-600 text-[10px] uppercase tracking-[0.2em]">VVC Mainframe v2.4</p>
                    </div>
                </div>

                {/* LOGIN VIEW */}
                {view === 'LOGIN' && (
                    <form onSubmit={handleSubmit} className="animate-fade-in relative z-10">
                        <TechInput 
                            label="Identification" 
                            name="email"
                            type="email" 
                            placeholder="USR.NAME@VVC.NET" 
                            icon={User} 
                            value={formData.email}
                            onChange={handleChange}
                            required 
                        />
                        <div className="mb-6">
                            <TechInput 
                                label="Security Key" 
                                name="password"
                                type="password" 
                                placeholder="••••••••••••" 
                                icon={Lock} 
                                value={formData.password}
                                onChange={handleChange}
                                required 
                            />
                            <div className="flex justify-end -mt-3">
                                <button 
                                    type="button" 
                                    onClick={() => setView('FORGOT')} 
                                    className="text-[10px] text-cyan-600 hover:text-cyan-400 uppercase tracking-wider transition-colors"
                                >
                                    Recover Access?
                                </button>
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] hover:-translate-y-0.5 relative overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? 'AUTHENTICATING...' : (
                                    <>INITIALIZE SESSION <ArrowRight size={16} /></>
                                )}
                            </span>
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                        </button>

                        <div className="text-center mt-6 pt-6 border-t border-slate-800">
                            <p className="text-slate-500 text-xs mb-2">NO CREDENTIALS FOUND?</p>
                            <button 
                                type="button" 
                                onClick={() => setView('REGISTER')} 
                                className="text-sm font-bold text-cyan-400 hover:text-cyan-300 border border-cyan-900/50 hover:border-cyan-500/50 bg-slate-900/50 px-4 py-2 rounded transition-all w-full flex items-center justify-center gap-2"
                            >
                                <Cpu size={14} /> REQUEST ACCESS
                            </button>
                        </div>
                    </form>
                )}

                {/* REGISTER VIEW */}
                {view === 'REGISTER' && (
                    <form onSubmit={handleSubmit} className="animate-fade-in relative z-10">
                        <div className="grid grid-cols-2 gap-4 mb-1">
                             <TechInput label="First Name" name="firstName" placeholder="JAN" icon={Terminal} required />
                             <TechInput label="Last Name" name="lastName" placeholder="JANSEN" icon={Terminal} required />
                        </div>
                        <TechInput label="Email Node" name="email" type="email" placeholder="NAAM@BEDRIJF.NL" icon={Mail} required />
                        <TechInput label="Set Password" name="password" type="password" placeholder="MIN 8 CHARS" icon={ShieldCheck} required />
                        
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3.5 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] transition-all hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] mt-2 relative overflow-hidden group"
                        >
                            <span className="relative z-10">{loading ? 'PROCESSING...' : 'ESTABLISH LINK'}</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shine"></div>
                        </button>

                        <div className="text-center mt-4">
                            <button 
                                type="button" 
                                onClick={() => setView('LOGIN')} 
                                className="text-xs text-slate-500 hover:text-cyan-400 flex items-center justify-center gap-1 mx-auto transition-colors"
                            >
                                <ChevronLeft size={12} /> BACK TO LOGIN
                            </button>
                        </div>
                    </form>
                )}
                
                {/* FORGOT PASSWORD VIEW */}
                {view === 'FORGOT' && (
                    <form className="animate-fade-in relative z-10 text-center">
                        <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 text-cyan-500 border border-cyan-900/50 shadow-[0_0_10px_rgba(6,182,212,0.2)]">
                            <ScanLine size={24} />
                        </div>
                        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
                            ENTER YOUR REGISTERED EMAIL NODE.<br/>WE WILL TRANSMIT A RECOVERY SEQUENCE.
                        </p>
                        <TechInput label="Recovery Email" name="email" type="email" placeholder="NAAM@BEDRIJF.NL" icon={Mail} required />
                        
                        <button 
                            type="button" 
                            className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-cyan-900/50 font-bold py-3 rounded-lg transition-all mb-4"
                        >
                            TRANSMIT LINK
                        </button>
                        
                        <button 
                            type="button" 
                            onClick={() => setView('LOGIN')} 
                            className="text-xs text-slate-500 hover:text-cyan-400 transition-colors"
                        >
                            ABORT RECOVERY
                        </button>
                    </form>
                )}

            </div>
            
            {/* Decorative bottom barcode/data */}
            <div className="h-2 bg-slate-900 mt-[1px] flex gap-1 justify-center opacity-30">
                {[...Array(20)].map((_, i) => (
                    <div key={i} className={`h-full w-${Math.random() > 0.5 ? '1' : '2'} bg-cyan-500`}></div>
                ))}
            </div>
        </div>

        {/* Footer Status */}
        <div className="mt-8 text-center space-y-1">
            <p className="text-[10px] text-slate-600 font-mono">SECURE CONNECTION ESTABLISHED</p>
            <p className="text-[10px] text-slate-700 font-mono">ENCRYPTION: AES-256-GCM // NODE: EU-WEST-4</p>
        </div>

      </div>
    </div>
  );
};