import React from 'react';
import { 
  Heart, 
  Bell, 
  Calendar, 
  Settings, 
  Calculator, 
  MessageCircleHeart, 
  Wallet, 
  Trophy, 
  PieChart, 
  Download, 
  Upload, 
  RotateCcw
} from 'lucide-react';
import { CoupleInfo, PartnerRole } from '../types/wedding';
import { calculateWeddingCountdown, formatDateID } from '../utils/formatters';

interface HeaderProps {
  coupleInfo: CoupleInfo;
  activeTab: 'dashboard' | 'categories' | 'transactions' | 'milestones' | 'chat' | 'loveNotes';
  setActiveTab: (tab: 'dashboard' | 'categories' | 'transactions' | 'milestones' | 'chat' | 'loveNotes') => void;
  activePartner: PartnerRole | 'both';
  setActivePartner: (partner: PartnerRole | 'both') => void;
  unreadCount: number;
  setIsNotificationOpen: (open: boolean) => void;
  onOpenSettings: () => void;
  onOpenCalculator: () => void;
  onExportData: () => void;
  onImportData: () => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  coupleInfo,
  activeTab,
  setActiveTab,
  activePartner,
  setActivePartner,
  unreadCount,
  setIsNotificationOpen,
  onOpenSettings,
  onOpenCalculator,
  onExportData,
  onImportData,
  onResetData,
}) => {
  const countdown = calculateWeddingCountdown(coupleInfo.weddingDate);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top Banner: Countdown & Warm Greetings */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 text-white text-xs sm:text-sm py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-white/20">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium truncate">
              Hari Bahagia: <span className="underline decoration-white/40">{formatDateID(coupleInfo.weddingDate)}</span>
            </span>
            <span className="hidden md:inline-block opacity-80">•</span>
            <span className="hidden md:inline-block font-semibold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
              {countdown.isPast ? 'Hari bahagia telah tiba!' : `H-${countdown.totalDays} Hari (${countdown.months} Bulan ${countdown.remainingDays} Hari lagi) 💍`}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 text-xs">
            <button 
              onClick={onOpenCalculator}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
              title="Kalkulator Estimasi Biaya Pernikahan"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Simulasi Budget</span>
            </button>
            <button 
              onClick={onExportData}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition font-medium cursor-pointer"
              title="Cadangkan / Download Data"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Backup</span>
            </button>
            <button 
              onClick={onImportData}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition font-medium cursor-pointer"
              title="Pulihkan Data Backup JSON"
            >
              <Upload className="w-3 h-3" />
            </button>
            <button 
              onClick={onResetData}
              className="hover:bg-white/30 p-1 rounded-md transition cursor-pointer text-white/80 hover:text-white"
              title="Kembalikan ke Contoh Semula"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* App Title & Couple Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-rose-500 to-amber-400 flex items-center justify-center text-white shadow-md shadow-rose-200">
            <Heart className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-rose-600 uppercase">NikahPlan</span>
              <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.2 rounded font-semibold">Pasangan</span>
            </div>
            <h1 className="text-base sm:text-xl font-bold font-serif text-slate-800 tracking-tight leading-none mt-0.5">
              {coupleInfo.partner1.nickname} <span className="text-rose-500">&</span> {coupleInfo.partner2.nickname}
            </h1>
          </div>
        </div>

        {/* Center: Partner View Switcher (Who is viewing/saving) */}
        <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-slate-500 font-medium px-2 text-[11px]">Sedang Aktif:</span>
          <button
            onClick={() => setActivePartner('both')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activePartner === 'both'
                ? 'bg-white text-slate-900 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>💍</span>
            <span>Keduanya (Bersama)</span>
          </button>
          <button
            onClick={() => setActivePartner('partner1')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activePartner === 'partner1'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            <span>{coupleInfo.partner1.avatar}</span>
            <span>{coupleInfo.partner1.nickname}</span>
          </button>
          <button
            onClick={() => setActivePartner('partner2')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activePartner === 'partner2'
                ? 'bg-rose-600 text-white shadow-xs font-semibold'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span>{coupleInfo.partner2.avatar}</span>
            <span>{coupleInfo.partner2.nickname}</span>
          </button>
        </div>

        {/* Right Action Icons: Notification & Settings */}
        <div className="flex items-center gap-2">
          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className="relative p-2.5 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition cursor-pointer"
            aria-label="Lihat Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center animate-bounce shadow-xs">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            className="p-2.5 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
            title="Pengaturan Target & Pasangan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Partner Switcher */}
      <div className="flex lg:hidden px-4 pb-2 pt-1 border-t border-slate-100 items-center justify-between gap-2 overflow-x-auto text-xs">
        <span className="text-slate-500 font-medium shrink-0 text-[11px]">Mode:</span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActivePartner('both')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'both' ? 'bg-rose-500 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            💍 Bersama
          </button>
          <button
            onClick={() => setActivePartner('partner1')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'partner1' ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {coupleInfo.partner1.avatar} {coupleInfo.partner1.nickname}
          </button>
          <button
            onClick={() => setActivePartner('partner2')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'partner2' ? 'bg-rose-600 text-white font-semibold' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {coupleInfo.partner2.avatar} {coupleInfo.partner2.nickname}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="border-t border-rose-100 bg-rose-50/40 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <PieChart className="w-4 h-4" />
            <span>Dasbor Progres</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <Wallet className="w-4 h-4" />
            <span>Anggaran Vendor</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'transactions'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <span className="font-mono text-xs">Rp</span>
            <span>Transaksi & Catatan</span>
          </button>

          <button
            onClick={() => setActiveTab('milestones')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'milestones'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Milestone Target</span>
          </button>

          {/* CHAT MENU: "Tambahkan menu chat agar menabung dapat lebih menyenangkan" */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer relative ${
              activeTab === 'chat'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-700 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4 text-pink-400 group-hover:text-white" />
            <span>Obrolan Pasangan</span>
            <span className="inline-flex items-center justify-center bg-rose-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              Seru ✨
            </span>
          </button>

          <button
            onClick={() => setActiveTab('loveNotes')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'loveNotes'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-500" />
            <span>Catatan Cinta</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
