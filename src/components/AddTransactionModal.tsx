import React, { useState } from 'react';
import { 
  X, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Coins, 
  Calendar, 
  FileText, 
  Tag, 
  User, 
  Building 
} from 'lucide-react';
import { 
  Transaction, 
  TransactionType, 
  PartnerRole, 
  BudgetCategory, 
  CoupleInfo 
} from '../types/wedding';
import { formatIDR } from '../utils/formatters';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: BudgetCategory[];
  coupleInfo: CoupleInfo;
  initialType?: TransactionType;
  initialPartner?: PartnerRole;
  onAddTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
}

const QUICK_AMOUNTS = [1000000, 2500000, 5000000, 10000000, 15000000];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  categories,
  coupleInfo,
  initialType = 'deposit',
  initialPartner,
  onAddTransaction,
}) => {
  const [type, setType] = useState<TransactionType>(initialType);
  const [partnerId, setPartnerId] = useState<PartnerRole | 'joint'>(
    initialPartner || (initialType === 'deposit' ? 'partner1' : 'joint')
  );
  const [amount, setAmount] = useState<string>('');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState<string>('');
  const [categoryId, setCategoryId] = useState<string>(categories[0]?.id || '');
  const [vendorName, setVendorName] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'dp' | 'termin' | 'lunas'>('dp');
  const [pocketSource, setPocketSource] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawNumber = Number(amount.replace(/\D/g, ''));
    if (!rawNumber || rawNumber <= 0) return;

    const selectedCategory = categories.find((c) => c.id === categoryId);

    onAddTransaction({
      type,
      amount: rawNumber,
      date,
      partnerId,
      categoryId: type === 'expense' ? categoryId : undefined,
      categoryName: type === 'expense' ? selectedCategory?.name : undefined,
      vendorName: type === 'expense' ? vendorName.trim() : undefined,
      paymentStatus: type === 'expense' ? paymentStatus : undefined,
      pocketSource: type === 'deposit' 
        ? pocketSource || (partnerId === 'partner1' ? coupleInfo.partner1.pocketName : partnerId === 'partner2' ? coupleInfo.partner2.pocketName : coupleInfo.jointAccountName)
        : undefined,
      description: description.trim() || (type === 'deposit' ? `Setoran tabungan pernikahan` : `Pengeluaran ${selectedCategory?.name || 'vendor'}`),
      notes: notes.trim() || undefined,
    });

    onClose();
  };

  const setNumericAmount = (num: number) => {
    setAmount(num.toString());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className={`p-2 rounded-xl text-white ${type === 'deposit' ? 'bg-emerald-600' : 'bg-rose-600'}`}>
              {type === 'deposit' ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                {type === 'deposit' ? 'Catat Setoran Tabungan' : 'Catat Pengeluaran Vendor'}
              </h3>
              <p className="text-xs text-slate-500">Transparan dan otomatis memperbarui kas bersama</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-2xl mb-5">
          <button
            type="button"
            onClick={() => setType('deposit')}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              type === 'deposit'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Tabungan Masuk</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setType('expense');
              setPartnerId('joint');
            }}
            className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
              type === 'expense'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Pengeluaran Vendor</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Amount Input */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Nominal Transaksi (Rp) *
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 font-bold text-slate-400 text-sm">Rp</span>
              <input
                type="number"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 font-mono text-base font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                required
                min="1000"
                step="1000"
              />
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="text-[11px] text-slate-400 self-center">Cepat:</span>
              {QUICK_AMOUNTS.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setNumericAmount(q)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-mono text-[11px] cursor-pointer"
                >
                  +{q >= 1000000 ? `${q / 1000000}jt` : `${q / 1000}rb`}
                </button>
              ))}
            </div>
          </div>

          {/* Partner Selector */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              {type === 'deposit' ? 'Penyetor Tabungan *' : 'Dibayarkan Dari *'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setPartnerId('partner1')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  partnerId === 'partner1'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="text-base block">{coupleInfo.partner1.avatar}</span>
                <span className="text-[11px] block truncate">{coupleInfo.partner1.nickname}</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerId('partner2')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  partnerId === 'partner2'
                    ? 'border-rose-500 bg-rose-50 text-rose-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="text-base block">{coupleInfo.partner2.avatar}</span>
                <span className="text-[11px] block truncate">{coupleInfo.partner2.nickname}</span>
              </button>

              <button
                type="button"
                onClick={() => setPartnerId('joint')}
                className={`p-2 rounded-xl border text-center transition cursor-pointer ${
                  partnerId === 'joint'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                <span className="text-base block">💍</span>
                <span className="text-[11px] block truncate">Kas Bersama</span>
              </button>
            </div>
          </div>

          {/* If Expense: Select Category & Vendor Info */}
          {type === 'expense' && (
            <>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Pos Anggaran / Kategori Vendor *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} (Alokasi: {formatIDR(c.allocatedAmount)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Nama Vendor (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Sanggar Kirana, Catering Bu Joko"
                    value={vendorName}
                    onChange={(e) => setVendorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">
                    Status Pembayaran
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-800 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="dp">Uang Muka (DP)</option>
                    <option value="termin">Termin / Cicilan</option>
                    <option value="lunas">Pelunasan Penuh (Lunas)</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* If Deposit: Pocket Source */}
          {type === 'deposit' && (
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Sumber Dana / Rekening Asal
              </label>
              <input
                type="text"
                placeholder={partnerId === 'partner1' ? coupleInfo.partner1.pocketName : coupleInfo.partner2.pocketName}
                value={pocketSource}
                onChange={(e) => setPocketSource(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>
          )}

          {/* Description & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Tanggal Transaksi *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
                required
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Keterangan Singkat
              </label>
              <input
                type="text"
                placeholder={type === 'deposit' ? 'Contoh: Tabungan Gaji Oktober' : 'Contoh: DP 30% sewa pelaminan'}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Catatan / Bukti Kuitansi (No. Ref / Detail)
            </label>
            <textarea
              placeholder="Catatan tambahan untuk pasangan (misal: No invoice #1203, sisa pelunasan H-14)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-6 py-2.5 rounded-xl text-white font-bold text-xs transition cursor-pointer shadow-sm ${
                type === 'deposit' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
              }`}
            >
              {type === 'deposit' ? '+ Simpan Setoran Tabungan' : '- Simpan Pengeluaran Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
