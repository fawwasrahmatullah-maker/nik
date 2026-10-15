import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Milestone, CoupleInfo } from '../types/wedding';
import { formatIDR } from '../utils/formatters';
import { Sparkles, Trophy, X, Share2, Heart, MessageSquare } from 'lucide-react';

interface MilestoneCelebrationModalProps {
  milestone: Milestone | null;
  coupleInfo: CoupleInfo;
  onClose: () => void;
  onSendToChat?: (text: string) => void;
}

export const MilestoneCelebrationModal: React.FC<MilestoneCelebrationModalProps> = ({
  milestone,
  coupleInfo,
  onClose,
  onSendToChat,
}) => {
  useEffect(() => {
    if (milestone) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#EC4899', '#F59E0B', '#10B981', '#6366F1'],
        });
      } catch {
        // ignore
      }
    }
  }, [milestone]);

  if (!milestone) return null;

  const shareText = `Alhamdulillah! Tabungan pernikahan kita (${coupleInfo.partner1.nickname} & ${coupleInfo.partner2.nickname}) telah mencapai milestone "${milestone.title}" senilai ${formatIDR(milestone.targetAmount)} (${milestone.targetPercentage}%)! Semangat menuju hari bahagia! 💍👰🤵🎉`;

  const handleShareWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleSendToChat = () => {
    if (onSendToChat) {
      onSendToChat(`🎉 ALHAMDULILLAH! Kita baru saja menembus Milestone ${milestone.targetPercentage}%: "${milestone.title}" senilai ${formatIDR(milestone.targetAmount)}! Makasih cinta, perjuangan kita berbuah manis! 💖💍`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden transform transition-all p-6 sm:p-8 text-center">
        {/* Background Decorative Rings */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-rose-200 to-amber-200 rounded-full blur-2xl opacity-60 pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-gradient-to-tr from-pink-200 to-rose-200 rounded-full blur-2xl opacity-60 pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Milestone Icon Badge */}
        <div className="relative mx-auto w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-500 via-pink-500 to-amber-400 p-1 shadow-lg shadow-rose-200 animate-pulse-glow flex items-center justify-center text-white mb-5">
          <Trophy className="w-10 h-10 animate-bounce" />
          <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-0.5 rounded-full shadow-xs">
            {milestone.targetPercentage}%
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Milestone Tercapai!</span>
        </div>

        <h3 className="text-2xl font-serif font-bold text-slate-800 mb-2">
          {milestone.title}
        </h3>

        <p className="text-sm text-slate-600 mb-4 px-2">
          {milestone.description}
        </p>

        {/* Amount Box */}
        <div className="bg-rose-50/80 rounded-2xl p-4 border border-rose-100 mb-6">
          <div className="text-xs text-rose-600 font-semibold uppercase tracking-wider mb-1">
            Dana Akumulasi Terlampaui
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-rose-700 font-mono">
            {formatIDR(milestone.targetAmount)}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            Target {milestone.targetPercentage}% dari total impian {formatIDR(coupleInfo.targetAmount)}
          </div>
        </div>

        {/* Celebration Quote */}
        <div className="relative bg-amber-50/70 border border-amber-200/60 rounded-xl p-3.5 mb-6 text-xs sm:text-sm text-amber-900 italic flex items-center gap-2 text-left">
          <Heart className="w-5 h-5 text-rose-500 shrink-0 fill-rose-500" />
          <span>&ldquo;{milestone.celebrationMessage}&rdquo;</span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {onSendToChat && (
            <button
              onClick={handleSendToChat}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-sm transition shadow-md shadow-rose-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Rayakan di Obrolan</span>
            </button>
          )}

          <button
            onClick={handleShareWhatsApp}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-md shadow-emerald-200 cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim ke WhatsApp</span>
          </button>
        </div>

        <button
          onClick={onClose}
          className="mt-3 text-xs text-slate-400 hover:text-slate-600 font-medium cursor-pointer"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};
