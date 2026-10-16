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
  RotateCcw,
  Share2,
  Radio,
  Palette
} from 'lucide-react';
import { CoupleInfo, PartnerRole } from '../types/wedding';
import { calculateWeddingCountdown, formatDateID } from '../utils/formatters';
import { useTheme } from '../context/ThemeContext';

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
  roomId: string;
  syncStatus: 'connected' | 'connecting' | 'reconnecting' | 'offline';
  onOpenShareModal: () => void;
  onOpenThemeModal: () => void;
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
  roomId,
  syncStatus,
  onOpenShareModal,
  onOpenThemeModal,
}) => {
  const countdown = calculateWeddingCountdown(coupleInfo.weddingDate);
  const { theme, themeConfig, isDark, isCute } = useTheme();

  return (
    <header className={`sticky top-0 z-30 backdrop-blur-md border-b shadow-xs transition-colors duration-300 ${
      isDark 
        ? 'bg-[#111827]/95 border-slate-800' 
        : isCute 
        ? 'bg-[#FFF5F8]/95 border-pink-200' 
        : 'bg-white/95 border-rose-100'
    }`}>
      {/* Top Banner: Countdown & Quick Action Strip */}
      <div className={`bg-gradient-to-r ${themeConfig.topBannerGradient} text-white text-xs sm:text-sm py-1.5 px-4 shadow-2xs`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="inline-flex items-center justify-center p-0.5 rounded-full bg-white/20">
              <Calendar className="w-3.5 h-3.5" />
            </span>
            <span className="font-medium truncate">
              {isCute ? 'Hari Istimewa Kita 🌸: ' : 'Hari Bahagia: '}
              <span className="underline decoration-white/40">{formatDateID(coupleInfo.weddingDate)}</span>
            </span>
            <span className="hidden md:inline-block opacity-80">•</span>
            <span className="hidden md:inline-block font-semibold bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
              {countdown.isPast ? 'Hari bahagia telah tiba!' : `H-${countdown.totalDays} Hari (${countdown.months} Bulan ${countdown.remainingDays} Hari lagi) 💍`}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 text-xs">
            {/* Theme Trigger in Top Bar */}
            <button
              onClick={onOpenThemeModal}
              className="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md transition font-bold shadow-2xs cursor-pointer"
              title="Ganti Tema (Lucu, Gelap, Romantis, dll)"
            >
              <Palette className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tema: {themeConfig.icon} {themeConfig.name}</span>
            </button>

            {/* Share Link Realtime */}
            <button 
              onClick={onOpenShareModal}
              className="flex items-center gap-1.5 bg-white text-slate-800 hover:bg-slate-100 px-2.5 py-1 rounded-md transition font-bold shadow-xs cursor-pointer"
              title="Bagikan Link Pasangan (Data Real-Time)"
            >
              <Share2 className="w-3.5 h-3.5 text-rose-600" />
              <span className="hidden sm:inline">Bagikan Link</span>
            </button>

            <button 
              onClick={onOpenCalculator}
              className="hidden lg:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2.5 py-1 rounded-md transition font-medium cursor-pointer"
              title="Kalkulator Estimasi Biaya Pernikahan"
            >
              <Calculator className="w-3.5 h-3.5" />
              <span>Simulasi Budget</span>
            </button>

            <button 
              onClick={onExportData}
              className="hidden md:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition font-medium cursor-pointer"
              title="Cadangkan Data JSON"
            >
              <Download className="w-3 h-3" />
              <span>Backup</span>
            </button>

            <button 
              onClick={onImportData}
              className="hidden md:flex items-center gap-1 bg-white/20 hover:bg-white/30 px-2 py-1 rounded-md transition font-medium cursor-pointer"
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
          <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center text-white shadow-md transition-all ${
            isCute 
              ? 'bg-gradient-to-tr from-pink-400 to-rose-400 text-2xl shadow-pink-200 animate-bounce' 
              : isDark
              ? 'bg-gradient-to-tr from-slate-800 to-amber-500 shadow-slate-900 border border-slate-700'
              : 'bg-gradient-to-tr from-rose-500 to-amber-400 shadow-rose-200'
          }`}>
            {isCute ? '🎀' : isDark ? <Heart className="w-6 h-6 fill-amber-400 text-amber-400" /> : <Heart className="w-6 h-6 fill-white" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-rose-500 uppercase">NikahPlan</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${themeConfig.accentBadge}`}>
                {isCute ? 'Pasangan Gemas 🍓' : 'Pasangan'}
              </span>
              <button
                onClick={onOpenShareModal}
                className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border cursor-pointer ${
                  syncStatus === 'connected'
                    ? isDark ? 'bg-emerald-950 text-emerald-300 border-emerald-800' : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{syncStatus === 'connected' ? 'Realtime 🟢' : 'Menghubungkan...'}</span>
              </button>
            </div>
            <h1 className={`text-base sm:text-xl font-bold font-serif tracking-tight leading-none mt-0.5 ${
              isDark ? 'text-slate-100' : isCute ? 'text-pink-950' : 'text-slate-800'
            }`}>
              {coupleInfo.partner1.nickname} <span className="text-rose-500">{isCute ? '💖' : '&'}</span> {coupleInfo.partner2.nickname}
            </h1>
          </div>
        </div>

        {/* Center: Partner View Switcher (Who is viewing/saving) */}
        <div className={`hidden lg:flex items-center p-1 rounded-xl border text-xs ${
          isDark ? 'bg-slate-900/80 border-slate-800' : isCute ? 'bg-pink-100/60 border-pink-200' : 'bg-slate-100 border-slate-200'
        }`}>
          <span className={`font-medium px-2 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isCute ? 'Mode Aktif 🌸:' : 'Sedang Aktif:'}
          </span>
          <button
            onClick={() => setActivePartner('both')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
              activePartner === 'both'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-900 shadow-xs font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-white'
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
                : isDark
                ? 'text-slate-400 hover:text-blue-400'
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
                ? isCute ? 'bg-pink-500 text-white shadow-xs font-semibold' : 'bg-rose-600 text-white shadow-xs font-semibold'
                : isDark
                ? 'text-slate-400 hover:text-rose-400'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            <span>{coupleInfo.partner2.avatar}</span>
            <span>{coupleInfo.partner2.nickname}</span>
          </button>
        </div>

        {/* Right Action Icons: Theme, Share, Notification & Settings */}
        <div className="flex items-center gap-2">
          {/* Quick Theme Switcher Button */}
          <button
            onClick={onOpenThemeModal}
            className={`p-2.5 rounded-xl border transition cursor-pointer flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-amber-300 hover:bg-slate-700' 
                : isCute 
                ? 'bg-pink-100 border-pink-300 text-pink-700 hover:bg-pink-200' 
                : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
            }`}
            title="Ganti Tema & Suasana (Lucu, Gelap, Romantis)"
          >
            <Palette className="w-4 h-4" />
            <span className="text-xs font-bold hidden xl:inline">{themeConfig.icon} Tema</span>
          </button>

          {/* Share Link Button */}
          <button
            onClick={onOpenShareModal}
            className={`flex items-center gap-1.5 py-2 px-3 rounded-xl border text-xs font-bold transition cursor-pointer shadow-2xs ${
              isDark
                ? 'bg-slate-800 hover:bg-slate-700 text-rose-300 border-slate-700'
                : isCute
                ? 'bg-pink-100 hover:bg-pink-200 text-pink-700 border-pink-300'
                : 'bg-rose-50 hover:bg-rose-100 text-rose-700 border-rose-200'
            }`}
            title="Bagikan Link Pasangan Real-Time"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden md:inline">Bagikan Link</span>
          </button>

          {/* Notification Bell */}
          <button
            onClick={() => setIsNotificationOpen(true)}
            className={`relative p-2.5 rounded-xl border transition cursor-pointer ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-rose-400 hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50'
            }`}
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
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              isDark 
                ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800' 
                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
            title="Pengaturan Target & Pasangan"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Partner Switcher */}
      <div className={`flex lg:hidden px-4 pb-2 pt-1 border-t items-center justify-between gap-2 overflow-x-auto text-xs ${
        isDark ? 'border-slate-800' : isCute ? 'border-pink-200/60' : 'border-slate-100'
      }`}>
        <span className={`font-medium shrink-0 text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          {isCute ? 'Mode 🌸:' : 'Mode:'}
        </span>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActivePartner('both')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'both' ? 'bg-rose-500 text-white font-semibold' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            💍 Bersama
          </button>
          <button
            onClick={() => setActivePartner('partner1')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'partner1' ? 'bg-blue-600 text-white font-semibold' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {coupleInfo.partner1.avatar} {coupleInfo.partner1.nickname}
          </button>
          <button
            onClick={() => setActivePartner('partner2')}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium cursor-pointer ${
              activePartner === 'partner2' ? 'bg-rose-600 text-white font-semibold' : isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
            }`}
          >
            {coupleInfo.partner2.avatar} {coupleInfo.partner2.nickname}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className={`border-t px-4 sm:px-6 overflow-x-auto scrollbar-none transition-colors ${
        isDark ? 'border-slate-800 bg-slate-900/60' : isCute ? 'border-pink-200 bg-pink-50/60' : 'border-rose-100 bg-rose-50/40'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 min-w-max">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'dashboard'
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
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
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
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
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
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
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Milestone Target</span>
          </button>

          {/* CHAT MENU */}
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer relative ${
              activeTab === 'chat'
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                : 'text-slate-700 hover:text-rose-600 hover:bg-rose-100/60'
            }`}
          >
            <MessageCircleHeart className="w-4 h-4 text-pink-400 group-hover:text-white" />
            <span>Obrolan Pasangan</span>
            <span className={`inline-flex items-center justify-center text-[10px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider ${
              isCute ? 'bg-pink-600 text-white animate-pulse' : 'bg-rose-500 text-white'
            }`}>
              {isCute ? 'Gemoy ✨' : 'Seru ✨'}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('loveNotes')}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer ${
              activeTab === 'loveNotes'
                ? themeConfig.primaryButton
                : isDark
                ? 'text-slate-300 hover:text-white hover:bg-slate-800'
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
