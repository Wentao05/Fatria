export enum Race {
  HUMAN = '人类',
  DEMON = '魔族',
  ELF = '精灵',
  DEMI_HUMAN = '亚人',
  WINGED = '翼族',
  SEA_FOLK = '海族',
}

export interface Stats {
  strength: number; // 力量
  agility: number; // 敏捷
  intelligence: number; // 智力
  constitution: number; // 体质
  spirit: number; // 精神
}

export interface CharacterData {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  personality: string;
  race: Race;
  subRace?: string; // 亚种
  stats: Stats;
  description: string;
  scenario: string;
}

export enum AppState {
  INTRO = 'INTRO',
  CREATION = 'CREATION',
  GENERATING = 'GENERATING',
}

export const MAX_STAT_POINTS = 20;
export const BASE_STAT = 5;
