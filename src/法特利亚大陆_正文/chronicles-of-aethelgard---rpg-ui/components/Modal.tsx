import { Book, GitMerge, Package, Sword, X } from 'lucide-react';
import React, { useState } from 'react';
import { Character, InventoryItem, ModalType } from '../types';

interface ModalProps {
  isOpen: boolean;
  type: ModalType;
  onClose: () => void;
  character: Character;
  mvuStat: any | null;
  isFullscreen: boolean;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, type, onClose, character, mvuStat, isFullscreen }) => {
  if (!isOpen || !type) return null;

  const isMap = type === 'MAP';

  const getTitle = () => {
    switch (type) {
      case 'INVENTORY':
        return '冒险者背包';
      case 'SKILLS':
        return '技能与法术书';
      case 'QUESTS':
        return '委托与使命';
      case 'SOCIAL':
        return '人际关系';
      case 'NEWS':
        return '大陆见闻录';
      case 'MAP':
        return '世界地图';
      case 'PARALLEL_EVENTS':
        return '并行时空观测';
      default:
        return '';
    }
  };

  const renderContent = () => {
    switch (type) {
      case 'INVENTORY':
        return <InventoryView items={character.inventory} />;
      case 'SKILLS':
        return <SkillsView mvuStat={mvuStat} />;
      case 'QUESTS':
        return <QuestsView mvuStat={mvuStat} />;
      case 'SOCIAL':
        return <SocialView mvuStat={mvuStat} />;
      case 'MAP':
        return <MapView showGrid={isFullscreen} />;
      case 'PARALLEL_EVENTS':
        return <ParallelEventsView mvuStat={mvuStat} />;
      case 'NEWS':
        return <div className="text-stone-400">新闻详细内容...</div>;
      default:
        return null;
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${isMap ? 'p-0' : 'p-4'}`}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div
        className={`
        relative bg-stone-950 border border-gold-700/40 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-slideUp
        ${isMap ? 'w-full h-full rounded-none border-none' : 'w-full max-w-4xl h-[85vh] rounded-lg'}
      `}
      >
        {/* Decorative Border Glow */}
        {!isMap && (
          <div className="absolute inset-0 pointer-events-none box-border border border-gold-500/10 rounded-lg"></div>
        )}

        {/* Header */}
        {!isMap && (
          <div className="flex justify-between items-center p-6 border-b border-gold-900/30 bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] bg-stone-900 shrink-0">
            <div className="flex flex-col">
              <h2 className="text-2xl font-display text-gold-200 tracking-widest uppercase">{getTitle()}</h2>
              <span className="text-xs text-stone-500 font-mono mt-1">SYSTEM_MODULE_LOADED // {type}</span>
            </div>
            <button
              onClick={onClose}
              className="text-stone-500 hover:text-gold-400 transition-colors p-2 rounded hover:bg-stone-800"
            >
              <X size={24} />
            </button>
          </div>
        )}

        {/* Map Header (Overlay) */}
        {isMap && (
          <button
            onClick={onClose}
            className="absolute top-6 right-6 z-50 text-stone-300 hover:text-white bg-black/50 p-3 rounded-full backdrop-blur hover:bg-black/80 transition-all"
          >
            <X size={32} />
          </button>
        )}

        {/* Body */}
        <div
          className={`flex-1 overflow-hidden bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black ${isMap ? 'p-0' : 'p-6'}`}
        >
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components for Specific Views ---

const InventoryView: React.FC<{ items: InventoryItem[] }> = ({ items }) => {
  const totalSlots = 25;

  const getQualityColor = (quality: string) => {
    const q = String(quality);
    if (q.includes('传说') || q.toLowerCase().includes('legend')) return 'text-orange-400';
    if (q.includes('史诗') || q.toLowerCase().includes('epic')) return 'text-purple-400';
    if (q.includes('稀有') || q.toLowerCase().includes('rare')) return 'text-blue-400';
    if (q.includes('优秀') || q.includes('精良') || q.toLowerCase().includes('uncommon')) return 'text-green-400';
    return 'text-stone-300';
  };

  const getBorderColor = (quality: string) => {
    const q = String(quality);
    if (q.includes('传说') || q.toLowerCase().includes('legend')) return 'group-hover:border-orange-600/50';
    if (q.includes('史诗') || q.toLowerCase().includes('epic')) return 'group-hover:border-purple-600/50';
    if (q.includes('稀有') || q.toLowerCase().includes('rare')) return 'group-hover:border-blue-600/50';
    if (q.includes('优秀') || q.includes('精良') || q.toLowerCase().includes('uncommon'))
      return 'group-hover:border-green-600/50';
    return 'group-hover:border-gold-600/50';
  };

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      <div className="grid grid-cols-5 gap-4">
        {Array.from({ length: totalSlots }).map((_, index) => {
          const item = items[index];
          const col = index % 5;
          const tooltipAlignClass = col <= 1 ? 'left-0' : col >= 3 ? 'right-0' : 'left-1/2 -translate-x-1/2';
          const arrowAlignClass = col <= 1 ? 'left-6' : col >= 3 ? 'right-6' : 'left-1/2 -translate-x-1/2';
          return (
            <div
              key={index}
              className={`aspect-square bg-stone-900/50 border border-stone-800 rounded-md relative group transition-colors cursor-help ${item ? getBorderColor(item.quality) : ''}`}
            >
              {item ? (
                <>
                  <div className="flex flex-col items-center justify-center h-full p-2 text-center">
                    <Package size={24} className={`${getQualityColor(item.quality)} mb-2 drop-shadow-md`} />
                    <span
                      className={`text-[10px] font-serif leading-tight line-clamp-2 ${getQualityColor(item.quality)}`}
                    >
                      {item.name}
                    </span>
                    <span className="absolute bottom-1 right-1 text-[9px] font-mono text-stone-500">
                      x{item.quantity}
                    </span>
                    <div className="absolute inset-0 bg-gold-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-md pointer-events-none"></div>
                  </div>

                  {/* Enhanced Tooltip - extend downward, always above other UI */}
                  <div
                    className={`
                      absolute top-full mt-3 w-64 p-4 z-[60] rounded-lg bg-stone-950 border border-gold-700/50
                      shadow-[0_0_25px_rgba(0,0,0,0.9)] opacity-0 group-hover:opacity-100 pointer-events-none
                      transition-all duration-200 -translate-y-2 group-hover:translate-y-0
                      ${tooltipAlignClass}
                    `}
                  >
                    <div className="flex justify-between items-start border-b border-stone-800 pb-2 mb-2">
                      <h4 className={`font-display text-sm font-bold ${getQualityColor(item.quality)}`}>{item.name}</h4>
                      <span className="text-[10px] px-1.5 py-0.5 bg-stone-900 border border-stone-800 rounded text-stone-400">
                        {item.type}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs font-serif text-stone-400">
                      <p className="leading-relaxed italic">"{item.description}"</p>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div className="bg-stone-900/50 p-1.5 rounded border border-stone-800/50">
                          <span className="text-[9px] text-stone-600 uppercase block">品质</span>
                          <span className={getQualityColor(item.quality)}>{item.quality}</span>
                        </div>
                        <div className="bg-stone-900/50 p-1.5 rounded border border-stone-800/50">
                          <span className="text-[9px] text-stone-600 uppercase block">数量</span>
                          <span className="text-stone-200">{item.quantity}</span>
                        </div>
                      </div>
                      {item.effect && (
                        <div className="text-green-400/90 mt-1">
                          <span className="text-[9px] text-green-700/70 uppercase mr-1">效果</span>
                          {item.effect}
                        </div>
                      )}
                    </div>
                    {/* Arrow (pointing up from tooltip to slot) */}
                    <div
                      className={`
                          absolute -top-1 w-3 h-3 bg-stone-950 border-t border-l border-gold-700/50 rotate-45
                          ${arrowAlignClass}
                        `}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                  <div className="w-2 h-2 rounded-full bg-stone-800"></div>
                </div>
              )}
              <span className="absolute top-1 left-1 text-[8px] text-stone-700 font-mono">{index + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const SkillsView: React.FC<{ mvuStat: any | null }> = ({ mvuStat }) => {
  const [activeTab, setActiveTab] = useState<'physical' | 'magical'>('physical');

  const grouped = (() => {
    try {
      const root = mvuStat?.['主角']?.['技能列表'] ?? {};
      const entries = Object.keys(root || {}).filter(k => k !== '$meta');

      const levelToRank = (level: string | undefined): string => {
        if (!level) return 'C';
        if (level.includes('禁忌')) return 'SS';
        if (level.includes('极')) return 'S';
        if (level.includes('高')) return 'A';
        if (level.includes('中')) return 'B';
        return 'C';
      };

      const skillList = entries.map(key => {
        const def = root[key] ?? {};
        // MVU 模板中技能结构: { 等级, 类型, 描述, 消耗, 效果 }
        const level = String(def.等级 ?? '');
        const typeText = String(def.类型 ?? '未知');
        const isMagical = typeText.includes('魔法');
        return {
          category: isMagical ? 'magical' : 'physical',
          name: String(key),
          rating: levelToRank(level),
          level,
          type: typeText,
          cost: String(def.消耗 ?? '无'),
          desc: String(def.描述 ?? '无'),
          effect: String(def.效果 ?? ''),
        };
      });

      return {
        physical: skillList.filter(s => s.category === 'physical'),
        magical: skillList.filter(s => s.category === 'magical'),
      };
    } catch (err) {
      console.error('解析技能列表时出错', err);
      return { physical: [] as any[], magical: [] as any[] };
    }
  })();

  const getRatingColor = (rating: string) => {
    if (rating.includes('S')) return 'text-orange-400 text-shadow-gold';
    if (rating.includes('A')) return 'text-purple-400';
    if (rating.includes('B')) return 'text-blue-400';
    return 'text-stone-400';
  };

  return (
    <div className="flex h-full gap-6">
      {/* Sidebar Tabs */}
      <div className="w-1/4 flex flex-col gap-2 border-r border-stone-800 pr-4">
        <button
          onClick={() => setActiveTab('physical')}
          className={`flex items-center gap-3 p-3 rounded text-left transition-all ${activeTab === 'physical' ? 'bg-gold-900/30 text-gold-200 border border-gold-700/30' : 'text-stone-500 hover:bg-stone-900 hover:text-stone-300'}`}
        >
          <Sword size={18} />
          <span className="font-serif text-sm">物理系 (武技)</span>
        </button>
        <button
          onClick={() => setActiveTab('magical')}
          className={`flex items-center gap-3 p-3 rounded text-left transition-all ${activeTab === 'magical' ? 'bg-purple-900/30 text-purple-200 border border-purple-700/30' : 'text-stone-500 hover:bg-stone-900 hover:text-stone-300'}`}
        >
          <Book size={18} />
          <span className="font-serif text-sm">魔法系 (咒术)</span>
        </button>
      </div>

      {/* Skills List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
        {grouped[activeTab].map((skill, i) => (
          <div
            key={i}
            className="bg-stone-900/40 border border-stone-800 p-4 rounded hover:border-stone-700 transition-colors group"
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-stone-950 border border-stone-800 rounded font-display font-bold">
                  <span className={getRatingColor(skill.rating)}>{skill.rating}</span>
                </div>
                <div className="flex flex-col">
                  <h4 className="text-gold-100 font-display font-semibold group-hover:text-gold-300 transition-colors">
                    {skill.name}
                  </h4>
                  <span className="text-[11px] text-stone-500">
                    {skill.type} · {skill.level || '未知等级'}
                  </span>
                </div>
              </div>
              <span className="text-xs font-mono text-stone-500 bg-stone-950 px-2 py-1 rounded border border-stone-800">
                {skill.cost}
              </span>
            </div>
            <p className="text-stone-400 text-sm font-serif pl-11">{skill.desc}</p>
            {skill.effect && <p className="text-emerald-400 text-xs font-mono pl-11 mt-1">效果：{skill.effect}</p>}
          </div>
        ))}
        {grouped[activeTab].length === 0 && <div className="text-center text-stone-600 mt-10 italic">暂无记录</div>}
      </div>
    </div>
  );
};

const QuestsView: React.FC<{ mvuStat: any | null }> = ({ mvuStat }) => {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');

  const listRoot = mvuStat?.['任务']?.['任务列表'] ?? {};
  const buildList = (key: '进行中的任务' | '已完成任务') => {
    const bucket = listRoot?.[key] ?? {};
    const entries = Object.keys(bucket || {})
      .filter(k => k !== '$meta')
      .map(name => ({ name, ...(bucket[name] || {}) }));
    return entries.map(e => ({
      title: e.描述 ? String(e.描述) : e.name,
      desc: String(e.描述 ?? '无描述'),
      rating: String(e.评级 ?? 'D'),
      reward: String(e.奖励 ?? '无'),
    }));
  };

  const quests = {
    active: buildList('进行中的任务'),
    completed: buildList('已完成任务'),
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b border-stone-800 mb-4">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-2 text-sm font-serif tracking-wide border-b-2 transition-colors ${activeTab === 'active' ? 'border-gold-500 text-gold-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
        >
          已接取任务
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-6 py-2 text-sm font-serif tracking-wide border-b-2 transition-colors ${activeTab === 'completed' ? 'border-green-600 text-green-500' : 'border-transparent text-stone-500 hover:text-stone-300'}`}
        >
          已完成任务
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4">
        {quests[activeTab].map((quest, i) => (
          <div key={i} className="relative pl-6 pb-2 border-l border-stone-800 ml-2">
            <div
              className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full ${activeTab === 'active' ? 'bg-gold-600' : 'bg-green-600'} shadow-[0_0_8px_currentColor]`}
            ></div>

            <div className="bg-stone-900/30 p-4 rounded border border-stone-800/50">
              <h3 className="text-stone-200 font-display text-lg mb-1">{quest.title}</h3>
              <p className="text-stone-400 text-sm font-serif mb-3">{quest.desc}</p>
              <div className="flex items-center gap-2 text-xs text-stone-500 border-t border-stone-800 pt-2">
                <Package size={12} />
                <span>
                  评级: {quest.rating} · 奖励: {quest.reward}
                </span>
              </div>
            </div>
          </div>
        ))}
        {quests[activeTab].length === 0 && <div className="text-center text-stone-600 mt-10 italic">暂无记录</div>}
      </div>
    </div>
  );
};

const SocialView: React.FC<{ mvuStat: any | null }> = ({ mvuStat }) => {
  const root = mvuStat?.['羁绊'] ?? {};
  const entries = Object.keys(root || {})
    .filter(k => k !== '$meta')
    .map(name => ({ name, ...(root[name] || {}) }));

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      <div className="space-y-4">
        {entries.map((e, i) => (
          <div key={i} className="flex items-center gap-4 bg-stone-900/40 border border-stone-800 rounded-lg p-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 flex items-center justify-center text-sm font-display text-gold-200">
              {e.name?.slice(0, 2) ?? '??'}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h4 className="text-gold-100 font-display text-sm">{e.name}</h4>
                <span className="text-[11px] px-2 py-0.5 rounded border border-stone-700 bg-stone-900 text-stone-300">
                  {e.关系 ?? '未知'}
                </span>
              </div>
              <p className="text-xs text-stone-400">所属组织：{e.所属组织 ?? '无'}</p>
            </div>
          </div>
        ))}
        {entries.length === 0 && <div className="text-center text-stone-600 mt-10 italic">暂无羁绊记录</div>}
      </div>
    </div>
  );
};

const ParallelEventsView: React.FC<{ mvuStat: any | null }> = ({ mvuStat }) => {
  const root = mvuStat?.['平行宇宙'] ?? {};
  const events = Object.keys(root || {})
    .filter(k => k !== '$meta')
    .map(name => {
      const raw = root[name];
      if (typeof raw === 'string') {
        return {
          name,
          current: raw,
          remaining: '',
        };
      }
      if (raw && typeof raw === 'object') {
        return {
          name,
          current: String(raw.当前行为 ?? '未知行为'),
          remaining: String(raw.剩余时间 ?? ''),
        };
      }
      return {
        name,
        current: '未知行为',
        remaining: '',
      };
    });

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-2">
      <div className="space-y-4">
        {events.map((evt, i) => (
          <div key={i} className="flex gap-4 items-start group">
            {/* Timeline Node */}
            <div className="flex flex-col items-center gap-1 min-w-[60px] pt-1">
              <div className="w-3 h-3 rounded-full border-2 border-stone-600 bg-stone-900 group-hover:border-gold-500 group-hover:bg-gold-900/50 transition-colors shadow-[0_0_5px_rgba(0,0,0,0.5)]"></div>
              <div className="w-[1px] h-full bg-stone-800 group-last:hidden"></div>
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-stone-900/40 border border-stone-800 rounded p-4 relative hover:bg-stone-900/60 transition-colors">
              <span className="absolute -left-2 top-2 w-2 h-4 border-l border-b border-stone-800 bg-stone-950/0 rotate-45 transform origin-bottom-left"></span>
              <div className="flex items-center gap-2 mb-1">
                <GitMerge size={14} className="text-stone-500" />
                <h4 className="text-gold-200 font-display text-sm tracking-wide bg-stone-950 px-2 rounded border border-stone-800">
                  {evt.name}
                </h4>
              </div>
              <p className="text-stone-400 font-serif text-sm leading-relaxed">
                {evt.current}
                {evt.remaining ? `（剩余时间：${evt.remaining}）` : ''}
              </p>
            </div>
          </div>
        ))}
      </div>
      {events.length === 0 && (
        <div className="mt-8 text-center">
          <span className="text-xs text-stone-600 font-mono italic">尚未观测到任何平行宇宙事件</span>
        </div>
      )}
    </div>
  );
};

const MapView: React.FC<{ showGrid: boolean }> = ({ showGrid }) => {
  // 地点数据（根据你给的结构整理）
  const regions = [
    {
      name: '人类联合王国',
      children: [
        { name: '王宫', desc: '权力核心', people: '艾莉亚, 奥古斯都三世', x: 50, y: 70 },
        { name: '炼金协会总部', desc: '魔力水晶生产与最高研究机构', people: '玛奇玛', x: 40, y: 68 },
        { name: '白塔学院', desc: '培养魔法师与学者的最高学府', people: '索菲亚', x: 65, y: 68 },
        { name: '钢铁要塞', desc: '王国南部边境，面向永恒战场的军事防线', people: '', x: 48, y: 60 },
        { name: '第一军团驻地', desc: '钢铁要塞内的精锐军团驻地', people: '伊莎贝拉', x: 55, y: 60 },
        {
          name: '港口城·潮汐之门',
          desc: '王国最大的贸易港口，负责海上物资运输与海军驻扎',
          people: '克拉拉',
          x: 30,
          y: 80,
        },
        { name: '巨石城', desc: '西部山脉脚下的矿业城市，为王国提供金属和矿石资源', people: '卡珊德拉', x: 32, y: 62 },
        { name: '黄金平原', desc: '王国的主要粮食产区，由众多农业城镇组成', people: '', x: 38, y: 76 },
        { name: '旧王都·晨星城遗址', desc: '上一个被魔族攻陷的人类王都，现已成废墟', people: '', x: 62, y: 55 },
      ],
    },
    {
      name: '永恒战场',
      children: [
        { name: '骸骨之痕', desc: '古代战场遗迹，散落着巨型生物和战争机械的残骸', people: '', x: 62, y: 39 },
        { name: '叹息之墙', desc: '人类方沿地脉枯竭区边缘建造的巨大城墙', people: '', x: 50, y: 55 },
        { name: '魔牙壁垒', desc: '魔族在战场前线建立的进攻性要塞群', people: '巴洛克', x: 50, y: 30 },
        { name: '无主之地', desc: '墙与壁垒之间的缓冲地带，双方斥候交战区', people: '', x: 50, y: 50 },
      ],
    },
    {
      name: '魔族领地',
      children: [
        { name: '魔王城·诺克萨斯', desc: '古代魔族堡垒，由一整块黑曜石山峰雕刻而成', people: '阿兹莫', x: 50, y: 8 },
        { name: '深渊王座', desc: '魔王的权力中心，笼罩着深不可测的压迫感', people: '奈尔法', x: 50, y: 18 },
        { name: '血祭神庙', desc: '魔族进行力量转化仪式和血脉强化的场所', people: '', x: 35, y: 15 },
        { name: '孵化深渊', desc: '培育新生代魔族士兵的巨大生物巢穴', people: '佩拉', x: 42, y: 21 },
        { name: '骸骨熔炉', desc: '处理战死者尸骸并将其能量回收的设施', people: '', x: 58, y: 20 },
        { name: '尖啸峡谷', desc: '魔族空军巢穴和训练场', people: '', x: 62, y: 15 },
        { name: '遗忘监牢', desc: '囚禁叛徒和强大战俘的地底监狱', people: '', x: 40, y: 13 },
      ],
    },
    {
      name: '东方精灵之森',
      children: [
        { name: '世界树·伊格德拉修', desc: '覆盖大陆东部的原始森林核心', people: '', x: 78, y: 20 },
        { name: '精灵议会', desc: '精灵长老议事之地', people: '艾拉瑞亚', x: 72, y: 39 },
        { name: '月亮湖', desc: '纯净自然魔力的汇集地', people: '奈菲', x: 78, y: 54 },
        { name: '迷雾沼泽', desc: '能迷惑入侵者心智的天然屏障', people: '莉安德拉', x: 79, y: 61 },
        { name: '古树哨兵', desc: '拥有自我意识的巨大树木防线', people: '', x: 71, y: 52 },
        { name: '星光圣殿', desc: '观察星辰与预知未来的古代遗迹', people: '菲莱拉', x: 86, y: 30 },
      ],
    },
    {
      name: '西部翼族山脉',
      children: [
        { name: '风咏之巅', desc: '大陆最高峰，终年风暴环绕', people: '', x: 22, y: 10 },
        { name: '翼族栖息地', desc: '建造在悬崖峭壁上的云端巢穴', people: '艾拉', x: 21, y: 22 },
        { name: '无声风穴', desc: '翼族冥想与风元素沟通的圣地', people: '', x: 28, y: 31 },
        { name: '孤高之巢', desc: '最年长翼族隐居的独立山峰', people: '泰瑞尔', x: 23, y: 30 },
        { name: '试炼之崖', desc: '年轻翼族飞行与战斗试炼的悬崖', people: '伊卡洛斯', x: 25, y: 40 },
      ],
    },
    {
      name: '环大陆之海',
      children: [
        { name: '海盗港·利维坦之骨', desc: '由巨大海兽骸骨构成的法外之地', people: '', x: 9, y: 51 },
        { name: '中央大漩涡', desc: '海域中心常年存在的巨型漩涡', people: '', x: 15, y: 75 },
        { name: '深海王国·亚特兰', desc: '人鱼种族的文明中心', people: '莉莉丝,涅瑞伊得,雷戈', x: 92, y: 85 },
        { name: '幽灵船海域', desc: '终年被浓雾笼罩的海域', people: '', x: 85, y: 75 },
        { name: '风暴之墙', desc: '环绕外海的永不平息雷暴带', people: '', x: 95, y: 10 },
      ],
    },
  ];

  const locations = regions.flatMap(region =>
    region.children.map(child => ({
      ...child,
      region: region.name,
    })),
  );

  const getTooltipAlign = (x: number, y: number) => {
    const horizontal = x < 33 ? 'left' : x > 66 ? 'right' : 'center';
    const vertical = y > 66 ? 'top' : y < 33 ? 'bottom' : 'middle';
    return { horizontal, vertical };
  };

  return (
    <div className="w-full h-full flex items-center justify-center bg-black overflow-hidden relative group">
      <img
        src="https://files.catbox.moe/66aung.png"
        alt="World Map"
        className="w-full h-full object-contain opacity-90"
      />

      {/* 发光点与信息框：仅在全屏(showGrid=true)时显示 */}
      {showGrid &&
        locations.map((loc, index) => {
          const { horizontal, vertical } = getTooltipAlign(loc.x, loc.y);

          const baseX = `${loc.x}%`;
          const baseY = `${loc.y}%`;

          const tooltipClasses = [
            'absolute z-40 w-64 p-4 rounded-lg bg-[#05050b]/95 border border-[var(--gold-700)]/60',
            'shadow-[0_18px_45px_rgba(0,0,0,0.8)] text-xs text-[var(--gold-100)]',
            'pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200',
          ].join(' ');

          const style: React.CSSProperties = {};
          if (vertical === 'top') {
            style.bottom = `calc(100% - ${baseY})`;
          } else if (vertical === 'bottom') {
            style.top = baseY;
          } else {
            style.top = `calc(${baseY} - 50%)`;
          }

          if (horizontal === 'left') {
            style.left = `calc(${baseX} + 12px)`;
          } else if (horizontal === 'right') {
            style.right = `calc(100% - ${baseX} + 12px)`;
          } else {
            style.left = baseX;
            style.transform = 'translateX(-50%)';
          }

          const arrowStyle: React.CSSProperties = {};
          if (vertical === 'top') {
            arrowStyle.top = '100%';
          } else if (vertical === 'bottom') {
            arrowStyle.bottom = '100%';
          } else {
            arrowStyle.top = '50%';
          }
          if (horizontal === 'left') {
            arrowStyle.left = '8px';
          } else if (horizontal === 'right') {
            arrowStyle.right = '8px';
          } else {
            arrowStyle.left = '50%';
            arrowStyle.transform = 'translateX(-50%)';
          }

          return (
            <div key={index} className="absolute group/point cursor-pointer" style={{ left: baseX, top: baseY }}>
              {/* 发光点 */}
              <div className="relative w-3 h-3">
                <div className="absolute inset-0 rounded-full bg-[var(--gold-500)] shadow-[0_0_15px_rgba(214,167,79,0.9)] animate-ping-slow opacity-60" />
                <div className="absolute inset-0 rounded-full bg-[var(--gold-500)]" />
              </div>

              {/* 悬浮信息卡（统一往中间靠） */}
              <div className={`hidden group-hover/point:block ${tooltipClasses}`} style={style}>
                <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--gold-300)] mb-2">{loc.region}</div>
                <h4 className="text-sm font-display text-[var(--gold-100)] mb-1">{loc.name}</h4>
                {loc.desc && <p className="text-[11px] text-stone-300 mb-1">{loc.desc}</p>}
                {loc.people && (
                  <p className="text-[11px] text-emerald-300">
                    相关人物：<span className="font-mono">{loc.people}</span>
                  </p>
                )}

                {/* 小箭头，指向发光点 */}
                <div
                  className="absolute w-2 h-2 bg-[#05050b] border-[var(--gold-700)]/60 rotate-45"
                  style={arrowStyle}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
