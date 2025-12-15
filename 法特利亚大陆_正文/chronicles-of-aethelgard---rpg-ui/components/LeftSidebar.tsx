import { MapPin, Skull, Zap } from 'lucide-react';
import React, { useRef, useState } from 'react';
import { Character, GameGlobal } from '../types';
import { Panel, StatBar } from './UI';

interface LeftSidebarProps {
  character: Character;
  global: GameGlobal;
  // 原始 mvu stat_data, 用于解析状态详情
  mvuStat: any | null;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ character, global, mvuStat }) => {
  const [avatarUrl, setAvatarUrl] = useState<string>('https://picsum.photos/200');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatarUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <aside className="basis-[22%] min-w-0 flex flex-col gap-4 h-full overflow-y-auto pr-3 custom-scrollbar column-scroll">
      {/* Global Info */}
      <Panel title="世界信息">
        <div className="flex flex-col gap-2 text-center">
          <p className="text-stone-300 font-serif text-sm">{global.date}</p>
          <div className="h-[1px] w-1/2 bg-gradient-to-r from-transparent via-gold-700/50 to-transparent mx-auto my-1"></div>
          <div className="flex items-center justify-center gap-1.5 text-gold-400">
             <MapPin size={12} className="shrink-0" />
             <p className="font-display text-xs tracking-wider">
               {global.location}
             </p>
          </div>
        </div>
      </Panel>

      {/* Character Core Identity */}
      <Panel>
        <div className="flex flex-col items-center gap-2 mb-4">
          <div
            className="w-20 h-20 rounded-full border-2 border-gold-600/50 shadow-[0_0_15px_rgba(212,165,42,0.2)] bg-stone-900 flex items-center justify-center overflow-hidden relative group cursor-pointer"
            onClick={handleAvatarClick}
            title="点击更换头像"
          >
             {/* Avatar Placeholder */}
             <img src={avatarUrl} alt="Character" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
             <div className="absolute inset-0 ring-inset ring-2 ring-black/40 rounded-full"></div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAvatarChange}
          />
          <h2 className="text-xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-b from-gold-100 to-gold-500 text-center">
            {character.name}
          </h2>
          <div className="flex flex-wrap justify-center gap-2 text-xs font-serif text-stone-400">
            <span className="px-2 py-0.5 bg-stone-900/80 border border-stone-700 rounded text-stone-300">{character.race}</span>
            <span className="px-2 py-0.5 bg-stone-900/80 border border-stone-700 rounded text-stone-300">{character.class}</span>
          </div>
        </div>

        {/* Status Text */}
        <StatusBlock mvuStat={mvuStat} />
      </Panel>

      {/* Combat Power */}
      <Panel title="战斗评估">
         <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col items-center p-2 bg-stone-900/40 rounded border border-stone-800">
               <Skull size={16} className="text-stone-400 mb-1" />
               <span className="text-[10px] text-stone-500 uppercase">肉身战力</span>
               <span className="text-xl font-display text-red-500 font-bold drop-shadow-md">{character.combatPower.physical}</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-stone-900/40 rounded border border-stone-800">
               <Zap size={16} className="text-purple-400 mb-1" />
               <span className="text-[10px] text-stone-500 uppercase">魔法战力</span>
               <span className="text-xl font-display text-purple-400 font-bold shadow-purple-500/20 drop-shadow">{character.combatPower.magical}</span>
            </div>
         </div>
      </Panel>

       {/* XP */}
       <Panel title="修炼进度">
        <div className="space-y-3">
          <StatBar
            label="锻体经验"
            value={character.experience.physical}
            max={character.experience.maxPhysical}
            color="amber"
            showValue
          />
          <StatBar
            label="魔法经验"
            value={character.experience.magical}
            max={character.experience.maxMagical}
            color="purple"
            showValue
          />
        </div>
      </Panel>
    </aside>
  );
};

const StatusBlock: React.FC<{ mvuStat: any | null }> = ({ mvuStat }) => {
  const root = mvuStat?.['主角']?.['状态'] ?? {};
  const entries =
    root && typeof root === 'object'
      ? Object.keys(root)
          .filter(key => key !== '$meta')
          .map(name => ({ name, ...(root[name] || {}) }))
      : [];

  if (!entries.length) {
    return (
      <div className="bg-stone-950/50 border border-stone-800 p-2 rounded text-center mb-2">
        <span className="text-xs text-stone-500 uppercase tracking-widest mr-2">当前状态</span>
        <span className="text-sm font-serif text-amber-200">状态良好</span>
      </div>
    );
  }

  return (
    <div className="bg-stone-950/50 border border-stone-800 p-2 rounded text-center mb-2">
      <span className="text-xs text-stone-500 uppercase tracking-widest mr-2">当前状态</span>
      <div className="mt-1 flex flex-wrap justify-center gap-1">
        {entries.map(entry => (
          <div
            key={entry.name}
            className="relative group px-2 py-0.5 rounded-full bg-stone-900/80 border border-stone-700 text-xs font-serif text-amber-200 cursor-help"
          >
            {entry.name}
            {/* Tooltip: 仅显示 描述 + 持续时间，向上延伸 */}
            <div className="absolute left-1/2 bottom-full z-40 mb-2 w-64 -translate-x-1/2 rounded-lg border border-stone-700 bg-stone-950 p-3 text-left text-xs text-stone-200 shadow-[0_10px_30px_rgba(0,0,0,0.7)] opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
              {entry.描述 && <p className="mb-1 leading-relaxed">{String(entry.描述)}</p>}
              {entry.持续时间 && (
                <p className="text-emerald-300">持续时间：{String(entry.持续时间)}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
