import React from 'react';
import { CoupleInfo, PartnerRole } from '../types/wedding';
import { formatIDR } from '../utils/formatters';
import { Users, PlusCircle, ArrowDownLeft, ShieldCheck, HeartHandshake } from 'lucide-react';

interface ContributionSplitCardProps {
  coupleInfo: CoupleInfo;
  partner1Deposits: number;
  partner2Deposits: number;
  jointDirectDeposits: number;
  totalDeposited: number;
  totalExpenses: number;
  onOpenAddDeposit: (partner?: PartnerRole) => void;
}

export const ContributionSplitCard: React.FC<ContributionSplitCardProps> = ({
  coupleInfo,
  partner1Deposits,
  partner2Deposits,
  totalDeposited,
  totalExpenses,
  onOpenAddDeposit,
}) => {
  const p1Share = totalDeposited > 0 ? (partner1Deposits / totalDeposited) * 100 : 0;
  const p2Share = totalDeposited > 0 ? (partner2Deposits / totalDeposited) * 100 : 0;
  
  // Real-time Available Cash in joint account
  const availableCash = totalDeposited - totalExpenses;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <HeartHandshake className="w-4 h-4" />
            <span>Kemitraan & Transparansi Tabungan</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-800">
            Kontribusi Tabungan Berdua
          </h3>
          <p className="text-xs text-slate-500">
            Target komitmen pembagian: <span className="font-semibold text-slate-700">{coupleInfo.partner1.targetShareRatio}% {coupleInfo.partner1.nickname}</span> : <span className="font-semibold text-slate-700">{coupleInfo.partner2.targetShareRatio}% {coupleInfo.partner2.nickname}</span>
          </p>
        </div>

        {/* Joint Cash Available Badge */}
        <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl p-3 px-4 text-left sm:text-right">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase tracking-wider">
            Saldo Kas Bersama Saat Ini
          </span>
          <span className="text-lg sm:text-xl font-black font-mono text-emerald-800">
            {formatIDR(availableCash)}
          </span>
          <span className="text-[10px] text-emerald-600 block">
            Setelah dikurangi pengeluaran vendor ({formatIDR(totalExpenses)})
          </span>
        </div>
      </div>

      {/* Comparison visual bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-semibold mb-1.5">
          <span className="text-blue-700 flex items-center gap-1">
            <span>{coupleInfo.partner1.avatar}</span> {coupleInfo.partner1.nickname} ({p1Share.toFixed(1)}%)
          </span>
          <span className="text-rose-700 flex items-center gap-1">
            {coupleInfo.partner2.nickname} ({p2Share.toFixed(1)}%) <span>{coupleInfo.partner2.avatar}</span>
          </span>
        </div>

        <div className="h-4 bg-slate-100 rounded-full overflow-hidden flex p-0.5 border border-slate-200">
          <div
            className="bg-blue-500 rounded-l-full transition-all duration-700"
            style={{ width: `${p1Share}%` }}
            title={`${coupleInfo.partner1.nickname}: ${formatIDR(partner1Deposits)}`}
          />
          <div
            className="bg-rose-500 rounded-r-full transition-all duration-700"
            style={{ width: `${p2Share}%` }}
            title={`${coupleInfo.partner2.nickname}: ${formatIDR(partner2Deposits)}`}
          />
        </div>
      </div>

      {/* Two Partner Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Partner 1 Card */}
        <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center text-xl shadow-xs">
                  {coupleInfo.partner1.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{coupleInfo.partner1.name}</h4>
                  <span className="text-[11px] text-blue-600 font-medium">{coupleInfo.partner1.pocketName}</span>
                </div>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {p1Share.toFixed(1)}% Terkumpul
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs text-slate-500 block">Total Tabungan Terkumpul:</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-blue-700">
                {formatIDR(partner1Deposits)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenAddDeposit('partner1')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Catat Setoran {coupleInfo.partner1.nickname}</span>
          </button>
        </div>

        {/* Partner 2 Card */}
        <div className="bg-rose-50/40 rounded-2xl p-4 border border-rose-100/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-xl shadow-xs">
                  {coupleInfo.partner2.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{coupleInfo.partner2.name}</h4>
                  <span className="text-[11px] text-rose-600 font-medium">{coupleInfo.partner2.pocketName}</span>
                </div>
              </div>
              <span className="bg-rose-100 text-rose-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
                {p2Share.toFixed(1)}% Terkumpul
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <span className="text-xs text-slate-500 block">Total Tabungan Terkumpul:</span>
              <span className="text-xl sm:text-2xl font-black font-mono text-rose-700">
                {formatIDR(partner2Deposits)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onOpenAddDeposit('partner2')}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>+ Catat Setoran {coupleInfo.partner2.nickname}</span>
          </button>
        </div>
      </div>

      {/* Joint Account Info */}
      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Rekening / Kantong Bersama: <strong className="text-slate-800">{coupleInfo.jointAccountName}</strong>
            {coupleInfo.jointAccountNumber && <span className="font-mono ml-1 text-slate-700">({coupleInfo.jointAccountNumber})</span>}
          </span>
        </div>
        <span className="text-emerald-700 font-medium">Semua transaksi dicatat transparan berdua ✨</span>
      </div>
    </div>
  );
};
