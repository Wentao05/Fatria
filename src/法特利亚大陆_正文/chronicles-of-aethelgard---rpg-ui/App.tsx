import { Maximize2, Minimize2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { LeftSidebar } from './components/LeftSidebar';
import { MainContent } from './components/MainContent';
import { Modal } from './components/Modal';
import { RightSidebar } from './components/RightSidebar';
import { INITIAL_CHARACTER, INITIAL_CHAT_LOG, INITIAL_GLOBAL, MOCK_NEWS } from './constants';
import { Character, GameGlobal, Message, ModalType, NewsItem } from './types';

// In a real app, this would use the Gemini API from services
// import { generateResponse } from './services/geminiService';

const App: React.FC = () => {
  const [character, setCharacter] = useState(INITIAL_CHARACTER);
  const [globalState, setGlobalState] = useState(INITIAL_GLOBAL);
  const [chatLog, setChatLog] = useState<Message[]>(INITIAL_CHAT_LOG);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mainText, setMainText] = useState<string>('');
  const [news, setNews] = useState<NewsItem[]>(MOCK_NEWS);
  const [mvuStat, setMvuStat] = useState<any | null>(null);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  // 从 MVU 变量同步角色、全局信息和新闻
  useEffect(() => {
    const bootstrapMvu = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const globalAny = window as any;
        if (globalAny.waitGlobalInitialized) {
          await globalAny.waitGlobalInitialized('Mvu');
        }
        if (!globalAny.Mvu) return;

        const refreshFromMvu = (vars?: any) => {
          const data = vars ?? globalAny.Mvu.getMvuData({ type: 'message', message_id: 'latest' });
          if (!data) return;
          setMvuStat(data.stat_data ?? null);
          const mappedCharacter = mapMvuToCharacter(data);
          const mappedGlobal = mapMvuToGlobal(data);
          const mappedNews = mapMvuToNews(data, mappedGlobal?.date);

          if (mappedCharacter) setCharacter(mappedCharacter);
          if (mappedGlobal) setGlobalState(mappedGlobal);
          if (mappedNews) setNews(mappedNews);
        };

        refreshFromMvu();
        globalAny.eventOn?.(globalAny.Mvu.events.VARIABLE_UPDATE_ENDED, (vars: any) => refreshFromMvu(vars));
      } catch (err) {
        console.warn('无法读取 MVU 变量，使用默认展示', err);
      }
    };

    bootstrapMvu();
  }, []);

  // 从最新一楼消息中用正则提取 <content> … </content> 的正文，并过滤 <!-- --> 注释
  useEffect(() => {
    try {
      const messages = getChatMessages(-1, { role: 'assistant', hide_state: 'all' });
      const raw = messages[0]?.message ?? '';
      if (!raw) {
        setMainText('');
        return;
      }
      setMainText(extractContentFromRaw(raw));
    } catch (err) {
      console.warn('无法从聊天消息中提取正文', err);
    }
  }, []);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  };

  const handleSendMessage = async (message: string) => {
    // 1. Add User Message
    const userMsg: Message = { role: 'user', content: message };
    setChatLog(prev => [...prev, userMsg]);
    setIsProcessing(true);

    // 2. Simulate LLM processing (Mocking Gemini for UI Demo purposes)
    // In production: const response = await generateResponse(message, history);

    setTimeout(() => {
      const mockResponses = [
        '你感觉到一股奇异的魔力在剑锋流转。当你挥剑斩向粘液时，它发出刺耳的尖叫声，随后化为一滩黑水，露出了通往深处的阶梯。',
        '你的直觉告诉你，这并非普通的遭遇。空气中弥漫着硫磺的味道，这是恶魔生物出现的征兆。',
        '你从背包中取出魔法卷轴，随着咒语的吟唱，微弱的光芒照亮了前方的黑暗，揭示了墙壁上古老的壁画。',
        '你的尝试失败了。那股力量反噬了你的意志，你的精神属性受到了一次冲击。',
      ];

      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];

      setChatLog(prev => [...prev, { role: 'model', content: randomResponse }]);
      setIsProcessing(false);

      // 3. Simulate State Update based on action (e.g., gain XP or lose MP)
      setCharacter(prev => ({
        ...prev,
        vitals: {
          ...prev.vitals,
          mp: Math.max(0, prev.vitals.mp - 5),
        },
        experience: {
          ...prev.experience,
          magical: prev.experience.magical + 15,
        },
      }));
    }, 2000); // Simulate network latency/thinking time
  };

  return (
    <div className="relative min-h-full w-full bg-gradient-to-br from-[#050507] via-[#0b0d13] to-[#050507] flex items-center justify-center p-4 overflow-visible font-sans select-none text-[var(--gold-100)]">
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-4 z-30 px-3 py-2 rounded-md border border-[#3a2a0f] bg-[#0f1018cc] text-[var(--gold-100)] shadow-[0_10px_40px_rgba(0,0,0,0.6)] hover:border-[var(--gold-500)] hover:shadow-[0_10px_40px_rgba(214,167,79,0.35)] backdrop-blur-md transition-all duration-200 flex items-center gap-2 text-xs tracking-widest"
      >
        {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        {isFullscreen ? '退出全屏' : '全屏'}
      </button>
      {/* Background Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-radial from-stone-900 to-black opacity-80"></div>
        {/* Subtle Vignette */}
        <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-[1600px] min-h-[760px] flex gap-3">
        {/* Left Sidebar: Character & Status */}
        <LeftSidebar character={character} global={globalState} mvuStat={mvuStat} />

        {/* Center: Main Game Loop / Chat */}
        <MainContent
          chatLog={chatLog}
          onSendMessage={handleSendMessage}
          isProcessing={isProcessing}
          mainText={mainText}
        />

        {/* Right Sidebar: Inventory & Menu */}
        <RightSidebar character={character} news={news} onOpenModal={setActiveModal} />
      </div>

      {/* Modal Overlay */}
      <Modal
        isOpen={!!activeModal}
        type={activeModal}
        onClose={() => setActiveModal(null)}
        character={character}
        mvuStat={mvuStat}
        isFullscreen={isFullscreen}
      />
    </div>
  );
};

export default App;

function extractValue<T>(value: any, fallback: T): T {
  if (Array.isArray(value)) return (value[0] as T) ?? fallback;
  if (value === undefined || value === null) return fallback;
  return value as T;
}

function getPath(obj: any, path: string, fallback: any = undefined) {
  if (!obj) return fallback;
  const segments = path
    .replace(/\[(\w+)\]/g, '.$1')
    .split('.')
    .filter(Boolean);
  let current = obj;
  for (const key of segments) {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      current = current[key];
    } else {
      return fallback;
    }
  }
  return current ?? fallback;
}

