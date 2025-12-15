import {
  Backpack,
  BookOpen,
  Gem,
  GitMerge,
  Map as MapIcon,
  Newspaper,
  Scroll,
  Shield,
  Sword,
  Users,
} from 'lucide-react';
import React from 'react';
import { Character, EquipmentItem, ModalType, NewsItem } from '../types';
import { GoldButton, Panel } from './UI';

interface RightSidebarProps {
  character: Character;
  news: NewsItem[];
  onOpenModal: (type: ModalType) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ character, news, onOpenModal }) => {
  return (
    <aside className="basis-[22%] min-w-0 flex flex-col gap-4 h-full overflow-y-auto pl-3 custom-scrollbar column-scroll">
      {/* Interaction Buttons Grid */}
      <Panel title="行动">
        <div className="grid grid-cols-2 gap-2">
          <GoldButton onClick={() => onOpenModal('INVENTORY')} icon={<Backpack size={16} />}>
            背包
          </GoldButton>
          <GoldButton onClick={() => onOpenModal('SKILLS')} icon={<BookOpen size={16} />}>
            技能
          </GoldButton>
          <GoldButton onClick={() => onOpenModal('QUESTS')} icon={<Scroll size={16} />}>
            任务
          </GoldButton>
          <GoldButton onClick={() => onOpenModal('SOCIAL')} icon={<Users size={16} />}>
            社交
          </GoldButton>
          <div className="col-span-2">
            <GoldButton onClick={() => onOpenModal('PARALLEL_EVENTS')} icon={<GitMerge size={16} />}>
              并行事件条目
            </GoldButton>
          </div>
          <div className="col-span-2 mt-2 border-t border-stone-800 pt-2">
            <GoldButton
              onClick={() => onOpenModal('MAP')}
              icon={<MapIcon size={16} />}
              className="border-gold-500 text-gold-300"
            >
              世界地图
            </GoldButton>
          </div>
        </div>
      </Panel>

      {/* Quick Equipment View */}
      <Panel title="当前装备">
        <div className="space-y-3 text-sm">
          <EquipmentRow
            label="主武器"
            item={character.equipment.weapon}
            icon={<Sword size={16} className="text-red-400" />}
          />
          <EquipmentRow
            label="防具"
            item={character.equipment.armor}
            icon={<Shield size={16} className="text-blue-400" />}
          />
          <EquipmentRow
            label="饰品"
            item={character.equipment.accessory}
            icon={<Gem size={16} className="text-purple-400" />}
          />
        </div>
      </Panel>

      {/* Currency */}
      <Panel>
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-600 shadow-[0_0_5px_gold]"></div>
            <span className="text-gold-200 font-mono">{character.currency.gold}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-slate-300 to-slate-500"></div>
            <span className="text-slate-300 font-mono">{character.currency.silver}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-br from-orange-400 to-orange-800"></div>
            <span className="text-orange-400 font-mono">{character.currency.copper}</span>
          </div>
        </div>
      </Panel>

      {/* News Ticker */}
      <Panel title="世界见闻" className="flex-grow">
        <div className="flex items-center gap-2 mb-2 text-gold-600/60">
          <Newspaper size={14} />
          <span className="text-[10px]">实时情报</span>
        </div>
        <div className="flex flex-col gap-3 max-h-[200px] overflow-hidden relative">
          {news.map(item => (
            <div key={item.id} className="pb-2 border-b border-stone-800/50 last:border-0">
              <span className="text-[10px] text-stone-600 font-mono block mb-0.5">{item.time}</span>
              <p className="text-xs text-stone-400 font-serif leading-relaxed hover:text-stone-200 transition-colors cursor-default">
                {item.content}
              </p>
            </div>
          ))}
          {/* Fade out at bottom */}
          <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-stone-950/90 to-transparent pointer-events-none"></div>
        </div>
      </Panel>
    </aside>
  );
};

const EquipmentRow: React.FC<{ label: string; item: EquipmentItem | null; icon: React.ReactNode }> = ({
  label,
  item,
  icon,
}) => {
  return (
    <div className="flex items-start gap-3 group relative cursor-help">
      <div className="p-2 bg-stone-900 border border-stone-700 rounded transition-colors group-hover:border-gold-600/50">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] text-stone-500 uppercase tracking-wider">{label}</span>
        <span className="text-stone-300 font-serif group-hover:text-gold-200 transition-colors">
          {item ? item.name : '无'}
        </span>
      </div>

      {/* Tooltip */}
      {item && (
        <div className="absolute bottom-full left-0 mb-2 w-48 p-3 z-50 rounded bg-stone-950 border border-gold-700/50 shadow-[0_0_15px_rgba(0,0,0,0.8)] opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <h4 className="text-gold-300 font-display text-xs mb-1 border-b border-stone-800 pb-1">{item.name}</h4>
          <p className="text-[10px] text-stone-400 font-serif leading-relaxed">{item.description}</p>
          {/* Tooltip Arrow */}
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-stone-950 border-b border-r border-gold-700/50 rotate-45"></div>
        </div>
      )}
    </div>
  );
};
