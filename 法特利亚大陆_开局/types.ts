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
  fortune: number; // 气运
}

export interface StartingSkill {
  id: string;
  name: string;
  /** 技能等级，如 初阶/中阶/高阶/极阶/禁忌 等 */
  level?: string;
  /** 技能类型，如 物理/魔法/被动/辅助 等 */
  skillType?: string;
  /** 技能描述 */
  description: string;
  /** 使用消耗，如 10MP / 5耐力 */
  cost?: string;
  /** 具体效果说明 */
  effect?: string;
  isCustom?: boolean;
}

export interface CharacterData {
  name: string;
  gender: 'male' | 'female' | 'other';
  age: number;
  personality: string;
  race: Race;
  subRace?: string; // 亚种
  stats: Stats;
  startingSkills: StartingSkill[];
  description: string;
  scenario: string;
}

export enum AppState {
  INTRO = 'INTRO',
  CREATION = 'CREATION',
  GENERATING = 'GENERATING',
}

export const MAX_STAT_POINTS = 25;
export const BASE_STAT = 5;
