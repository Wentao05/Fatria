import { Character, GameGlobal, NewsItem, Message } from './types';

export const INITIAL_CHARACTER: Character = {
  name: "艾瑞克·冯·赫尔曼",
  race: "人类 (高等血脉)",
  class: "魔剑士",
  attributes: {
    strength: 18,
    agility: 14,
    constitution: 16,
    wisdom: 15,
    spirit: 22,
    luck: 8
  },
  vitals: {
    hp: 340,
    maxHp: 450,
    mp: 120,
    maxMp: 280,
    stamina: 85,
    maxStamina: 120
  },
  experience: {
    physical: 1450,
    maxPhysical: 2000,
    magical: 890,
    maxMagical: 3500
  },
  combatPower: {
    physical: "B+",
    magical: "A-"
  },
  status: "轻度疲劳",
  equipment: {
    weapon: {
      name: "古旧的符文长剑",
      description: "一把刻有微弱发光符文的精钢长剑，似乎曾属于某位古代骑士。增加物理攻击力，对灵体生物有微弱伤害加成。"
    },
    armor: {
      name: "暗夜守望者皮甲",
      description: "由影兽皮革制成的轻型护甲，不仅坚韧，还能在黑暗中隐匿身形。提供中等物理防御与微量魔法抗性。"
    },
    accessory: {
      name: "褪色的家族徽章",
      description: "赫尔曼家族的遗物，虽然表面已经氧化，但仍散发着微弱的意志力。小幅提升精神属性与魅力。"
    }
  },
  currency: {
    gold: 5,
    silver: 42,
    copper: 18
  },
  inventory: [
    {
      id: '1',
      name: "小型生命药水",
      quality: "Common",
      type: "消耗品",
      description: "炼金公会生产的基础治疗药剂，味道像樱桃味的止咳糖浆。",
      effect: "恢复 50 点生命值",
      quantity: 3,
      value: 10
    },
    {
      id: '2',
      name: "磨刀石",
      quality: "Common",
      type: "工具",
      description: "一块普通的磨刀石，可以用来维护武器的锋利度。",
      effect: "临时提升武器攻击力 5%",
      quantity: 1,
      value: 5
    },
    {
      id: '3',
      name: "未鉴定的魔法卷轴",
      quality: "Rare",
      type: "魔法物品",
      description: "羊皮纸上写满了扭曲的文字，散发着不祥的气息。",
      effect: "??? (需要鉴定)",
      quantity: 1,
      value: 150
    },
    {
      id: '4',
      name: "旅行干粮",
      quality: "Common",
      type: "食物",
      description: "坚硬的面包和肉干，虽然难吃但能提供充足的能量。",
      effect: "恢复 20 点耐力",
      quantity: 5,
      value: 2
    },
    {
      id: '5',
      name: "生锈的铁钥匙",
      quality: "Uncommon",
      type: "任务物品",
      description: "一把沾满铁锈的老式钥匙，可能通往修道院的某个密室。",
      quantity: 1,
      value: 0
    },
    {
      id: '6',
      name: "神秘的地图碎片",
      quality: "Epic",
      type: "特殊",
      description: "描绘着未知地形的古老地图残片，边缘有烧焦的痕迹。",
      quantity: 1,
      value: 500
    }
  ]
};

export const INITIAL_GLOBAL: GameGlobal = {
  date: "帝国历 842年 霜降月 14日",
  location: "沉寂的修道院废墟"
};

export const MOCK_NEWS: NewsItem[] = [
  { id: '1', time: '10:00', content: '北境公爵宣布加强边境巡逻。' },
  { id: '2', time: '11:30', content: '神秘商队抵达了银月城。' },
  { id: '3', time: '14:15', content: '由于魔力潮汐，法师塔暂时关闭。' },
  { id: '4', time: '16:00', content: '一名无名骑士在竞技场连胜十场。' },
];

export const INITIAL_CHAT_LOG: Message[] = [
  { role: 'system', content: '初始化世界模型... 加载完成。欢迎回到艾瑟加德大陆。' },
  { role: 'model', content: '寒风呼啸着穿过破败的修道院废墟。你站在摇摇欲坠的石拱门下，手中的符文长剑微微发出幽蓝的光芒，警示着周围潜伏的危险。你的呼吸在冷空气中凝结成白雾。前方，通往地下墓穴的入口被某种黑暗的粘液封住了。你感觉到了微弱的魔力波动。\n\n你要怎么做？' }
];
