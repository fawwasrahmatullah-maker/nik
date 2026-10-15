import React, { useState } from 'react';
import { Heart, Plus, Sparkles, Trash2, Calendar, Smile } from 'lucide-react';
import { LoveNote, CoupleInfo, PartnerRole } from '../types/wedding';
import { formatDateID } from '../utils/formatters';

interface LoveNotesWidgetProps {
  loveNotes: LoveNote[];
  coupleInfo: CoupleInfo;
  activePartner: PartnerRole | 'both';
  onAddNote: (note: Omit<LoveNote, 'id'>) => void;
  onDeleteNote: (id: string) => void;
}

const STICKERS = ['💍', '❤️', '🌸', '✨', '🕊️', '💌', '☕', '🌟'];

export const LoveNotesWidget: React.FC<LoveNotesWidgetProps> = ({
  loveNotes,
  coupleInfo,
  activePartner,
  onAddNote,
  onDeleteNote,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedSticker, setSelectedSticker] = useState('❤️');
  const [authorId, setAuthorId] = useState<PartnerRole>(
    activePartner === 'partner2' ? 'partner2' : 'partner1'
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    onAddNote({
      authorId,
      message: message.trim(),
      date: new Date().toISOString().split('T')[0],
      sticker: selectedSticker,
    });

    setMessage('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-rose-100 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Papan Afirmasi & Ungkapan Syukur</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-800">
              Catatan Cinta Menuju Pelaminan
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Menabung bersama butuh komitmen dan saling pengertian. Tinggalkan catatan manis untuk menyemangati pasanganmu!
            </p>
          </div>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs sm:text-sm shadow-xs transition cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Catatan Cinta</span>
          </button>
        </div>
      </div>

      {/* Add Form */}
      {isAdding && (
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-rose-200 shadow-md animate-in fade-in duration-200">
          <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-600">Penulis:</span>
                <select
                  value={authorId}
                  onChange={(e) => setAuthorId(e.target.value as PartnerRole)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white text-slate-800 font-semibold"
                >
                  <option value="partner1">{coupleInfo.partner1.avatar} {coupleInfo.partner1.nickname}</option>
                  <option value="partner2">{coupleInfo.partner2.avatar} {coupleInfo.partner2.nickname}</option>
                </select>
              </div>

              <div className="flex items-center gap-1">
                <span className="font-semibold text-slate-600 mr-1">Stiker:</span>
                {STICKERS.map((stk) => (
                  <button
                    key={stk}
                    type="button"
                    onClick={() => setSelectedSticker(stk)}
                    className={`text-base p-1 rounded-lg hover:bg-slate-100 transition ${
                      selectedSticker === stk ? 'bg-rose-100 ring-2 ring-rose-300' : ''
                    }`}
                  >
                    {stk}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              placeholder="Tuliskan ucapan terima kasih, pesan penyemangat menabung, atau harapan indah hari H..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400"
              required
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-medium cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold transition shadow-xs cursor-pointer"
              >
                Kirim Catatan ❤️
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Love Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loveNotes.map((note) => {
          const author = coupleInfo[note.authorId];

          return (
            <div
              key={note.id}
              className="bg-amber-50/60 rounded-3xl p-5 border border-amber-200/60 shadow-2xs flex flex-col justify-between relative group hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-lg shadow-2xs border border-amber-200/50">
                      {author.avatar}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-800 text-xs">{author.nickname}</h4>
                      <span className="text-[10px] text-slate-400">{formatDateID(note.date)}</span>
                    </div>
                  </div>
                  <span className="text-2xl">{note.sticker}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-serif">
                  &ldquo;{note.message}&rdquo;
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-amber-200/50 flex justify-end">
                <button
                  onClick={() => onDeleteNote(note.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  title="Hapus Catatan"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
