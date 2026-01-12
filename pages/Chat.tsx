import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Card, Button } from '../components/ui';
import { Send, Bot, User as UserIcon, Loader, Sparkles } from 'lucide-react';
import { User } from '../types';

interface ChatProps {
    user?: User;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export const Chat: React.FC<ChatProps> = ({ user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
        id: 'init', 
        role: 'model', 
        text: user 
            ? `Hoi ${user.firstName}! Ik ben je VVC AI-assistent. Waarmee kan ik je vandaag helpen?` 
            : 'Hallo! Ik ben de VVC AI-assistent. Hoe kan ik je vandaag helpen?' 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const aiClientRef = useRef<any>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize Chat Session
  useEffect(() => {
    if (!process.env.API_KEY) return;
    
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        aiClientRef.current = ai.chats.create({
          model: 'gemini-3-pro-preview',
          config: {
            systemInstruction: `Je bent een intelligente, behulpzame en professionele AI-assistent voor de Verdienende Vrienden Club (VVC).
            
            Jouw context:
            - VVC is een gamified werkplatform waar professionals missies voltooien voor levels en XP.
            - Huidige gebruiker: ${user ? `${user.firstName} ${user.lastName} (Level ${user.level}, Specialisatie: ${user.specializations.join(', ')})` : 'Gast'}.
            
            Jouw doelen:
            1. Help gebruikers met vragen over hun missies, status en inkomsten.
            2. Geef advies over hoe ze sneller kunnen levellen (XP verdienen).
            3. Beantwoord vragen over de VVC apps (Boastplug, WoningVrij, etc.).
            4. Blijf altijd beleefd, motiverend en 'on-brand' (professioneel maar benaderbaar).
            
            Antwoord beknopt en gebruik opmaak waar nodig.`,
          },
        });
    } catch (e) {
        console.error("Failed to init AI chat", e);
    }
  }, [user]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !aiClientRef.current || isLoading) return;

    const userMessageText = input;
    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', text: userMessageText };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const resultStream = await aiClientRef.current.sendMessageStream({ message: userMessageText });
      
      const modelMsgId = (Date.now() + 1).toString();
      // Add empty model message to start filling
      setMessages(prev => [...prev, { id: modelMsgId, role: 'model', text: '' }]);

      let fullText = '';
      for await (const chunk of resultStream) {
        const c = chunk as GenerateContentResponse;
        if (c.text) {
          fullText += c.text;
          setMessages(prev => prev.map(msg => 
            msg.id === modelMsgId ? { ...msg, text: fullText } : msg
          ));
        }
      }
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages(prev => [...prev, { 
          id: Date.now().toString(), 
          role: 'model', 
          text: 'Mijn excuses, ik ondervind momenteel verbindingsproblemen. Probeer het later opnieuw.',
          isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] animate-fade-in max-w-4xl mx-auto">
        <div className="flex-none mb-6">
             <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                 <Sparkles className="text-brand-600" /> VVC Assistent
             </h1>
             <p className="text-slate-500">Stel je vragen over het platform, missies of je voortgang.</p>
        </div>

        <Card className="flex-1 flex flex-col overflow-hidden border-slate-200 shadow-xl bg-white relative">
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth bg-slate-50/50">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start gap-3`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${msg.role === 'user' ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-brand-600'}`}>
                                {msg.role === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                            </div>
                            <div className={`p-4 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                msg.role === 'user' 
                                    ? 'bg-brand-600 text-white rounded-tr-none' 
                                    : msg.isError
                                        ? 'bg-red-50 text-red-800 border border-red-100 rounded-tl-none'
                                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    </div>
                ))}
                {isLoading && messages[messages.length-1].role === 'user' && (
                    <div className="flex justify-start">
                         <div className="flex items-center gap-3 max-w-[75%]">
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-200 text-brand-600 flex items-center justify-center shrink-0 shadow-sm">
                                <Loader size={16} className="animate-spin" />
                            </div>
                            <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex gap-1.5 items-center">
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                                 <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                            </div>
                         </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            <div className="p-4 bg-white border-t border-slate-100">
                <form onSubmit={handleSend} className="relative flex items-center gap-2">
                    <input 
                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl pl-4 pr-14 py-3.5 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all placeholder:text-slate-400 text-sm shadow-inner"
                        placeholder="Typ je bericht aan de assistent..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        autoFocus
                    />
                    <Button 
                        type="submit" 
                        className="absolute right-2 top-2 bottom-2 aspect-square p-0 w-10 h-auto rounded-lg flex items-center justify-center shadow-md hover:shadow-lg transition-all"
                        disabled={isLoading || !input.trim()} 
                    >
                        {isLoading ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
                    </Button>
                </form>
                <div className="mt-2 text-center">
                    <p className="text-[10px] text-slate-400 font-medium">Powered by Gemini 3 Pro Preview</p>
                </div>
            </div>
        </Card>
    </div>
  );
};