function mapMvuToCharacter(data: any): Character | null {
  const stat = data?.stat_data ?? {};
  const name = '主角';
  const race = extractValue(getPath(stat, '主角.基本信息.种族'), '未知种族');
  const clazz = extractValue(getPath(stat, '主角.基本信息.职业'), '未知职业');

  const attributes = {
    strength: Number(extractValue(getPath(stat, '主角.核心属性.力量'), 0)),
    agility: Number(extractValue(getPath(stat, '主角.核心属性.敏捷'), 0)),
    constitution: Number(extractValue(getPath(stat, '主角.核心属性.体质'), 0)),
    wisdom: Number(extractValue(getPath(stat, '主角.核心属性.智力'), 0)),
    spirit: Number(extractValue(getPath(stat, '主角.核心属性.精神'), 0)),
    luck: Number(extractValue(getPath(stat, '主角.核心属性.气运'), 0)),
  };

  const vitals = {
    hp: Number(extractValue(getPath(stat, '主角.核心数值.生命值.当前值'), 0)),
    maxHp: Number(extractValue(getPath(stat, '主角.核心数值.生命值.最大值'), 0)),
    mp: Number(extractValue(getPath(stat, '主角.核心数值.魔力值.当前值'), 0)),
    maxMp: Number(extractValue(getPath(stat, '主角.核心数值.魔力值.最大值'), 0)),
    stamina: Number(extractValue(getPath(stat, '主角.核心数值.耐力值.当前值'), 0)),
    maxStamina: Number(extractValue(getPath(stat, '主角.核心数值.耐力值.最大值'), 0)),
  };

  const experience = {
    physical: Number(extractValue(getPath(stat, '主角.经验值.锻体经验.当前值'), 0)),
    maxPhysical: Number(extractValue(getPath(stat, '主角.经验值.锻体经验.升级所需'), 0)),
    magical: Number(extractValue(getPath(stat, '主角.经验值.魔法经验.当前值'), 0)),
    maxMagical: Number(extractValue(getPath(stat, '主角.经验值.魔法经验.升级所需'), 0)),
  };

  const combatPower = {
    physical: String(extractValue(getPath(stat, '主角.战斗力.肉身战力等级'), '未知')),
    magical: String(extractValue(getPath(stat, '主角.战斗力.魔法战力等级'), '未知')),
  };

  const statusObj = getPath(stat, '主角.状态', {});
  const statusList: string[] = [];
  if (statusObj && typeof statusObj === 'object') {
    Object.keys(statusObj)
      .filter(key => key !== '$meta')
      .forEach(key => {
        const entry = statusObj[key];
        if (!entry) return;
        const desc = entry.描述 ?? '';
        const effect = entry.效果 ?? '';
        const text = [key, desc, effect].filter(Boolean).join(' | ');
        if (text) statusList.push(text);
      });
  }

  const status = statusList.length ? statusList.join('\n') : '状态良好';

  const buildEquip = (path: string) => {
    const eq = getPath(stat, path, null);
    if (!eq) return null;
    const quality = eq.品质 ?? '';
    const type = eq.类型 ?? '';
    const nameParts = [quality, type].filter(Boolean).join(' ');
    const description = [eq.描述, eq.效果].filter(Boolean).join('；');
    if (!nameParts && !description) return null;
    return { name: nameParts || '未装备', description: description || '暂无效果' };
  };

  const equipment = {
    weapon: buildEquip('主角.装备.武器'),
    armor: buildEquip('主角.装备.防具'),
    accessory: buildEquip('主角.装备.饰品'),
  };

  const currency = {
    gold: Number(extractValue(getPath(stat, '主角.货币.金龙币'), 0)),
    silver: Number(extractValue(getPath(stat, '主角.货币.银狼币'), 0)),
    copper: Number(extractValue(getPath(stat, '主角.货币.铜蛇币'), 0)),
  };

  const inventoryList = getPath(stat, '主角.背包', {});
  const inventoryKeys =
    inventoryList && typeof inventoryList === 'object' ? Object.keys(inventoryList).filter(k => k !== '$meta') : [];
  const inventory = inventoryKeys.map((key, idx) => {
    const item = inventoryList[key] ?? {};
    const rawQuality = String(item.品质 ?? '普通');
    return {
      id: `item-${idx}`,
      name: key,
      quality: rawQuality,
      type: String(item.类型 ?? '未知'),
      description: String(item.描述 ?? '无描述'),
      effect: String(item.效果 ?? '无'),
      quantity: Number(item.数量 ?? 1),
      value: 0,
    };
  });

  return {
    name,
    race,
    class: clazz,
    attributes,
    vitals,
    experience,
    combatPower,
    status,
    equipment,
    currency,
    inventory,
  };
}

