import React, { useState, useMemo } from 'react';
import { 
  Transaction, 
  CoupleInfo, 
  TransactionType, 
  PartnerRole 
} from '../types/wedding';
import { formatIDR, formatDateID } from '../utils/formatters';
import { 
  Search, 
  ArrowDownLeft, 
  ArrowUpRight, 
  Filter, 
  Plus, 
  Trash2, 
  Calendar, 
  Tag, 
  Building, 
  FileText, 
  Coins, 
  CheckCircle2 
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  coupleInfo: CoupleInfo;
  onOpenAddModal: (type?: TransactionType, partner?: PartnerRole) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  coupleInfo,
  onOpenAddModal,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'deposit' | 'expense'>('all');
  const [partnerFilter, setPartnerFilter] = useState<'all' | 'partner1' | 'partner2' | 'joint'>('all');

  // Filtered list
  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      // Type
      if (typeFilter !== 'all' && tx.type !== typeFilter) return false;
      // Partner
      if (partnerFilter !== 'all' && tx.partnerId !== partnerFilter) return false;
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const desc = (tx.description || '').toLowerCase();
        const cat = (tx.categoryName || '').toLowerCase();
        const vendor = (tx.vendorName || '').toLowerCase();
        const notes = (tx.notes || '').toLowerCase();
        const pocket = (tx.pocketSource || '').toLowerCase();
        return desc.includes(q) || cat.includes(q) || vendor.includes(q) || notes.includes(q) || pocket.includes(q);
      }
      return true;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt);
  }, [transactions, typeFilter, partnerFilter, searchTerm]);

  // Aggregate stats for filtered view
  const totalFilteredDeposits = filtered
    .filter((t) => t.type === 'deposit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalFilteredExpenses = filtered
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Action */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Coins className="w-4 h-4" />
              <span>Buku Kas Bersama Real-Time</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
              Pelacakan Tabungan & Pengeluaran
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Semua mutasi dicatat transparan agar tidak ada prasangka dan keuangan pernikahan terjaga sehat.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onOpenAddModal('deposit')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>+ Setor Tabungan</span>
            </button>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm transition shadow-xs cursor-pointer"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>- Catat Pengeluaran</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari transaksi, vendor, atau catatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:bg-white"
            />
          </div>

          {/* Type filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                typeFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Semua ({transactions.length})
            </button>
            <button
              onClick={() => setTypeFilter('deposit')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                typeFilter === 'deposit' ? 'bg-emerald-600 text-white font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              Tabungan
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                typeFilter === 'expense' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              Pengeluaran
            </button>
          </div>

          {/* Partner filter */}
          <div className="flex bg-slate-100 p-1 rounded-xl text-xs">
            <button
              onClick={() => setPartnerFilter('all')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                partnerFilter === 'all' ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'text-slate-600'
              }`}
            >
              Semua Pihak
            </button>
            <button
              onClick={() => setPartnerFilter('partner1')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                partnerFilter === 'partner1' ? 'bg-blue-600 text-white font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              {coupleInfo.partner1.nickname}
            </button>
            <button
              onClick={() => setPartnerFilter('partner2')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition cursor-pointer ${
                partnerFilter === 'partner2' ? 'bg-rose-600 text-white font-bold shadow-2xs' : 'text-slate-600'
              }`}
            >
              {coupleInfo.partner2.nickname}
            </button>
          </div>
        </div>

        {/* Filter Summary Stats */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <span>Menampilkan <strong>{filtered.length}</strong> transaksi</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700">
              Total Masuk: <strong>{formatIDR(totalFilteredDeposits)}</strong>
            </span>
            <span className="text-rose-700">
              Total Keluar: <strong>{formatIDR(totalFilteredExpenses)}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200/80">
            <p className="text-slate-500 font-medium text-sm">Tidak ada transaksi yang cocok</p>
            <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau filter.</p>
          </div>
        ) : (
          filtered.map((tx) => {
            const isDeposit = tx.type === 'deposit';
            const partnerLabel = 
              tx.partnerId === 'partner1' ? coupleInfo.partner1.name :
              tx.partnerId === 'partner2' ? coupleInfo.partner2.name : 'Kas Bersama Pasangan';
            const partnerAvatar = 
              tx.partnerId === 'partner1' ? coupleInfo.partner1.avatar :
              tx.partnerId === 'partner2' ? coupleInfo.partner2.avatar : '💍';

            return (
              <div
                key={tx.id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 hover:border-rose-200 transition shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-3 rounded-2xl shrink-0 ${
                    isDeposit ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {isDeposit ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="font-bold text-slate-800 text-sm sm:text-base">
                        {tx.description}
                      </h4>
                      {/* Payment Status badge if expense */}
                      {tx.paymentStatus && (
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                          tx.paymentStatus === 'lunas'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {tx.paymentStatus === 'lunas' ? 'Lunas' : tx.paymentStatus === 'dp' ? 'Uang Muka (DP)' : 'Termin'}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {formatDateID(tx.date)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1 font-medium text-slate-700">
                        <span>{partnerAvatar}</span>
                        <span>{partnerLabel}</span>
                      </span>
                      {tx.categoryName && (
                        <>
                          <span>•</span>
                          <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-medium text-[11px]">
                            {tx.categoryName}
                          </span>
                        </>
                      )}
                      {tx.vendorName && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">
                            Vendor: {tx.vendorName}
                          </span>
                        </>
                      )}
                    </div>

                    {tx.notes && (
                      <p className="text-xs text-slate-500 italic bg-slate-50 p-2 rounded-xl mt-1 border border-slate-100">
                        &ldquo;{tx.notes}&rdquo;
                      </p>
                    )}
                  </div>
                </div>

                {/* Amount and delete button */}
                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 sm:text-right pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div>
                    <span className="text-[11px] text-slate-400 block sm:text-right">
                      {isDeposit ? 'Setoran Tabungan' : 'Pengeluaran Vendor'}
                    </span>
                    <span className={`text-base sm:text-lg font-black font-mono ${
                      isDeposit ? 'text-emerald-700' : 'text-rose-700'
                    }`}>
                      {isDeposit ? '+' : '-'}{formatIDR(tx.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm(`Hapus catatan transaksi "${tx.description}" (${formatIDR(tx.amount)})?`)) {
                        onDeleteTransaction(tx.id);
                      }
                    }}
                    className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                    title="Hapus Transaksi"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
