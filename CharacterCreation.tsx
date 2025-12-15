import {
  BookOpen,
  Crown,
  Dice5,
  Droplets,
  Feather,
  Ghost,
  GitBranch,
  Heart,
  Scroll,
  Shield,
  Sparkles,
  Sword,
  User,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { BASE_STAT, CharacterData, MAX_STAT_POINTS, Race, StartingSkill, Stats } from '../types';
import { Frame } from './Ornaments';

interface CharacterCreationProps {
  onStartGame: (data: CharacterData) => void;
  onRequestModal: (modalType: string) => void;
}

const initialStats: Stats = {
  strength: BASE_STAT,
  agility: BASE_STAT,
  intelligence: BASE_STAT,
  constitution: BASE_STAT,
  spirit: BASE_STAT,
  fortune: BASE_STAT
};

const PRESET_STARTING_SKILLS: StartingSkill[] = [
  {
    id: 'favored-by-fate',
    name: '命运之子',
    description: '总能在关键时刻逢凶化吉，获得意料之外的帮助。'
  },
  {
    id: 'veteran-adventurer',
    name: '老练冒险者',
    description: '熟悉旅途与佣兵行当的规则，更容易从情报与人脉中获利。'
  },
  {
    id: 'scholar',
    name: '学者出身',
    description: '拥有扎实的学识基础，更容易理解魔法、历史与古文献。'
  },
  {
    id: 'wilderness-survivor',
    name: '荒野求生',
    description: '擅长在险恶环境中生存，不易被自然环境击垮。'
  }
];

const RACE_SUBTYPES: Record<Race, string[]> = {
  [Race.HUMAN]: [],
  [Race.DEMON]: ['炎魔', '魅魔', '恶魔', '石像鬼', '影魔', '吸血鬼', '巫妖', '幽魂', '不死者', '狼人'],
  [Race.ELF]: ['高等精灵', '暗精灵', '木精灵', '血精灵', '星辰精灵', '幽魂精灵'],
  [Race.DEMI_HUMAN]: ['猫人族', '狐人族', '兔人族', '熊人族', '蜥人族', '蛇人'],
  [Race.WINGED]: [],
  [Race.SEA_FOLK]: ['塞壬', '鲨人', '娜迦', '章鱼人', '海龙'],
};

const CharacterCreation: React.FC<CharacterCreationProps> = ({ onStartGame, onRequestModal }) => {
  const [formData, setFormData] = useState<Partial<CharacterData>>({
    name: '',
    age: 20,
    gender: 'male',
    race: Race.HUMAN,
    subRace: '',
    personality: '',
    description: '',
    scenario: '',
    startingSkills: []
  });

  const [stats, setStats] = useState<Stats>(initialStats);
  const [isCustomSubRace, setIsCustomSubRace] = useState(false);
  const [customSkillName, setCustomSkillName] = useState('');
  const [customSkillDescription, setCustomSkillDescription] = useState('');

  // Reset subrace when race changes
  const handleRaceChange = (newRace: Race) => {
    setFormData(prev => ({
      ...prev,
      race: newRace,
      subRace: ''
    }));
    setIsCustomSubRace(false);
  };

  const totalUsedPoints = (Object.values(stats) as number[]).reduce((a, b) => a + b, 0) - (Object.keys(stats).length * BASE_STAT);
  const remainingPoints = MAX_STAT_POINTS - totalUsedPoints;

  const handleStatChange = (stat: keyof Stats, value: number) => {
    const currentVal = stats[stat];
    const diff = value - currentVal;

    if (diff > 0 && remainingPoints < diff) return; // Not enough points
    if (value < 1) return; // Min stat
    if (value > 20) return; // Max stat is 20

    setStats(prev => ({ ...prev, [stat]: value }));
  };

  const raceIcons: Record<Race, React.ReactNode> = {
    [Race.HUMAN]: <User className="w-6 h-6" />,
    [Race.DEMON]: <Ghost className="w-6 h-6" />,
    [Race.ELF]: <Sparkles className="w-6 h-6" />,
    [Race.DEMI_HUMAN]: <Sword className="w-6 h-6" />,
    [Race.WINGED]: <Feather className="w-6 h-6" />,
    [Race.SEA_FOLK]: <Droplets className="w-6 h-6" />,
  };

  const statIcons: Record<keyof Stats, React.ReactNode> = {
    strength: <Sword className="w-4 h-4 text-red-400" />,
    agility: <Zap className="w-4 h-4 text-yellow-400" />,
    intelligence: <BookOpen className="w-4 h-4 text-blue-400" />,
    constitution: <Shield className="w-4 h-4 text-green-400" />,
    spirit: <Heart className="w-4 h-4 text-purple-400" />,
    fortune: <Dice5 className="w-4 h-4 text-amber-300" />
  };

  const statLabels: Record<keyof Stats, string> = {
    strength: "力量",
    agility: "敏捷",
    intelligence: "智力",
    constitution: "体质",
    spirit: "精神",
    fortune: "气运"
  };

  const toggleStartingSkill = (skill: StartingSkill) => {
    const current = formData.startingSkills || [];
    const exists = current.some(s => s.id === skill.id);
    const next = exists
      ? current.filter(s => s.id !== skill.id)
      : [...current, skill];
    setFormData(prev => ({ ...prev, startingSkills: next }));
  };

  const handleAddCustomSkill = () => {
    const name = customSkillName.trim();
    const desc = customSkillDescription.trim();
    if (!name) {
      toastr.warning('请填写自定义技能名称', '信息不完整');
      return;
    }
    const id = `custom-${Date.now()}`;
    const newSkill: StartingSkill = {
      id,
      name,
      description: desc || '（自定义技能）',
      isCustom: true
    };
    const current = formData.startingSkills || [];
    setFormData(prev => ({ ...prev, startingSkills: [...current, newSkill] }));
    setCustomSkillName('');
    setCustomSkillDescription('');
  };

  const currentSubRaces = RACE_SUBTYPES[formData.race as Race] || [];
  const hasSubRaces = currentSubRaces.length > 0;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-200 py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left Column: Basic Info & Story */}
        <div className="lg:col-span-7 space-y-8 animate-fade-in-up">
            <header className="mb-8">
                <h2 className="text-3xl font-cinzel text-amber-500 mb-2">Create Your Legacy</h2>
                <p className="text-stone-400 text-sm">铭刻你的名字于历史的丰碑之上。</p>
            </header>

            {/* Basic Info Panel */}
            <Frame className="glass-panel p-6 md:p-8 bg-stone-900/60">
                <h3 className="text-xl text-amber-400 font-bold mb-6 flex items-center gap-2">
                    <Scroll className="w-5 h-5" /> 基础信息
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-stone-400 text-sm uppercase tracking-wider">姓名</label>
                        <input
                            type="text"
                            className="w-full bg-stone-950 border border-stone-700 rounded-sm p-3 text-amber-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-colors"
                            placeholder="例如：亚瑟"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-stone-400 text-sm uppercase tracking-wider">年龄</label>
                        <input
                            type="number"
                            className="w-full bg-stone-950 border border-stone-700 rounded-sm p-3 text-amber-100 focus:border-amber-500 outline-none transition-colors"
                            value={formData.age}
                            onChange={(e) => setFormData({...formData, age: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-stone-400 text-sm uppercase tracking-wider">性别</label>
                        <div className="flex gap-4">
                            {['male', 'female', 'other'].map(g => (
                                <button
                                    key={g}
                                    onClick={() => setFormData({...formData, gender: g as any})}
                                    className={`flex-1 py-2 border ${formData.gender === g ? 'bg-amber-900/40 border-amber-500 text-amber-200' : 'border-stone-700 text-stone-500 hover:border-stone-500'} transition-all`}
                                >
                                    {g === 'male' ? '男' : g === 'female' ? '女' : '其他'}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Race Selection */}
                    <div className="space-y-2">
                        <label className="text-stone-400 text-sm uppercase tracking-wider">种族</label>
                        <div className="relative">
                            <select
                                className="w-full bg-stone-950 border border-stone-700 rounded-sm p-3 text-amber-100 appearance-none focus:border-amber-500 outline-none"
                                value={formData.race}
                                onChange={(e) => handleRaceChange(e.target.value as Race)}
                            >
                                {Object.values(Race).map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                            <div className="absolute right-3 top-3 pointer-events-none text-stone-500">▼</div>
                        </div>
                    </div>

                    {/* Sub-Race Selection (Conditional) */}
                    {hasSubRaces && (
                        <div className="space-y-2 animate-fade-in-up">
                            <div className="flex justify-between items-center">
                                <label className="text-stone-400 text-sm uppercase tracking-wider flex items-center gap-1">
                                    <GitBranch size={14} /> 亚种
                                </label>
                            </div>
                            <div className="relative">
                                <select
                                    className="w-full bg-stone-950 border border-stone-700 rounded-sm p-3 text-amber-100 appearance-none focus:border-amber-500 outline-none"
                                    value={isCustomSubRace ? 'custom' : formData.subRace}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === 'custom') {
                                            setIsCustomSubRace(true);
                                            setFormData(prev => ({...prev, subRace: ''}));
                                        } else {
                                            setIsCustomSubRace(false);
                                            setFormData(prev => ({...prev, subRace: val}));
                                        }
                                    }}
                                >
                                    <option value="" disabled>选择分支...</option>
                                    {currentSubRaces.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                    <option value="custom">✎ 自定义 (Custom)...</option>
                                </select>
                                <div className="absolute right-3 top-3 pointer-events-none text-stone-500">▼</div>
                            </div>

                            {/* Custom Sub-Race Input */}
                            {isCustomSubRace && (
                                <input
                                    type="text"
                                    autoFocus
                                    className="w-full mt-2 bg-stone-950/50 border border-amber-900/50 rounded-sm p-3 text-amber-100 focus:border-amber-500 outline-none animate-fade-in-up"
                                    placeholder="请输入您的种族分支名称..."
                                    value={formData.subRace}
                                    onChange={(e) => setFormData({...formData, subRace: e.target.value})}
                                />
                            )}
                        </div>
                    )}
                </div>

                <div className="mt-6 space-y-2">
                    <label className="text-stone-400 text-sm uppercase tracking-wider">性格特征</label>
                    <input
                        type="text"
                        className="w-full bg-stone-950 border border-stone-700 rounded-sm p-3 text-amber-100 focus:border-amber-500 outline-none transition-colors"
                        placeholder="例如：勇敢、多疑、充满好奇心..."
                        value={formData.personality}
                        onChange={(e) => setFormData({...formData, personality: e.target.value})}
                    />
                </div>
            </Frame>

            {/* Narrative Sections */}
            <Frame className="glass-panel p-6 md:p-8 bg-stone-900/60">
                 <h3 className="text-xl text-amber-400 font-bold mb-6 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" /> 传记与开端
                </h3>

                <div className="space-y-6">
                    <div className="space-y-2 group">
                        <label className="text-stone-400 text-sm uppercase tracking-wider flex justify-between">
                            <span>外貌与补充说明</span>
                            <Sparkles className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                        </label>
                        <textarea
                            className="w-full h-24 bg-stone-950 border border-stone-700 rounded-sm p-3 text-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none transition-all scrollbar-thin"
                            placeholder="描述你的外貌特征，或者任何你想补充的设定..."
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                        />
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-stone-400 text-sm uppercase tracking-wider flex justify-between">
                            <span>自定义开局剧情</span>
                            <Crown className="w-4 h-4 text-stone-600 group-hover:text-amber-500 transition-colors" />
                        </label>
                        <textarea
                            className="w-full h-32 bg-stone-950 border border-stone-700 rounded-sm p-3 text-stone-300 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none resize-none transition-all"
                            placeholder="如果你希望故事从一个特定的场景开始，请在这里写下..."
                            value={formData.scenario}
                            onChange={(e) => setFormData({...formData, scenario: e.target.value})}
                        />
                        <p className="text-xs text-stone-500 italic text-right">Leave blank for a random destiny.</p>
                    </div>
                </div>
            </Frame>
        </div>

        {/* Right Column: Stats & Race Visuals */}
        <div className="lg:col-span-5 space-y-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>

            {/* Race Card Visualization */}
            <div className="relative group">
                <div className="absolute inset-0 bg-amber-500/10 rounded-lg blur-xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
                <Frame className="bg-stone-900/80 backdrop-blur-md p-6 text-center border-stone-800 hover:border-amber-500/50 transition-colors duration-300">
                    <div className="w-24 h-24 mx-auto bg-stone-950 rounded-full flex items-center justify-center border-2 border-amber-700 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                        {raceIcons[formData.race as Race]}
                    </div>
                    <h3 className="text-2xl font-cinzel text-amber-100">{formData.race}</h3>
                    {formData.subRace && (
                        <p className="text-amber-500 font-cinzel text-lg mt-1 tracking-widest">{formData.subRace}</p>
                    )}
                    <p className="text-stone-500 text-sm mt-2 font-serif italic">
                        {formData.race === Race.HUMAN && "适应力极强，充满无限可能的种族。"}
                        {formData.race === Race.DEMON && "拥有强大的魔力亲和，被黑暗眷顾。"}
                        {formData.race === Race.ELF && "长寿而优雅，自然的守护者。"}
                        {formData.race === Race.DEMI_HUMAN && "拥有野兽的直觉与人类的智慧。"}
                        {formData.race === Race.WINGED && "向往天空，自由不羁的灵魂。"}
                        {formData.race === Race.SEA_FOLK && "深海的子民，神秘而古老。"}
                    </p>
                </Frame>
            </div>

            {/* Stats Allocation */}
            <Frame className="glass-panel p-6 md:p-8 bg-stone-900/60">
                <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
                    <h3 className="text-xl text-amber-400 font-bold flex items-center gap-2">
                        <Zap className="w-5 h-5" /> 属性分配
                    </h3>
                    <div className="text-right">
                        <span className="text-xs text-stone-500 block uppercase tracking-widest">Remaining Points</span>
                        <span className={`text-2xl font-cinzel ${remainingPoints === 0 ? 'text-green-500' : 'text-amber-500'}`}>
                            {remainingPoints}
                        </span>
                    </div>
                </div>

                <div className="space-y-6">
                    {(Object.keys(stats) as Array<keyof Stats>).map((stat) => (
                        <div key={stat} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-stone-300 flex items-center gap-2 cursor-help" onClick={() => onRequestModal(`stat_${stat}`)}>
                                    {statIcons[stat]}
                                    <span>{statLabels[stat]}</span>
                                </label>
                                <span className="font-mono text-amber-100 w-8 text-center">{stats[stat]}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => handleStatChange(stat, stats[stat] - 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-stone-700 rounded hover:bg-stone-800 text-stone-400"
                                >-</button>
                                <div className="flex-1 h-2 bg-stone-950 rounded-full overflow-hidden border border-stone-800">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-800 to-amber-500 transition-all duration-300"
                                        style={{ width: `${(stats[stat] / 20) * 100}%` }}
                                    ></div>
                                </div>
                                <button
                                    onClick={() => handleStatChange(stat, stats[stat] + 1)}
                                    className="w-8 h-8 flex items-center justify-center border border-stone-700 rounded hover:bg-amber-900/30 hover:border-amber-700 text-amber-400 disabled:opacity-30 disabled:cursor-not-allowed"
                                    disabled={remainingPoints <= 0 || stats[stat] >= 20}
                                >+</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-stone-800 flex justify-center">
                    <button
                        className="text-xs text-stone-500 hover:text-amber-400 underline transition-colors"
                        onClick={() => {
                            setStats(initialStats);
                        }}
                    >
                        重置属性
                    </button>
                </div>
            </Frame>

            {/* Starting Skills */}
            <Frame className="glass-panel p-6 md:p-8 bg-stone-900/60">
                <div className="flex justify-between items-center mb-4 border-b border-stone-800 pb-3">
                    <h3 className="text-xl text-amber-400 font-bold flex items-center gap-2">
                        <Crown className="w-5 h-5" /> 开局技能
                    </h3>
                    <p className="text-xs text-stone-500">可多选，并支持自定义</p>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {PRESET_STARTING_SKILLS.map(skill => {
                            const selected = (formData.startingSkills || []).some(s => s.id === skill.id);
                            return (
                                <button
                                    key={skill.id}
                                    type="button"
                                    onClick={() => toggleStartingSkill(skill)}
                                    className={`text-left p-3 border rounded-sm transition-all text-sm h-full flex flex-col justify-between ${
                                        selected
                                            ? 'border-amber-500 bg-amber-900/40 text-amber-100 shadow-[0_0_10px_rgba(245,158,11,0.4)]'
                                            : 'border-stone-700 bg-stone-950/60 text-stone-300 hover:border-stone-500'
                                    }`}
                                >
                                    <span className="font-semibold mb-1 flex items-center gap-1">
                                        <Sparkles className="w-4 h-4 text-amber-400" />
                                        {skill.name}
                                    </span>
                                    <span className="text-xs text-stone-400">{skill.description}</span>
                                </button>
                            );
                        })}
                    </div>

                    <div className="pt-4 border-t border-stone-800 space-y-3">
                        <p className="text-xs text-stone-500 uppercase tracking-widest">自定义技能</p>
                        <input
                            type="text"
                            className="w-full bg-stone-950 border border-stone-700 rounded-sm p-2 text-amber-100 text-sm focus:border-amber-500 outline-none transition-colors"
                            placeholder="技能名称，例如：被遗忘的祝福"
                            value={customSkillName}
                            onChange={(e) => setCustomSkillName(e.target.value)}
                        />
                        <textarea
                            className="w-full h-16 bg-stone-950 border border-stone-700 rounded-sm p-2 text-stone-300 text-xs focus:border-amber-500 outline-none resize-none transition-colors"
                            placeholder="效果说明（可选）：简单描述这个技能会如何影响你的旅程。"
                            value={customSkillDescription}
                            onChange={(e) => setCustomSkillDescription(e.target.value)}
                        />
                        <div className="flex justify-between items-center">
                            <button
                                type="button"
                                onClick={handleAddCustomSkill}
                                className="px-3 py-1.5 text-xs border border-amber-600 text-amber-200 rounded-sm bg-amber-900/40 hover:bg-amber-800/60 transition-colors"
                            >
                                添加自定义技能
                            </button>
                            <span className="text-[11px] text-stone-500">
                                已选择 {(formData.startingSkills || []).length} 项
                            </span>
                        </div>

                        {(formData.startingSkills || []).length > 0 && (
                            <div className="mt-2 text-[11px] text-stone-400 space-y-1">
                                <p className="text-stone-500">当前选择：</p>
                                <ul className="list-disc list-inside space-y-0.5">
                                    {(formData.startingSkills || []).map(skill => (
                                        <li key={skill.id}>
                                            <span className="text-amber-300">{skill.name}</span>
                                            {skill.description && (
                                                <span className="text-stone-500"> —— {skill.description}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </Frame>

            <button
                onClick={() => onStartGame({ ...formData, stats } as CharacterData)}
                className="w-full py-4 bg-gradient-to-r from-amber-700 to-amber-900 text-amber-100 font-bold tracking-[0.2em] rounded-sm border border-amber-500 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 active:translate-y-0"
            >
                开始旅程
            </button>

        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
