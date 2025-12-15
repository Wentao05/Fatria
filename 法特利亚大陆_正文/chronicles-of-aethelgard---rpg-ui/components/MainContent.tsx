import { Settings2, Sparkles, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';

interface MainContentProps {
  chatLog: Message[];
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  mainText?: string;
}

interface TextSettings {
  width: number; // Percentage
  fontSize: number; // px
  letterSpacing: number; // px
  fontFamily: string; // Tailwnd class
}

export const MainContent: React.FC<MainContentProps> = ({ chatLog, isProcessing, mainText }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<TextSettings>({
    width: 85,
    fontSize: 14,
    letterSpacing: 0,
    fontFamily: 'font-serif'
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatLog]);

  return (
    <main className="basis-[56%] min-w-0 flex flex-col h-full bg-gradient-to-br from-[#0f1018cc] via-[#0b0d13cc] to-[#050507cc] rounded-2xl border border-[#2f3040] shadow-[0_20px_60px_rgba(0,0,0,0.65)] relative overflow-hidden mx-3 backdrop-blur-xl column-scroll">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] pointer-events-none"></div>

      {/* Header / Title */}
      <div className="p-4 border-b border-[#2f3040] bg-[#0c0e16bf] backdrop-blur-xl flex justify-between items-center z-10 shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
         <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[var(--gold-500)] animate-pulse-slow" />
            <h1 className="font-display text-[var(--gold-100)] text-lg tracking-[0.2em] drop-shadow-xl">命运轨迹</h1>
         </div>
         <button
           onClick={() => setShowSettings(!showSettings)}
           className={`p-2 rounded-lg border border-transparent hover:border-[var(--gold-500)] hover:bg-white/5 transition-all ${showSettings ? 'text-[var(--gold-300)]' : 'text-stone-400'}`}
         >
            <Settings2 size={18} />
         </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
         <div className="absolute top-16 right-4 z-20 w-64 bg-[#0f1018f2] border border-[var(--gold-700)]/40 rounded-xl p-4 shadow-[0_15px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl animate-slideUp">
            <div className="flex justify-between items-center mb-3 border-b border-[#2f3040] pb-2">
               <span className="text-xs font-display text-[var(--gold-100)] uppercase tracking-widest">阅读设置</span>
               <button onClick={() => setShowSettings(false)} className="text-stone-500 hover:text-stone-200"><X size={14}/></button>
            </div>

            <div className="space-y-4">
               {/* Width Control */}
               <div>
                  <label className="text-[10px] text-stone-400 uppercase block mb-1">文本宽度 ({settings.width}%)</label>
                  <input
                    type="range" min="50" max="100" step="5"
                    value={settings.width}
                    onChange={(e) => setSettings({...settings, width: parseInt(e.target.value)})}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
               </div>

               {/* Font Size Control */}
               <div>
                  <label className="text-[10px] text-stone-400 uppercase block mb-1">字体大小 ({settings.fontSize}px)</label>
                  <input
                    type="range" min="12" max="24" step="1"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({...settings, fontSize: parseInt(e.target.value)})}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
               </div>

               {/* Letter Spacing Control */}
               <div>
                  <label className="text-[10px] text-stone-400 uppercase block mb-1">字间距 ({settings.letterSpacing}px)</label>
                  <input
                    type="range" min="0" max="5" step="0.5"
                    value={settings.letterSpacing}
                    onChange={(e) => setSettings({...settings, letterSpacing: parseFloat(e.target.value)})}
                    className="w-full h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-gold-500"
                  />
               </div>

                {/* Font Family Control */}
               <div>
                  <label className="text-[10px] text-stone-400 uppercase block mb-1">字体风格</label>
                  <select
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({...settings, fontFamily: e.target.value})}
                    className="w-full bg-[#0b0d13] border border-[#2f3040] text-[var(--gold-100)] text-xs rounded p-1 focus:border-[var(--gold-500)] outline-none"
                  >
                     <option value="font-serif">衬线 (Serif)</option>
                     <option value="font-sans">无衬线 (Sans)</option>
                     <option value="font-mono">等宽 (Mono)</option>
                     <option value="font-display">展示 (Display)</option>
                  </select>
               </div>
            </div>
         </div>
      )}

      {/* Main Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar z-10 scroll-smooth">
        {mainText && (
          <div className="w-full flex justify-center">
            <div
              className={`
                bg-[#0b0d13e6] border border-[var(--gold-700)]/50 rounded-xl p-6
                shadow-[0_20px_60px_rgba(0,0,0,0.65)] backdrop-blur-xl
                ${settings.fontFamily}
              `}
              style={{
                width: `${settings.width}%`,
                maxWidth: '960px',
                fontSize: `${settings.fontSize}px`,
                letterSpacing: `${settings.letterSpacing}px`,
              }}
            >
              <div className="text-xs text-[var(--gold-300)] uppercase tracking-[0.25em] mb-3 flex items-center gap-2">
                <span className="w-6 h-[1px] bg-[var(--gold-500)]/60" />
                正文
                <span className="flex-1 h-[1px] bg-[var(--gold-500)]/30" />
              </div>
              <div className="whitespace-pre-wrap leading-7 text-[var(--gold-100)] drop-shadow">
                {mainText}
              </div>
            </div>
          </div>
        )}
        {!mainText && chatLog.map((msg, index) => (
          <div
            key={index}
            className={`flex flex-col items-center animate-fadeIn`}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {msg.role === 'system' && (
              <div className="w-full text-center my-4">
                 <span className="text-xs text-gold-700/60 font-mono border-b border-gold-900/30 pb-1 px-4">{msg.content}</span>
              </div>
            )}

            {msg.role !== 'system' && (
              <div
                className="flex flex-col w-full"
                style={{ width: `${settings.width}%` }}
              >
                 <span className={`text-[10px] text-stone-600 mb-1 px-1 uppercase tracking-wider font-bold ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.role === 'user' ? '你' : '地下城主 (DM)'}
                 </span>
                 <div
                   className={`
                     p-6 rounded-lg leading-relaxed shadow-lg text-left relative
                     ${msg.role === 'user'
                       ? 'bg-stone-900/90 text-stone-200 border border-stone-700'
                       : 'bg-gradient-to-br from-stone-950 to-black text-stone-300 border border-gold-900/40'}
                     ${settings.fontFamily}
                   `}
                   style={{
                     fontSize: `${settings.fontSize}px`,
                     letterSpacing: `${settings.letterSpacing}px`
                   }}
                 >
                    {msg.role === 'model' && (
                       // Corner accents for model messages
                       <>
                         <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gold-600/40"></div>
                         <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gold-600/40"></div>
                       </>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                 </div>
              </div>
            )}
          </div>
        ))}
        {!mainText && isProcessing && (
           <div className="flex justify-center p-4">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gold-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </main>
  );
};
