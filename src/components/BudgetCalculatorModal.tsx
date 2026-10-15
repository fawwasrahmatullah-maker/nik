import React, { useState } from 'react';
import { X, Calculator, Sparkles, Check, CheckCircle, ArrowRight } from 'lucide-react';
import { formatIDR } from '../utils/formatters';
import { BudgetCategory } from '../types/wedding';

interface BudgetCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBudget: (newTarget: number, suggestedCategories: BudgetCategory[]) => void;
  currentTarget: number;
}

interface TierConfig {
  name: string;
  badge: string;
  description: string;
  costPerGuest: number; // approximate total cost per guest multiplier
  baseFixedCost: number;
  proportions: {
    cateringVenue: number;
    decor: number;
    attireMua: number;
    photoVideo: number;
    ringMahar: number;
    invitationSouvenir: number;
    entertainment: number;
    emergency: number;
  };
}

const TIERS: Record<string, TierConfig> = {
  intimate: {
    name: 'Intimate & Minimalist (Hemat & Hangat)',
    badge: 'Paling Populer & Cerdas',
    description: 'Cocok untuk pesta keluarga di resto/outdoor intim, fokus pada kehangatan dan minim pemborosan.',
    costPerGuest: 160000,
    baseFixedCost: 25000000,
    proportions: {
      cateringVenue: 0.42,
      decor: 0.15,
      attireMua: 0.13,
      photoVideo: 0.10,
      ringMahar: 0.10,
      invitationSouvenir: 0.04,
      entertainment: 0.03,
      emergency: 0.03,
    },
  },
  modern: {
    name: 'Modern Elegant (Gedung Standar / Populer)',
    badge: 'Standar Pernikahan Nasional',
    description: 'Pilihan favorit pasangan di gedung serbaguna/hall dengan buffet lengkap, dekorasi megah, dan liputan cinematic.',
    costPerGuest: 230000,
    baseFixedCost: 35000000,
    proportions: {
      cateringVenue: 0.45,
      decor: 0.16,
      attireMua: 0.12,
      photoVideo: 0.10,
      ringMahar: 0.08,
      invitationSouvenir: 0.04,
      entertainment: 0.03,
      emergency: 0.02,
    },
  },
  luxury: {
    name: 'Luxury Grand Ballroom (Hotel Bintang / Mewah)',
    badge: 'Eksklusif & Spektakuler',
    description: 'Ballroom hotel bintang 4/5, full orchestra/band, lighting megah, katering bintang lima, live video drone.',
    costPerGuest: 380000,
    baseFixedCost: 70000000,
    proportions: {
      cateringVenue: 0.48,
      decor: 0.18,
      attireMua: 0.11,
      photoVideo: 0.09,
      ringMahar: 0.06,
      invitationSouvenir: 0.03,
      entertainment: 0.03,
      emergency: 0.02,
    },
  },
};

