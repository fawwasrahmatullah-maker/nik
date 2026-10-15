import React, { useState } from 'react';
import { X, Settings, Heart, Calendar, Users, Wallet, Check } from 'lucide-react';
import { CoupleInfo } from '../types/wedding';
import { formatIDR } from '../utils/formatters';

interface CoupleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  coupleInfo: CoupleInfo;
  onSave: (updated: CoupleInfo) => void;
}

export const CoupleSettingsModal: React.FC<CoupleSettingsModalProps> = ({
  isOpen,
  onClose,
  coupleInfo,
  onSave,
}) => {
  const [formData, setFormData] = useState<CoupleInfo>({ ...coupleInfo });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-xl bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Pengaturan Pasangan & Target</h3>
              <p className="text-xs text-slate-500">Sesuaikan profil, tanggal pernikahan, & akun bersama</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* General Wedding Info */}
          <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200/80 space-y-3">
            <h4 className="font-bold text-slate-700 text-xs flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Detail Pernikahan</span>
            </h4>

            <div>
              <label className="font-semibold text-slate-600 block mb-1">Judul / Acara Pernikahan</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Tanggal Hari Bahagia (H-Day)</label>
                <input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Kota / Lokasi Acara</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Target Total Dana Impian (Rp)</label>
                <input
                  type="number"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData({ ...formData, targetAmount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 font-mono font-bold text-xs focus:ring-2 focus:ring-rose-400"
                  required
                  step="1000000"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Estimasi Jumlah Tamu (Orang)</label>
                <input
                  type="number"
                  value={formData.estimatedGuests}
                  onChange={(e) => setFormData({ ...formData, estimatedGuests: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>
            </div>
          </div>

          {/* Partner 1 (Groom / Calon Pengantin 1) */}
          <div className="bg-blue-50/50 p-3.5 rounded-2xl border border-blue-200/80 space-y-2">
            <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <span>{formData.partner1.avatar}</span>
              <span>Pasangan 1 (Pihak 1)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.partner1.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    partner1: { ...formData.partner1, name: e.target.value },
                  })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={formData.partner1.nickname}
                  onChange={(e) => setFormData({
                    ...formData,
                    partner1: { ...formData.partner1, nickname: e.target.value },
                  })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Sumber Rekening Pribadi</label>
              <input
                type="text"
                value={formData.partner1.pocketName}
                onChange={(e) => setFormData({
                  ...formData,
                  partner1: { ...formData.partner1, pocketName: e.target.value },
                })}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Partner 2 (Bride / Calon Pengantin 2) */}
          <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-200/80 space-y-2">
            <h4 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
              <span>{formData.partner2.avatar}</span>
              <span>Pasangan 2 (Pihak 2)</span>
            </h4>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={formData.partner2.name}
                  onChange={(e) => setFormData({
                    ...formData,
                    partner2: { ...formData.partner2, name: e.target.value },
                  })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nama Panggilan</label>
                <input
                  type="text"
                  value={formData.partner2.nickname}
                  onChange={(e) => setFormData({
                    ...formData,
                    partner2: { ...formData.partner2, nickname: e.target.value },
                  })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
                  required
                />
              </div>
            </div>
            <div>
              <label className="font-semibold text-slate-600 block mb-1">Sumber Rekening Pribadi</label>
              <input
                type="text"
                value={formData.partner2.pocketName}
                onChange={(e) => setFormData({
                  ...formData,
                  partner2: { ...formData.partner2, pocketName: e.target.value },
                })}
                className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>

          {/* Joint Bank Account */}
          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
            <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
              <Wallet className="w-3.5 h-3.5 text-emerald-700" />
              <span>Rekening / Kas Bersama</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nama Bank / Kantong</label>
                <input
                  type="text"
                  value={formData.jointAccountName}
                  onChange={(e) => setFormData({ ...formData, jointAccountName: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-600 block mb-1">Nomor Rekening Bersama</label>
                <input
                  type="text"
                  value={formData.jointAccountNumber || ''}
                  onChange={(e) => setFormData({ ...formData, jointAccountNumber: e.target.value })}
                  className="w-full px-3 py-1.5 bg-white rounded-xl border border-slate-200 font-mono text-xs"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shadow-xs"
            >
              Simpan Pengaturan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
