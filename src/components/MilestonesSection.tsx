import React, { useState } from 'react';
import { Milestone, CoupleInfo } from '../types/wedding';
import { formatIDR, formatDateID } from '../utils/formatters';
import { 
  Trophy, 
  Check, 
  Lock, 
  Sparkles, 
  Plus, 
  PartyPopper, 
  Calendar, 
  Share2, 
  X, 
  Trash2 
} from 'lucide-react';

interface MilestonesSectionProps {
  milestones: Milestone[];
  totalDeposited: number;
  coupleInfo: CoupleInfo;
  onSelectMilestone: (m: Milestone) => void;
  onAddCustomMilestone: (m: Omit<Milestone, 'id' | 'achieved'>) => void;
  onDeleteMilestone: (id: string) => void;
}

export const MilestonesSection: React.FC<MilestonesSectionProps> = ({
  milestones,
  totalDeposited,
  coupleInfo,
  onSelectMilestone,
  onAddCustomMilestone,
  onDeleteMilestone,
}) => {
  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCelebrationMsg, setNewCelebrationMsg] = useState('');

  const sortedMilestones = [...milestones].sort((a, b) => a.targetAmount - b.targetAmount);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const num = Number(newAmount.replace(/\D/g, ''));
    if (!num || !newTitle.trim()) return;

    const percentage = Math.round((num / (coupleInfo.targetAmount || 1)) * 100);

    onAddCustomMilestone({
      title: newTitle.trim(),
      targetPercentage: percentage,
      targetAmount: num,
      description: newDesc.trim() || `Pencapaian target ${formatIDR(num)}`,
      icon: 'Trophy',
      badge: `${percentage}% Custom`,
      celebrationMessage: newCelebrationMsg.trim() || `Alhamdulillah, pencapaian ${newTitle} berhasil kita lewati bersama! 🎉`,
      isCustom: true,
    });

    setNewTitle('');
    setNewAmount('');
    setNewDesc('');
    setNewCelebrationMsg('');
    setIsAddingCustom(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Trophy className="w-4 h-4" />
              <span>Sistem Notifikasi & Penghargaan Otomatis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
              Pencapaian & Milestone Bersama
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Setiap kali setoran kalian menyentuh ambang batas tertentu, sistem secara otomatis mengaktifkan perayaan konfeti, notifikasi, dan audio fanfare!
            </p>
          </div>

          <button
            onClick={() => setIsAddingCustom(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Buat Milestone Kustom</span>
          </button>
        </div>

        <div className="bg-rose-50/60 p-4 rounded-2xl border border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              🎉
            </div>
            <div>
              <span className="font-bold text-slate-800 block text-sm">
                {milestones.filter((m) => totalDeposited >= m.targetAmount).length} dari {milestones.length} Milestone Terbuka!
              </span>
              <span className="text-slate-500 text-xs">
                Total dana saat ini: <strong className="text-emerald-700 font-mono">{formatIDR(totalDeposited)}</strong>
              </span>
            </div>
          </div>
          <span className="text-rose-700 font-semibold text-xs">
            Klik kartu milestone untuk melihat selebrasi atau membagikannya ➔
          </span>
        </div>
      </div>

      {/* Milestones Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedMilestones.map((m) => {
          const isReached = totalDeposited >= m.targetAmount;
          const progressToThis = Math.min(100, Math.max(0, (totalDeposited / m.targetAmount) * 100));
          const diff = m.targetAmount - totalDeposited;

          return (
            <div
              key={m.id}
              onClick={() => onSelectMilestone(m)}
              className={`rounded-3xl p-5 sm:p-6 border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isReached
                  ? 'bg-gradient-to-br from-white via-rose-50/40 to-amber-50/30 border-rose-200 shadow-sm hover:shadow-md'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Corner badge */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                  isReached
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {isReached ? <Check className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                  <span>{isReached ? 'Tercapai & Terbuka' : 'Terkunci'}</span>
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black font-mono px-2 py-0.5 rounded-md bg-rose-100 text-rose-800">
                    {m.targetPercentage}%
                  </span>
                  {m.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Hapus milestone "${m.title}"?`)) {
                          onDeleteMilestone(m.id);
                        }
                      }}
                      className="p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50"
                      title="Hapus Milestone Kustom"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-serif font-bold text-slate-800 text-base sm:text-lg mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                  {m.description}
                </p>

                {/* Target Amount */}
                <div className="bg-slate-50/80 p-3 rounded-2xl border border-slate-100 mb-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Nilai Ambang Batas:</span>
                  <span className="font-mono font-bold text-sm sm:text-base text-slate-800">
                    {formatIDR(m.targetAmount)}
                  </span>
                </div>

                {/* Progress Mini Bar */}
                <div className="mb-2">
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-slate-400">Progres: {progressToThis.toFixed(0)}%</span>
                    <span className={isReached ? 'text-emerald-700 font-semibold' : 'text-slate-600'}>
                      {isReached ? 'Tercapai 100%' : `Kurang ${formatIDR(diff)}`}
                    </span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${
                        isReached ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${progressToThis}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Celebration Message preview */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="italic truncate max-w-[260px]">
                  &ldquo;{m.celebrationMessage}&rdquo;
                </span>
                <span className="text-rose-600 font-semibold shrink-0 ml-2">
                  Lihat ➔
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Milestone Modal */}
      {isAddingCustom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-rose-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Buat Milestone Kustom</h3>
              <button
                onClick={() => setIsAddingCustom(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Pencapaian / Milestone *
                </label>
                <input
                  type="text"
                  placeholder="Contoh: DP Cincin Emas Putih & Seserahan"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nominal Tabungan Target (Rp) *
                </label>
                <input
                  type="number"
                  placeholder="Contoh: 45000000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Deskripsi Singkat
                </label>
                <textarea
                  placeholder="Arti penting pencapaian ini bagi rencana pernikahan kalian..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pesan Romantis / Rayakan Bersama
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Alhamdulillah cincin kawin impian kita sudah siap dipesan! 💍"
                  value={newCelebrationMsg}
                  onChange={(e) => setNewCelebrationMsg(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCustom(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
                >
                  Simpan Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
