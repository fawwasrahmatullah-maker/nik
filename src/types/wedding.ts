export type PartnerRole = 'partner1' | 'partner2';

export interface Partner {
  id: PartnerRole;
  name: string;
  nickname: string;
  avatar: string;
  color: string;
  targetShareRatio: number; // e.g. 50 for 50%
  pocketName: string; // e.g. "Rekening BCA Rizky"
}

export interface CoupleInfo {
  title: string; // e.g. "Pernikahan Rizky & Amanda"
  weddingDate: string; // YYYY-MM-DD
  location: string;
  targetAmount: number;
  estimatedGuests: number;
  partner1: Partner;
  partner2: Partner;
  jointAccountName: string; // e.g. "Kantong Bersama Bank Jago"
  jointAccountNumber?: string;
  notes: string;
}

export interface BudgetCategory {
  id: string;
  name: string;
  icon: string;
  allocatedAmount: number;
  color: string;
  description?: string;
}

export type TransactionType = 'deposit' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // YYYY-MM-DD
  partnerId: PartnerRole | 'joint';
  categoryId?: string; // For expense
  categoryName?: string;
  pocketSource?: string; // For deposit (e.g. "BCA Rizky", "Mandiri Amanda", "Tabungan Bersama")
  description: string;
  notes?: string;
  vendorName?: string;
  paymentStatus?: 'dp' | 'termin' | 'lunas'; // for expense
  createdAt: number;
}

export interface Milestone {
  id: string;
  title: string;
  targetPercentage: number;
  targetAmount: number;
  description: string;
  icon: string;
  badge: string;
  achieved: boolean;
  achievedDate?: string;
  celebrationMessage: string;
  isCustom?: boolean;
}

export interface CoupleNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'milestone' | 'deposit' | 'expense' | 'system';
  read: boolean;
  milestoneId?: string;
  amount?: number;
}

export interface LoveNote {
  id: string;
  authorId: PartnerRole;
  message: string;
  date: string;
  sticker: string;
}

export interface ChatMessage {
  id: string;
  senderId: PartnerRole | 'system';
  senderName: string;
  text: string;
  timestamp: number;
  sticker?: string;
  reaction?: string;
  type?: 'text' | 'savings_milestone' | 'pledge' | 'transfer_alert';
  highlightAmount?: number;
}
