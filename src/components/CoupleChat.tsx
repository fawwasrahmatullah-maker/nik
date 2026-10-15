import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Sparkles, 
  Heart, 
  Coins, 
  Coffee, 
  Flame, 
  Trophy, 
  UtensilsCrossed, 
  ShieldCheck, 
  Share2, 
  PartyPopper 
} from 'lucide-react';
import { ChatMessage, CoupleInfo, PartnerRole } from '../types/wedding';
import { formatIDR, formatDateTimeID } from '../utils/formatters';

interface CoupleChatProps {
  coupleInfo: CoupleInfo;
  activePartner: PartnerRole | 'both';
  setActivePartner: (p: PartnerRole | 'both') => void;
  messages: ChatMessage[];
  onSendMessage: (msg: { text: string; sticker?: string; type?: ChatMessage['type']; highlightAmount?: number }) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
}

const QUICK_SAVINGS_TEMPLATES = [
  { text: 'Alhamdulillah barusan setor tabungan gajian! 💸💍', sticker: '💰', type: 'transfer_alert' as const },
  { text: 'Minggu ini kita masak bareng di rumah aja demi venue impian! 🍳❤️', sticker: '🍱', type: 'pledge' as const },
  { text: 'Bangga banget sama kamu, tabungan kita nambah konsisten! 🌸', sticker: '✨', type: 'text' as const },
  { text: 'Tantangan 7 Hari: No Boba & Kopi Mahal, lumayan hemat 300rb! ☕🚫', sticker: '💪', type: 'pledge' as const },
  { text: 'DP vendor aman, yuk lanjut kejar target milestone berikutnya! 🚀', sticker: '🎯', type: 'text' as const },
];

const STICKERS = ['💍', '❤️', '💸', '🎉', '🍱', '✨', '👰', '🤵', '🚀', '☕', '💪', '🏆'];

