export enum UserStatus {
  NEW = 'NEW',
  ACTIVE = 'ACTIVE',
  RESTRICTED = 'RESTRICTED'
}

export enum MissionCategory {
  ONBOARDING = 'Onboarding & Identiteit',
  QUALITY = 'Kwaliteitscontrole',
  REVIEW = 'Review & Verificatie',
  CONTENT = 'Content',
  MARKETING = 'Marketing & Groei',
  NETWORK = 'Netwerk & Relaties',
  SALES = 'Sales ondersteuning',
  INVESTMENT = 'Investering & Analyse',
  METADATA = 'Meta-data & Structuur',
  COMMUNITY = 'Community & Cultuur',
  GOVERNANCE = 'Governance & Betrouwbaarheid',
  // Prio specific
  PRIO_REFERRAL = 'Prio: Referrals',
  PRIO_CONTENT = 'Prio: Content',
  PRIO_NETWORK = 'Prio: Netwerk',
  PRIO_METADATA = 'Prio: Meta-data',
  PRIO_CHECKIN = 'Prio: Check-in'
}

export enum MissionStatus {
  LOCKED = 'LOCKED',
  AVAILABLE = 'AVAILABLE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  REVIEWING = 'REVIEWING'
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  level: number;
  xp: number; // Progress within level (0-100)
  status: UserStatus;
  avatarUrl: string;
  teamId?: string;
  specializations: string[];
  bio?: string;
}

export interface Team {
  id: string;
  name: string;
  members: string[]; // User IDs
  score: number;
}

export interface MissionStep {
  id: string;
  title: string;
  description: string;
  requiredInputType?: 'text' | 'long_text' | 'number' | 'email' | 'file' | 'date' | 'select' | 'boolean' | 'iban' | 'url';
  options?: string[]; // For select
  completed: boolean;
  validationRegex?: string;
}

export interface Mission {
  id: string;
  title: string;
  category: MissionCategory;
  description: string;
  xpReward: number; // Usually 1 level worth
  status: MissionStatus;
  isPrio: boolean;
  steps: MissionStep[];
  requirements?: {
    minLevel?: number;
    requiredMissionIds?: string[];
  };
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'mission_invite';
  read: boolean;
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  timestamp: number;
  roomId: string; // 'global' or teamId
}