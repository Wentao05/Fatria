export interface Attributes {
  strength: number; // 力量
  agility: number; // 敏捷
  constitution: number; // 体质
  wisdom: number; // 智慧
  spirit: number; // 精神
  luck: number; // 气运
}

export interface Vitals {
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  stamina: number; // 耐力
  maxStamina: number;
}

export interface Experience {
  physical: number; // 锻体经验
  maxPhysical: number;
  magical: number; // 魔法经验
  maxMagical: number;
}

export interface CombatPower {
  physical: string; // 肉身战力 (Rated: C, B, A, S...)
  magical: string; // 魔法战力 (Rated: C, B, A, S...)
}

export interface EquipmentItem {
  name: string;
  description: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  // 品质文本, 允许中文(普通/稀有/史诗…)或英文(Common/Rare…)
  quality: string;
  type: string;
  description: string;
  effect?: string;
  quantity: number;
  value: number; // Gold value
}

export interface Equipment {
  weapon: EquipmentItem | null;
  armor: EquipmentItem | null;
  accessory: EquipmentItem | null;
}

export interface Currency {
  gold: number;
  silver: number;
  copper: number;
}

export interface NewsItem {
  id: string;
  content: string;
  time: string;
}

export interface Message {
  role: 'user' | 'model' | 'system';
  content: string;
}

export interface Character {
  name: string;
  race: string;
  class: string;
  attributes: Attributes;
  vitals: Vitals;
  experience: Experience;
  combatPower: CombatPower;
  status: string; // 当前状态
  equipment: Equipment;
  currency: Currency;
  inventory: InventoryItem[];
}

export interface GameGlobal {
  date: string;
  location: string;
}

export type ModalType = 'INVENTORY' | 'SKILLS' | 'QUESTS' | 'SOCIAL' | 'NEWS' | 'MAP' | 'PARALLEL_EVENTS' | null;
