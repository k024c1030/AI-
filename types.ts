export enum MessageRole {
  USER = 'user',
  MODEL = 'model',
}

export interface ChatMessage {
  id: number;
  role: MessageRole;
  text: string;
}

export interface Monster {
    name: string;
    description: string;
    score: number;
    currentHP: number;
    imageUrl: string;
}

export interface StressAnalysis {
    stressScore: number;
    monsterName: string;
    monsterDescription: string;
}

export interface StressRecord {
  date: string; // ISO string
  score: number;
}

export interface SleepRecord {
  date: string; // ISO string for the wake-up day
  bedTime: string; // "HH:mm"
  wakeTime: string; // "HH:mm"
  duration: number; // in hours
}

export interface DiaryAchievement {
    predefined: Record<string, boolean>;
    custom: { id: number; text: string }[];
}

export interface DiaryEntry {
    date: string; // YYYY-MM-DD
    plan: string;
    achievements: DiaryAchievement;
    score: number;
}

export interface ToDoItem {
  id: number;
  title: string;
  dueDate: string | null; // YYYY-MM-DD
  startTime: string | null; // HH:mm
  endTime: string | null; // HH:mm
  memo: string;
  isCompleted: boolean;
  isFavorite: boolean;
  order: number;
}


export type AppState = 'HOME' | 'CHAT' | 'MONSTER_REVEAL' | 'ATTACK_RESULT';