export const BudgetCalculatorModal: React.FC<BudgetCalculatorModalProps> = ({
  isOpen,
  onClose,
  onApplyBudget,
  currentTarget,
}) => {
  const [guests, setGuests] = useState<number>(450);
  const [selectedTier, setSelectedTier] = useState<string>('modern');

  if (!isOpen) return null;

  const tier = TIERS[selectedTier];
  const calculatedTotal = Math.round((tier.baseFixedCost + guests * tier.costPerGuest) / 1000000) * 1000000;

  const suggestedCategories: BudgetCategory[] = [
    {
      id: 'cat-venue-catering',
      name: `Gedung & Katering (${guests} Porsi)`,
      icon: 'UtensilsCrossed',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.cateringVenue / 500000) * 500000,
      color: '#F43F5E',
      description: 'Sewa gedung dan katering prasmanan + gubukan',
    },
    {
      id: 'cat-dekorasi',
      name: 'Dekorasi & Pelaminan',
      icon: 'Flower2',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.decor / 500000) * 500000,
      color: '#EC4899',
      description: 'Pelaminan, lorong masuk, photobooth, fresh flower',
    },
    {
      id: 'cat-mua-busana',
      name: 'Rias Pengantin & Busana Keluarga',
      icon: 'Sparkles',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.attireMua / 500000) * 500000,
      color: '#8B5CF6',
      description: 'MUA akad & resepsi, busana pengantin & orang tua',
    },
    {
      id: 'cat-dokumentasi',
      name: 'Dokumentasi Foto & Video Cinematic',
      icon: 'Camera',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.photoVideo / 500000) * 500000,
      color: '#06B6D4',
      description: 'Foto & teaser reels, album kolase, dokumentasi hari H',
    },
    {
      id: 'cat-cincin-mahar',
      name: 'Cincin Kawin & Mahar / Seserahan',
      icon: 'Gem',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.ringMahar / 500000) * 500000,
      color: '#F59E0B',
      description: 'Sepasang cincin kawin, kotak seserahan, mahar',
    },
    {
      id: 'cat-undangan-souvenir',
      name: 'Undangan Digital & Souvenir Tamu',
      icon: 'MailOpen',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.invitationSouvenir / 500000) * 500000,
      color: '#10B981',
      description: 'Website undangan online RSVP, souvenir bermanfaat',
    },
    {
      id: 'cat-sound-mc',
      name: 'Sound System, MC & Live Musik',
      icon: 'Music',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.entertainment / 500000) * 500000,
      color: '#6366F1',
      description: 'Pembawa acara akad & resepsi, sound & musisi akustik',
    },
    {
      id: 'cat-tak-terduga',
      name: 'Dana Cadangan & Biaya KUA / Perizinan',
      icon: 'ShieldAlert',
      allocatedAmount: Math.round(calculatedTotal * tier.proportions.emergency / 500000) * 500000,
      color: '#64748B',
      description: 'Biaya admin KUA nikah luar balai, hansip, tak terduga',
    },
  ];

  const handleApply = () => {
    if (confirm(`Terapkan estimasi anggaran sebesar ${formatIDR(calculatedTotal)} ke target impian tabungan kalian?`)) {
      onApplyBudget(calculatedTotal, suggestedCategories);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-rose-100 text-rose-600 rounded-2xl">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-slate-800 text-lg sm:text-xl">
                Kalkulator Cerdas Biaya Pernikahan
              </h3>
              <p className="text-xs text-slate-500">
                Hitung estimasi realistis sesuai jumlah tamu & konsep resepsi di Indonesia
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Controls */}
        <div className="space-y-4 mb-6">
          {/* Guest Count slider & input */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">
                Jumlah Undangan / Tamu (Porsi):
              </label>
              <span className="font-mono font-bold text-rose-600 text-base">
                {guests} Tamu
              </span>
            </div>
            <input
              type="range"
              min="100"
              max="1500"
              step="50"
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>100 (Intim)</span>
              <span>450 (Sedang)</span>
              <span>800 (Besar)</span>
              <span>1500+ (Akbar)</span>
            </div>
          </div>

          {/* Tier Selection */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-2">
              Pilih Konsep & Skala Acara:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {Object.entries(TIERS).map(([key, item]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedTier(key)}
                  className={`p-3.5 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    selectedTier === key
                      ? 'border-rose-500 bg-rose-50/70 shadow-xs ring-2 ring-rose-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-rose-700 shadow-2xs inline-block mb-1">
                      {item.badge}
                    </span>
                    <h4 className="font-bold text-slate-800 text-xs mt-1">
                      {item.name.split(' (')[0]}
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Calculated Result Box */}
        <div className="bg-gradient-to-br from-rose-500 via-pink-500 to-amber-500 rounded-2xl p-5 text-white shadow-lg shadow-rose-200 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs text-white/80 uppercase tracking-wider font-semibold block">
                Total Estimasi Anggaran Ideal
              </span>
              <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight">
                {formatIDR(calculatedTotal)}
              </span>
              <span className="text-xs text-white/90 block mt-0.5">
                Target saat ini: {formatIDR(currentTarget)} ({calculatedTotal > currentTarget ? `+${formatIDR(calculatedTotal - currentTarget)}` : `-${formatIDR(currentTarget - calculatedTotal)}`})
              </span>
            </div>

            <button
              onClick={handleApply}
              className="bg-white hover:bg-rose-50 text-rose-600 font-bold px-4 py-2.5 rounded-xl shadow-md text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shrink-0"
            >
              <span>Gunakan Anggaran Ini</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Breakdown Items Preview */}
        <div>
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Rekomendasi Alokasi 8 Pos Utama:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {suggestedCategories.map((sc) => (
              <div key={sc.id} className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-slate-700 truncate mr-2">{sc.name}</span>
                <span className="font-mono font-bold text-slate-900 shrink-0">
                  {formatIDR(sc.allocatedAmount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
