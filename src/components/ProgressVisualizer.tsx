import React from 'react';
import { Milestone, CoupleInfo } from '../types/wedding';
import { formatIDR, calculateWeddingCountdown } from '../utils/formatters';
import { Check, Sparkles, Lock, Calendar, TrendingUp } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProgressVisualizerProps {
  totalDeposited: number;
  totalExpenses: number;
  coupleInfo: CoupleInfo;
  milestones: Milestone[];
  onSelectMilestone: (m: Milestone) => void;
}

export const ProgressVisualizer: React.FC<ProgressVisualizerProps> = ({
  totalDeposited,
  coupleInfo,
  milestones,
  onSelectMilestone,
}) => {
  const { themeConfig, isDark, isCute } = useTheme();
  const percentage = Math.min(100, Math.max(0, (totalDeposited / (coupleInfo.targetAmount || 1)) * 100));
  const remaining = Math.max(0, coupleInfo.targetAmount - totalDeposited);
  const countdown = calculateWeddingCountdown(coupleInfo.weddingDate);
  
  // Calculate recommended monthly savings pace
  const monthsLeft = Math.max(1, countdown.months + (countdown.remainingDays > 10 ? 1 : 0));
  const monthlyNeeded = remaining > 0 ? Math.ceil(remaining / monthsLeft) : 0;
  const perPartnerMonthly = Math.ceil(monthlyNeeded / 2);

  // Find next milestone to unlock
  const nextMilestone = milestones
    .filter((m) => m.targetAmount > totalDeposited)
    .sort((a, b) => a.targetAmount - b.targetAmount)[0];

  return (
    <div className={`${themeConfig.cardBg} rounded-3xl p-5 sm:p-7 border ${themeConfig.cardBorder} shadow-sm transition-colors duration-300`}>
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 ${themeConfig.accentBadge}`}>
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isCute ? 'Progres Tabungan Gemas 🍓' : 'Progres Akumulasi Dana Real-Time'}</span>
          </div>
          <h2 className={`text-xl sm:text-2xl font-serif font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
            {coupleInfo.title}
          </h2>
          <p className={`text-xs sm:text-sm mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Target Dana Impian: <span className={`font-semibold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formatIDR(coupleInfo.targetAmount)}</span> • Lokasi: {coupleInfo.location}
          </p>
        </div>

        {/* Big percentage badge */}
        <div className={`flex items-center gap-3 p-3.5 rounded-2xl border shadow-xs ${
          isDark 
            ? 'bg-slate-900 border-slate-800' 
            : isCute 
            ? 'bg-pink-50 border-pink-200' 
            : 'bg-white border-rose-100'
        }`}>
          <div className="text-right">
            <div className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Tercapai
            </div>
            <div className={`text-2xl sm:text-3xl font-black font-mono ${isDark ? 'text-rose-400' : isCute ? 'text-pink-600' : 'text-rose-600'}`}>
              {percentage.toFixed(1)}%
            </div>
          </div>
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm ${
            isCute 
              ? 'bg-pink-400 text-white' 
              : isDark 
              ? 'bg-slate-800 text-amber-400 border border-slate-700' 
              : 'bg-gradient-to-br from-rose-500 to-pink-500 text-white'
          }`}>
            {isCute ? '🎀' : isDark ? '💎' : '💍'}
          </div>
        </div>
      </div>

      {/* Main Visual Progress Track */}
      <div className="relative pt-6 pb-10 px-2 sm:px-4">
        {/* Track Background */}
        <div className={`h-4 sm:h-5 w-full rounded-full overflow-hidden p-0.5 shadow-inner relative ${themeConfig.progressTrack}`}>
          {/* Animated Fill Bar */}
          <div
            className={`h-full rounded-full bg-gradient-to-r ${themeConfig.progressGradient} transition-all duration-1000 ease-out relative shadow-sm`}
            style={{ width: `${Math.max(3, percentage)}%` }}
          >
            {/* Shimmer animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Milestone Checkpoint Nodes along the track */}
        <div className="relative w-full">
          {milestones.map((m) => {
            const isReached = totalDeposited >= m.targetAmount;
            const nodeLeft = `${m.targetPercentage}%`;

            return (
              <div
                key={m.id}
                onClick={() => onSelectMilestone(m)}
                style={{ left: nodeLeft }}
                className="absolute -top-7 sm:-top-8 -translate-x-1/2 flex flex-col items-center group cursor-pointer"
              >
                {/* Node Circle */}
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all transform group-hover:scale-125 z-10 border-2 ${
                    isReached
                      ? isDark
                        ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white border-slate-900 shadow-md ring-2 ring-rose-500/40 animate-pulse-glow'
                        : isCute
                        ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-white border-white shadow-md shadow-pink-300 ring-2 ring-pink-200'
                        : 'bg-gradient-to-tr from-rose-500 to-pink-500 text-white border-white shadow-md shadow-rose-300 ring-2 ring-rose-200 animate-pulse-glow'
                      : isDark
                      ? 'bg-slate-900 text-slate-500 border-slate-700'
                      : 'bg-white text-slate-500 border-slate-300 shadow-xs'
                  }`}
                >
                  {isReached ? <Check className="w-4 h-4 stroke-[3]" /> : <Lock className="w-3.5 h-3.5 opacity-60" />}
                </div>

                {/* Percentage Tag */}
                <span className={`text-[10px] sm:text-xs font-bold mt-1.5 transition-colors whitespace-nowrap ${
                  isReached 
                    ? isDark ? 'text-rose-400 font-extrabold' : 'text-rose-700 font-extrabold' 
                    : isDark ? 'text-slate-500' : 'text-slate-500'
                }`}>
                  {m.targetPercentage}%
                </span>

                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute -bottom-16 transition-opacity bg-slate-900 text-white text-[11px] rounded-lg py-1.5 px-2.5 shadow-xl whitespace-nowrap z-30">
                  <p className="font-bold">{m.title}</p>
                  <p className="text-rose-300 font-mono text-[10px]">{formatIDR(m.targetAmount)}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Target Progress Quick Summary Footer */}
      <div className={`grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t text-xs ${
        isDark ? 'border-slate-800' : 'border-slate-100'
      }`}>
        <div className={`p-3.5 rounded-2xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : isCute ? 'bg-pink-50/50 border-pink-100' : 'bg-white border-rose-100/60'
        }`}>
          <span className={`font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Total Tabungan Masuk</span>
          <span className="text-base sm:text-lg font-bold font-mono text-emerald-500">
            {formatIDR(totalDeposited)}
          </span>
          <span className={`block text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Akumulasi setoran kedua pihak
          </span>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          isDark ? 'bg-slate-900/60 border-slate-800' : isCute ? 'bg-pink-50/50 border-pink-100' : 'bg-white border-rose-100/60'
        }`}>
          <span className={`font-medium block mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Sisa Target Menuju Hari H</span>
          <span className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>
            {formatIDR(remaining)}
          </span>
          <span className={`block text-[11px] mt-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            {remaining === 0 ? '🎉 Sudah Terkumpul 100%!' : `Kurang ${(100 - percentage).toFixed(1)}% lagi`}
          </span>
        </div>

        <div className={`p-3.5 rounded-2xl border ${
          isDark 
            ? 'bg-slate-900/90 border-slate-700' 
            : isCute 
            ? 'bg-amber-50/70 border-amber-200' 
            : 'bg-gradient-to-r from-amber-50 to-rose-50 border-amber-200/60'
        }`}>
          <div className="flex items-center gap-1.5 font-semibold mb-1 text-amber-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Rekomendasi Tabungan/Bulan</span>
          </div>
          <span className={`text-base sm:text-lg font-bold font-mono ${isDark ? 'text-amber-300' : 'text-amber-950'}`}>
            {formatIDR(monthlyNeeded)} <span className="text-xs font-normal text-slate-400">/ bln</span>
          </span>
          <span className={`block text-[11px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            {remaining > 0 ? `Atau ${formatIDR(perPartnerMonthly)} / orang per bulan (${monthsLeft} bln lagi)` : 'Target telah lengkap!'}
          </span>
        </div>
      </div>

      {/* Next Milestone Banner */}
      {nextMilestone && (
        <div 
          onClick={() => onSelectMilestone(nextMilestone)}
          className={`mt-4 p-3 rounded-2xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition shadow-xs ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200' 
              : isCute 
              ? 'bg-pink-50/80 border-pink-200 hover:bg-pink-100 text-pink-950' 
              : 'bg-white/90 hover:bg-white border-rose-200/80 text-slate-800'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
              isDark ? 'bg-slate-800 text-amber-300' : isCute ? 'bg-pink-200 text-pink-700' : 'bg-rose-100 text-rose-600'
            }`}>
              🎯
            </div>
            <div>
              <span className="font-bold text-rose-500">Milestone Selanjutnya:</span>
              <span className="font-semibold ml-1.5">{nextMilestone.title} ({nextMilestone.targetPercentage}%)</span>
              <span className={`block text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Kurang <span className="font-mono font-bold text-rose-500">{formatIDR(nextMilestone.targetAmount - totalDeposited)}</span> lagi untuk membuka pencapaian ini!
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-lg font-semibold shrink-0 ${
            isDark ? 'bg-slate-800 text-rose-300' : 'bg-rose-50 hover:bg-rose-100 text-rose-700'
          }`}>
            Detail ➔
          </span>
        </div>
      )}
    </div>
  );
};