function mapMvuToGlobal(data: any): GameGlobal | null {
  const stat = data?.stat_data ?? {};
  const date = extractValue(getPath(stat, '系统变量.日期'), '');
  const time = extractValue(getPath(stat, '系统变量.时间'), '');
  const location = extractValue(getPath(stat, '主角.位置'), '未知地点');
  const dateStr = [date, time].filter(Boolean).join(' ');
  return {
    date: dateStr || '时间未知',
    location,
  };
}

function mapMvuToNews(data: any, dateStr?: string): NewsItem[] | null {
  const stat = data?.stat_data ?? {};
  const current = extractValue(getPath(stat, '新闻.当前播报'), '');
  if (!current) return null;
  const now = dateStr || extractValue(getPath(stat, '系统变量.时间'), '') || '未知时间';
  return [
    {
      id: 'news-1',
      content: current,
      time: now,
    },
  ];
}

function extractContentFromRaw(raw: string): string {
  if (!raw) return '';
  // 先移除 <!-- --> 包裹的注释
  const withoutComments = raw.replace(/<!--[\s\S]*?-->/g, '');
  // 使用用户给定正则语义: 捕捉 <content>...</content> 中间的内容
  const match = withoutComments.match(/[\s\S]*?<content>([\s\S]*?)<\/content>/i);
  if (match && match[1]) {
    return match[1].trim();
  }
  // 如果没有 content 标签，就展示整段（同样是去掉注释后的）
  return withoutComments.trim();
}
