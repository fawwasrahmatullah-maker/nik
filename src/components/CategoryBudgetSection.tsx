import React, { useState } from 'react';
import { 
  BudgetCategory, 
  Transaction, 
  CoupleInfo 
} from '../types/wedding';
import { formatIDR } from '../utils/formatters';
import { 
  Plus, 
  UtensilsCrossed, 
  Flower2, 
  Sparkles, 
  Camera, 
  Gem, 
  MailOpen, 
  Music, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  Edit3, 
  X, 
  Trash2, 
  PieChart 
} from 'lucide-react';

interface CategoryBudgetSectionProps {
  categories: BudgetCategory[];
  transactions: Transaction[];
  coupleInfo: CoupleInfo;
  onUpdateCategory: (category: BudgetCategory) => void;
  onAddCategory: (category: BudgetCategory) => void;
  onDeleteCategory: (categoryId: string) => void;
}

const CATEGORY_ICONS: Record<string, React.FC<{ className?: string }>> = {
  UtensilsCrossed,
  Flower2,
  Sparkles,
  Camera,
  Gem,
  MailOpen,
  Music,
  ShieldAlert,
};

export const CategoryBudgetSection: React.FC<CategoryBudgetSectionProps> = ({
  categories,
  transactions,
  coupleInfo,
  onUpdateCategory,
  onAddCategory,
  onDeleteCategory,
}) => {
  const [editingCategory, setEditingCategory] = useState<BudgetCategory | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatAmount, setNewCatAmount] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatColor, setNewCatColor] = useState('#F43F5E');

  // Compute actual spent per category from expense transactions
  const expensesByCategory: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'expense' && t.categoryId)
    .forEach((t) => {
      const catId = t.categoryId!;
      expensesByCategory[catId] = (expensesByCategory[catId] || 0) + t.amount;
    });

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocatedAmount, 0);
  const totalActualSpent = Object.values(expensesByCategory).reduce((sum, v) => sum + v, 0);
  const budgetDifference = coupleInfo.targetAmount - totalAllocated;

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCategory) {
      onUpdateCategory(editingCategory);
      setEditingCategory(null);
    }
  };

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatAmount) return;

    const numAmount = Number(newCatAmount.replace(/\D/g, ''));
    if (!numAmount) return;

    const newCategory: BudgetCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      allocatedAmount: numAmount,
      color: newCatColor,
      description: newCatDesc.trim() || undefined,
      icon: 'Sparkles',
    };

    onAddCategory(newCategory);
    setNewCatName('');
    setNewCatAmount('');
    setNewCatDesc('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Overview Top Cards */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <PieChart className="w-4 h-4" />
              <span>Transparansi Pos Pengeluaran Vendor</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
              Anggaran Pos Pernikahan Impian
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Rincian alokasi budget untuk setiap vendor dan pelacakan realisasi pengeluaran aktual.
            </p>
          </div>

          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Pos Anggaran</span>
          </button>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100">
            <span className="text-slate-500 font-medium block mb-1">Total Alokasi Rencana</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-slate-800">
              {formatIDR(totalAllocated)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {budgetDifference === 0
                ? '✅ Pas 100% sesuai target impian'
                : budgetDifference > 0
                ? `Masih ada ${formatIDR(budgetDifference)} belum dialokasikan`
                : `Melebihi target dana impian sebesar ${formatIDR(Math.abs(budgetDifference))}`}
            </span>
          </div>

          <div className="bg-amber-50/50 p-3.5 rounded-2xl border border-amber-100">
            <span className="text-slate-500 font-medium block mb-1">Realisasi Keluar (DP / Bayar)</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-amber-700">
              {formatIDR(totalActualSpent)}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              {totalAllocated > 0 ? `${((totalActualSpent / totalAllocated) * 100).toFixed(1)}% dari alokasi rencana` : '0%'}
            </span>
          </div>

          <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-100">
            <span className="text-slate-500 font-medium block mb-1">Sisa Budget Belum Terpakai</span>
            <span className="text-lg sm:text-xl font-bold font-mono text-emerald-700">
              {formatIDR(Math.max(0, totalAllocated - totalActualSpent))}
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">
              Tersedia untuk pelunasan tahap berikutnya
            </span>
          </div>
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((cat) => {
          const spent = expensesByCategory[cat.id] || 0;
          const remaining = cat.allocatedAmount - spent;
          const percentSpent = cat.allocatedAmount > 0 ? (spent / cat.allocatedAmount) * 100 : 0;
          const isOverBudget = spent > cat.allocatedAmount;

          const IconComponent = CATEGORY_ICONS[cat.icon] || Sparkles;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-rose-200 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                      style={{ backgroundColor: cat.color || '#F43F5E' }}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base leading-tight">
                        {cat.name}
                      </h4>
                      {cat.description && (
                        <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                          {cat.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingCategory({ ...cat })}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                      title="Edit Alokasi"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {categories.length > 1 && (
                      <button
                        onClick={() => onDeleteCategory(cat.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Amounts Breakdown */}
                <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-xl bg-slate-50 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Rencana Anggaran:</span>
                    <span className="font-bold font-mono text-slate-800 text-sm">
                      {formatIDR(cat.allocatedAmount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Terbayar / Keluar:</span>
                    <span className={`font-bold font-mono text-sm ${isOverBudget ? 'text-red-600' : 'text-slate-700'}`}>
                      {formatIDR(spent)}
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] mb-1 font-medium">
                    <span className="text-slate-500">
                      Realisasi: <strong className="text-slate-800">{percentSpent.toFixed(0)}%</strong>
                    </span>
                    <span className={isOverBudget ? 'text-red-600 font-bold' : 'text-emerald-600 font-bold'}>
                      {isOverBudget ? `Over: +${formatIDR(Math.abs(remaining))}` : `Sisa: ${formatIDR(remaining)}`}
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverBudget ? 'bg-red-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${Math.min(100, percentSpent)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Status footer */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                {percentSpent >= 100 ? (
                  <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Lunas / Selesai
                  </span>
                ) : percentSpent > 0 ? (
                  <span className="text-amber-700 font-semibold">
                    ⏳ DP / Termin Berjalan
                  </span>
                ) : (
                  <span className="text-slate-400">
                    Belum ada pengeluaran dicatat
                  </span>
                )}
                <span className="text-slate-400">
                  {((cat.allocatedAmount / (coupleInfo.targetAmount || 1)) * 100).toFixed(0)}% dari total target
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-rose-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Edit Alokasi Anggaran</h3>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Kategori Vendor
                </label>
                <input
                  type="text"
                  value={editingCategory.name}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Alokasi Anggaran (Rp)
                </label>
                <input
                  type="number"
                  value={editingCategory.allocatedAmount}
                  onChange={(e) => setEditingCategory({ ...editingCategory, allocatedAmount: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                  min="0"
                  step="500000"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catatan / Deskripsi Vendor
                </label>
                <textarea
                  value={editingCategory.description || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-rose-100 animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 text-lg">Tambah Pos Anggaran Baru</h3>
              <button
                onClick={() => setIsAdding(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateNew} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Nama Pos Vendor
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Mobil Pengantin & Patwal, Honeymoon Bali..."
                  value={newCatName}
                  onChange={(e) => setNewCatName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Estimasi Anggaran (Rp)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: 10000000"
                  value={newCatAmount}
                  onChange={(e) => setNewCatAmount(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-mono text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Catatan Tambahan
                </label>
                <textarea
                  placeholder="Detail rencana atau spesifikasi vendor..."
                  value={newCatDesc}
                  onChange={(e) => setNewCatDesc(e.target.value)}
                  rows={2}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Tambahkan Pos
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
