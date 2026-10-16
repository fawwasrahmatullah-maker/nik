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
import { useTheme } from '../context/ThemeContext';
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
  const { themeConfig, isDark, isCute } = useTheme();
  const availableCash = totalDeposited - totalExpenses;
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt)
    .slice(0, 5);

  const activePartnerName = 
    activePartner === 'partner1' ? coupleInfo.partner1.nickname :
    activePartner === 'partner2' ? coupleInfo.partner2.nickname : 'Kalian Berdua';

  return (
    <div className="space-y-6">
      {/* Welcome Banner with Dynamic Theme Gradient */}
      <div className={`bg-gradient-to-r ${themeConfig.heroGradient} rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden transition-all duration-300`}>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isCute ? '🎀 Semangat Nabung Cinta, ' : 'Semangat Menabung, '}{activePartnerName}! {isCute ? '🍓' : '✨'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold tracking-tight">
              Menuju Pelaminan Bahagia {coupleInfo.partner1.nickname} {isCute ? '💖' : '&'} {coupleInfo.partner2.nickname}
            </h1>
            <p className="text-white/90 text-xs sm:text-sm mt-2 leading-relaxed">
              {coupleInfo.notes || 'Setiap langkah kecil dan rupiah yang kita sisihkan hari ini adalah fondasi keluarga berkah di masa depan.'}
            </p>
          </div>

          {/* Quick Action Button Hub */}
          <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
            <button
              onClick={() => onOpenAddModal('deposit', activePartner === 'both' ? undefined : activePartner)}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs sm:text-sm shadow-md transition cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4 text-emerald-600" />
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
              <span>{isCute ? 'Ruang Obrolan Gemoy 💬' : 'Buka Obrolan Pasangan 💬'}</span>
            </button>
          </div>
        </div>

        {/* Cute or Romantic Background accents */}
        {isCute ? (
          <div className="absolute -bottom-6 -right-6 text-7xl opacity-20 pointer-events-none select-none animate-pulse">
            🎀🍓🌸
          </div>
        ) : (
          <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        )}
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
        <div className={`${themeConfig.cardBg} rounded-3xl p-5 sm:p-6 border ${themeConfig.cardBorder} shadow-xs flex flex-col justify-between transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
                  <Coins className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {isCute ? 'Mutasi Tabungan Terkini 🍓' : 'Aktivitas Keuangan Terbaru'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Mutasi kas bersama paling akhir
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('transactions')}
                className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
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
                    className={`p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs transition-colors ${
                      isDark 
                        ? 'bg-slate-900/60 border-slate-800 hover:border-slate-700' 
                        : isCute 
                        ? 'bg-pink-50/50 border-pink-100 hover:border-pink-200' 
                        : 'bg-slate-50/70 border-slate-100 hover:border-rose-100'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isDep 
                          ? isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-700' 
                          : isDark ? 'bg-rose-950 text-rose-400' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {isDep ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div className="min-w-0">
                        <span className={`font-bold block truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                          {tx.description}
                        </span>
                        <span className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                          {formatDateID(tx.date)} • {tx.partnerId === 'partner1' ? coupleInfo.partner1.nickname : tx.partnerId === 'partner2' ? coupleInfo.partner2.nickname : 'Kas Bersama'}
                        </span>
                      </div>
                    </div>

                    <span className={`font-mono font-bold shrink-0 ${
                      isDep ? 'text-emerald-500' : 'text-rose-500'
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
            className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-xs border transition cursor-pointer ${
              isDark 
                ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' 
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            + Catat Mutasi Baru
          </button>
        </div>

        {/* Categories Budget Status */}
        <div className={`${themeConfig.cardBg} rounded-3xl p-5 sm:p-6 border ${themeConfig.cardBorder} shadow-xs flex flex-col justify-between transition-colors`}>
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl ${isDark ? 'bg-rose-950 text-rose-400' : 'bg-rose-50 text-rose-600'}`}>
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className={`font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                    {isCute ? 'Pos Vendor Impian 🌸' : 'Alokasi Vendor Terpenting'}
                  </h3>
                  <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                    Progres rencana vs realisasi
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateToTab('categories')}
                className="text-xs font-semibold text-rose-500 hover:underline cursor-pointer"
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
                      <span className={`truncate ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{c.name}</span>
                      <span className="font-mono">
                        <span className={isDark ? 'text-slate-200' : 'text-slate-700'}>{formatIDR(spent)}</span>
                        <span className={isDark ? 'text-slate-500' : 'text-slate-400'}> / {formatIDR(c.allocatedAmount)}</span>
                      </span>
                    </div>
                    <div className={`h-2 rounded-full overflow-hidden ${isDark ? 'bg-slate-800' : 'bg-slate-100'}`}>
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

          <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs ${
            isDark ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>{categories.length} Pos Pengeluaran Terdaftar</span>
            <button
              onClick={onOpenCalculator}
              className="text-rose-500 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
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
