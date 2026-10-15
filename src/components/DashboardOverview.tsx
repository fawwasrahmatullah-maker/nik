import React from 'react';
import { 
  CoupleInfo, 
  BudgetCategory, 
  Transaction, 
  Milestone, 
  PartnerRole 
} from '../types/wedding';
import { ProgressVisualizer } from './ProgressVisualizer';
import { ContributionSplitCard } from './ContributionSplitCard';
import { formatIDR, formatDateID } from '../utils/formatters';
import { 
  PlusCircle, 
  ArrowDownLeft, 
  ArrowUpRight, 
  MessageCircleHeart, 
  Calculator, 
  Sparkles, 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  Coins, 
  Clock 
} from 'lucide-react';

interface DashboardOverviewProps {
  coupleInfo: CoupleInfo;
  categories: BudgetCategory[];
  transactions: Transaction[];
  milestones: Milestone[];
  activePartner: PartnerRole | 'both';
  totalDeposited: number;
  totalExpenses: number;
  partner1Deposits: number;
  partner2Deposits: number;
  onOpenAddModal: (type?: 'deposit' | 'expense', partner?: PartnerRole) => void;
  onSelectMilestone: (m: Milestone) => void;
  onOpenCalculator: () => void;
  onNavigateToTab: (tab: 'dashboard' | 'categories' | 'transactions' | 'milestones' | 'chat' | 'loveNotes') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  coupleInfo,
  categories,
  transactions,
  milestones,
  activePartner,
  totalDeposited,
  totalExpenses,
  partner1Deposits,
  partner2Deposits,
  onOpenAddModal,
  onSelectMilestone,
  onOpenCalculator,
  onNavigateToTab,
}) => {
  const availableCash = totalDeposited - totalExpenses;
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt)
    .slice(0, 5);

  const activePartnerName = 
    activePartner === 'partner1' ? coupleInfo.partner1.nickname :
    activePartner === 'partner2' ? coupleInfo.partner2.nickname : 'Kalian Berdua';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-rose-200/50 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Semangat Menabung, {activePartnerName}! ✨</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
              Menuju Pelaminan Bahagia {coupleInfo.partner1.nickname} & {coupleInfo.partner2.nickname}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed">
              {coupleInfo.notes || 'Setiap langkah kecil dan rupiah yang kita sisihkan hari ini adalah fondasi keluarga berkah di masa depan.'}
            </p>
          </div>

          {/* Quick Action Button Hub */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => onOpenAddModal('deposit', activePartner === 'both' ? undefined : activePartner)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-rose-600 hover:bg-rose-50 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ Setor Tabungan</span>
            </button>

            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-xs sm:text-sm backdrop-blur-xs transition cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>- Catat Pengeluaran</span>
            </button>

            <button
              onClick={() => onNavigateToTab('chat')}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-medium text-xs transition cursor-pointer"
            >
              <MessageCircleHeart className="w-4 h-4 text-pink-300" />
              <span>Buka Obrolan Pasangan 💬</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Main Visual Progress Timeline & Milestones */}
      <ProgressVisualizer
        totalDeposited={totalDeposited}
        totalExpenses={totalExpenses}
        coupleInfo={coupleInfo}
        milestones={milestones}
        onSelectMilestone={onSelectMilestone}
      />

      {/* Couple Contribution Split Card */}
      <ContributionSplitCard
        coupleInfo={coupleInfo}
        partner1Deposits={partner1Deposits}
        partner2Deposits={partner2Deposits}
        jointDirectDeposits={0}
        totalDeposited={totalDeposited}
        totalExpenses={totalExpenses}
        onOpenAddDeposit={(p) => onOpenAddModal('deposit', p)}
      />

      {/* Two Column Layout: Recent Transactions + Category Budget Glance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Joint Transactions */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Aktivitas Keuangan Terbaru</h3>
                  <p className="text-xs text-slate-400">Mutasi kas bersama paling akhir</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('transactions')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Lihat Semua ➔
              </button>
            </div>

            <div className="space-y-2.5">
              {recentTransactions.map((tx) => {
                const isDep = tx.type === 'deposit';
                return (
                  <div
                    key={tx.id}
                    className="p-3 rounded-2xl bg-slate-50/70 border border-slate-100 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDep ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {isDep ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-800 block truncate">
                          {tx.description}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {formatDateID(tx.date)} • {tx.partnerId === 'partner1' ? coupleInfo.partner1.nickname : tx.partnerId === 'partner2' ? coupleInfo.partner2.nickname : 'Kas Bersama'}
                        </span>
                      </div>
                    </div>

                    <span className={`font-mono font-bold shrink-0 ${
                      isDep ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isDep ? '+' : '-'}{formatIDR(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => onOpenAddModal('deposit')}
            className="mt-4 w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl font-semibold text-xs border border-slate-200 transition cursor-pointer"
          >
            + Catat Mutasi Baru
          </button>
        </div>

        {/* Categories Budget Status */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-100 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Alokasi Vendor Terpenting</h3>
                  <p className="text-xs text-slate-400">Progres rencana vs realisasi</p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('categories')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Kelola Pos ➔
              </button>
            </div>

            <div className="space-y-3">
              {categories.slice(0, 4).map((c) => {
                const spent = transactions
                  .filter((t) => t.type === 'expense' && t.categoryId === c.id)
                  .reduce((sum, t) => sum + t.amount, 0);
                const pct = c.allocatedAmount > 0 ? (spent / c.allocatedAmount) * 100 : 0;

                return (
                  <div key={c.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700 truncate">{c.name}</span>
                      <span className="font-mono text-slate-600">
                        {formatIDR(spent)} / <span className="text-slate-400">{formatIDR(c.allocatedAmount)}</span>
                      </span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, pct)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>{categories.length} Pos Pengeluaran Terdaftar</span>
            <button
              onClick={onOpenCalculator}
              className="text-rose-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Hitung Ulang Anggaran</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