export const CoupleChat: React.FC<CoupleChatProps> = ({
  coupleInfo,
  activePartner,
  setActivePartner,
  messages,
  onSendMessage,
  onAddReaction,
}) => {
  const [inputText, setInputText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState<string>('');
  const [isTransferAlertMode, setIsTransferAlertMode] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active sender is either partner1 or partner2 (if both, defaults to partner1)
  const currentSender: PartnerRole = activePartner === 'partner2' ? 'partner2' : 'partner1';
  const partnerData = coupleInfo[currentSender];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedSticker && !quickAmount) return;

    let highlightNum: number | undefined = undefined;
    if (isTransferAlertMode && quickAmount) {
      highlightNum = Number(quickAmount.replace(/\D/g, ''));
    }

    onSendMessage({
      text: inputText.trim() || (isTransferAlertMode ? `Setoran tabungan sebesar ${formatIDR(highlightNum || 0)} berhasil ditambahkan ke kantong bersama! ✨` : '❤️'),
      sticker: selectedSticker || undefined,
      type: isTransferAlertMode ? 'transfer_alert' : 'text',
      highlightAmount: highlightNum,
    });

    setInputText('');
    setSelectedSticker(null);
    setQuickAmount('');
    setIsTransferAlertMode(false);
    setShowStickerPicker(false);
  };

  const handleQuickTemplate = (tpl: typeof QUICK_SAVINGS_TEMPLATES[0]) => {
    onSendMessage({
      text: tpl.text,
      sticker: tpl.sticker,
      type: tpl.type,
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-170px)] min-h-[550px] flex flex-col bg-white rounded-3xl border border-rose-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-b border-rose-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2 overflow-hidden">
            <span className="w-10 h-10 rounded-full bg-blue-100 border-2 border-white flex items-center justify-center text-lg shadow-xs">
              {coupleInfo.partner1.avatar}
            </span>
            <span className="w-10 h-10 rounded-full bg-rose-100 border-2 border-white flex items-center justify-center text-lg shadow-xs">
              {coupleInfo.partner2.avatar}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-slate-800 text-base sm:text-lg">
                Obrolan Pasangan & Semangat Menabung
              </h3>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">
                Online Berdua 💍
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Ruang obrolan santai, saling semangati hemat, dan rayakan setoran tabungan nikah.
            </p>
          </div>
        </div>

        {/* Sender switcher within chat */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-rose-200/80 text-xs">
          <span className="text-[11px] text-slate-400 font-medium px-1.5">Ketik sebagai:</span>
          <button
            onClick={() => setActivePartner('partner1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              currentSender === 'partner1'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            {coupleInfo.partner1.avatar} {coupleInfo.partner1.nickname}
          </button>
          <button
            onClick={() => setActivePartner('partner2')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              currentSender === 'partner2'
                ? 'bg-rose-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            {coupleInfo.partner2.avatar} {coupleInfo.partner2.nickname}
          </button>
        </div>
      </div>

      {/* Quick Savings Quickchips / Templates */}
      <div className="bg-rose-50/50 px-4 py-2 border-b border-rose-100/60 overflow-x-auto scrollbar-none flex items-center gap-2 text-xs">
        <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Ide Seru:
        </span>
        {QUICK_SAVINGS_TEMPLATES.map((tpl, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickTemplate(tpl)}
            className="shrink-0 bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-800 px-3 py-1 rounded-full border border-rose-200/60 transition shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs"
          >
            <span>{tpl.sticker}</span>
            <span className="truncate max-w-[220px]">{tpl.text}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
        {messages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const isMe = msg.senderId === currentSender;
          const isP1 = msg.senderId === 'partner1';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-3">
                <div className="max-w-md bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-200/80 rounded-2xl p-3 px-4 text-center shadow-xs">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-800 mb-1">
                    <PartyPopper className="w-3.5 h-3.5 text-rose-500" />
                    <span>PEMBERITAHUAN SISTEM TABUNGAN</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {formatDateTimeID(msg.timestamp)}
                  </span>
                </div>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} group`}
            >
              {/* Sender Name & Avatar */}
              <div className="flex items-center gap-1.5 mb-1 px-1 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">
                  {msg.senderName}
                </span>
                <span>•</span>
                <span className="text-[10px] text-slate-400">
                  {formatDateTimeID(msg.timestamp)}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-sm sm:max-w-md rounded-3xl p-3.5 sm:p-4 shadow-xs text-sm leading-relaxed transition ${
                  isMe
                    ? isP1
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : 'bg-rose-600 text-white rounded-tr-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {/* Special highlight for transfer alerts */}
                {msg.type === 'transfer_alert' && (
                  <div className={`p-2.5 rounded-xl mb-2 flex items-center gap-2 border ${
                    isMe 
                      ? 'bg-white/15 border-white/20 text-white' 
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    <Coins className="w-5 h-5 shrink-0" />
                    <div>
                      <span className="text-[10px] uppercase font-bold block opacity-80">Tabungan Masuk</span>
                      {msg.highlightAmount && (
                        <span className="font-black font-mono text-sm">
                          {formatIDR(msg.highlightAmount)}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Special pledge badge */}
                {msg.type === 'pledge' && (
                  <div className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md mb-2 ${
                    isMe ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                  }`}>
                    <span>🍱 Komitmen Hemat Bersama</span>
                  </div>
                )}

                <div className="flex items-start gap-2">
                  {msg.sticker && (
                    <span className="text-2xl shrink-0">{msg.sticker}</span>
                  )}
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {/* Reaction badge */}
                {msg.reaction && (
                  <span className="absolute -bottom-2 right-2 bg-white border border-slate-200 text-slate-700 text-xs px-2 py-0.5 rounded-full shadow-xs">
                    {msg.reaction}
                  </span>
                )}
              </div>

              {/* Hover quick reaction picker */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 px-1">
                {['❤️', '👏', '🎉', '🔥', '🥰'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onAddReaction(msg.id, emoji)}
                    className="hover:scale-125 transition-transform text-xs p-1 rounded-full hover:bg-slate-200 cursor-pointer"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form with fun buttons */}
      <div className="p-3 sm:p-4 border-t border-rose-100 bg-white">
        {/* Transfer Alert Mini Mode Banner */}
        {isTransferAlertMode && (
          <div className="mb-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-emerald-800">Bagikan Bukti Setoran ke Chat:</span>
              <input
                type="text"
                placeholder="Nominal Rp (misal 5.000.000)"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                className="px-2 py-1 bg-white border border-emerald-300 rounded-md font-mono text-xs w-36 text-emerald-900"
              />
            </div>
            <button
              onClick={() => setIsTransferAlertMode(false)}
              className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer"
            >
              Batal
            </button>
          </div>
        )}

        {/* Sticker Picker drawer */}
        {showStickerPicker && (
          <div className="mb-2 p-2 bg-slate-50 border border-slate-200 rounded-2xl flex flex-wrap gap-1.5 items-center">
            <span className="text-[11px] text-slate-500 font-semibold px-2">Pilih Stiker Cinta:</span>
            {STICKERS.map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  setSelectedSticker(stk);
                  setShowStickerPicker(false);
                }}
                className={`p-1.5 text-xl rounded-xl hover:bg-white hover:scale-110 transition cursor-pointer ${
                  selectedSticker === stk ? 'bg-rose-100 ring-2 ring-rose-400' : ''
                }`}
              >
                {stk}
              </button>
            ))}
            {selectedSticker && (
              <button
                onClick={() => setSelectedSticker(null)}
                className="text-xs text-rose-600 hover:underline ml-2"
              >
                Hapus ({selectedSticker})
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* Fun Sticker Button */}
          <button
            type="button"
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              selectedSticker
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
            }`}
            title="Stiker Semangat Menabung"
          >
            {selectedSticker ? selectedSticker : <Smile className="w-5 h-5" />}
          </button>

          {/* Quick Transfer Alert toggle */}
          <button
            type="button"
            onClick={() => setIsTransferAlertMode(!isTransferAlertMode)}
            className={`hidden sm:flex items-center gap-1.5 px-3 py-2.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              isTransferAlertMode
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            }`}
            title="Kabari Pasangan tentang Setoran Baru"
          >
            <Coins className="w-4 h-4" />
            <span>Kabar Setoran</span>
          </button>

          {/* Main Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ketik pesan romantis atau semangati ${currentSender === 'partner1' ? coupleInfo.partner2.nickname : coupleInfo.partner1.nickname}...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 text-sm focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:bg-white transition"
          />

          {/* Send Button */}
          <button
            type="submit"
            className="p-2.5 sm:px-4 sm:py-2.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Kirim</span>
          </button>
        </form>
      </div>
    </div>
  );
};
