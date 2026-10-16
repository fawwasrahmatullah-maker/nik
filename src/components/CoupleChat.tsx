import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Smile, 
  Sparkles, 
  Heart, 
  Coins, 
  Image as ImageIcon, 
  Camera, 
  X, 
  Download, 
  Check, 
  ZoomIn, 
  PartyPopper, 
  PlusCircle, 
  ShieldCheck, 
  Receipt 
} from 'lucide-react';
import { ChatMessage, CoupleInfo, PartnerRole } from '../types/wedding';
import { formatIDR, formatDateTimeID, formatDateID } from '../utils/formatters';
import { compressImageFile } from '../services/realtimeSync';
import { useTheme } from '../context/ThemeContext';

interface CoupleChatProps {
  coupleInfo: CoupleInfo;
  activePartner: PartnerRole | 'both';
  setActivePartner: (p: PartnerRole | 'both') => void;
  messages: ChatMessage[];
  onSendMessage: (msg: { 
    text: string; 
    sticker?: string; 
    type?: ChatMessage['type']; 
    highlightAmount?: number;
    imageUrl?: string;
    imageName?: string;
    bankName?: string;
  }) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onRecordDepositFromChat?: (amount: number, description: string, partnerId: PartnerRole) => void;
}

const QUICK_SAVINGS_TEMPLATES = [
  { text: 'Alhamdulillah barusan setor tabungan gajian! 💸💍', sticker: '💰', type: 'transfer_alert' as const },
  { text: 'Ini bukti transfer tabungan bulan ini ya sayang! 🧾✨', sticker: '📸', type: 'transfer_alert' as const },
  { text: 'Minggu ini kita masak bareng di rumah aja demi venue impian! 🍳❤️', sticker: '🍱', type: 'pledge' as const },
  { text: 'Bangga banget sama kamu, tabungan kita nambah konsisten! 🌸', sticker: '✨', type: 'text' as const },
  { text: 'Tantangan 7 Hari: No Boba & Kopi Mahal, lumayan hemat 300rb! ☕🚫', sticker: '💪', type: 'pledge' as const },
];

const STICKERS = ['💍', '❤️', '💸', '🎉', '🍱', '✨', '👰', '🤵', '🚀', '☕', '💪', '🏆', '🌸', '🍓', '🎀'];

const POPULAR_BANKS = ['BCA', 'Bank Mandiri', 'Bank Jago', 'BSI', 'BNI', 'BRI', 'BCA Digital (Blu)'];

export const CoupleChat: React.FC<CoupleChatProps> = ({
  coupleInfo,
  activePartner,
  setActivePartner,
  messages,
  onSendMessage,
  onAddReaction,
  onRecordDepositFromChat,
}) => {
  const { themeConfig, isDark, isCute } = useTheme();
  const [inputText, setInputText] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [selectedSticker, setSelectedSticker] = useState<string | null>(null);
  const [quickAmount, setQuickAmount] = useState<string>('');
  const [selectedBank, setSelectedBank] = useState<string>('BCA');
  const [isTransferAlertMode, setIsTransferAlertMode] = useState(false);
  
  // Image transfer proof state
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const [attachedImageName, setAttachedImageName] = useState<string>('');
  const [viewingImage, setViewingImage] = useState<{ url: string; title: string; amount?: number; sender: string } | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active sender is either partner1 or partner2 (if both, defaults to partner1)
  const currentSender: PartnerRole = activePartner === 'partner2' ? 'partner2' : 'partner1';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle image upload from file picker
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const compressedDataUrl = await compressImageFile(file, 1200, 0.82);
      setAttachedImage(compressedDataUrl);
      setAttachedImageName(file.name);
      setIsTransferAlertMode(true);
    } catch {
      alert('Gagal memproses gambar. Silakan gunakan format PNG/JPG.');
    }
    e.target.value = '';
  };

  // Handle paste image from clipboard (e.g. screenshot of m-banking)
  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          try {
            const dataUrl = await compressImageFile(file, 1200, 0.82);
            setAttachedImage(dataUrl);
            setAttachedImageName('Screenshot_Transfer.jpg');
            setIsTransferAlertMode(true);
            e.preventDefault();
            break;
          } catch {
            // ignore
          }
        }
      }
    }
  };

  // Generate realistic Indonesian bank receipt simulator
  const handleGenerateReceiptSimulator = (amountNum: number, bank: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 750;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Background receipt
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, 600, 750);

    // Header gradient
    const grad = ctx.createLinearGradient(0, 0, 600, 0);
    grad.addColorStop(0, '#00529C'); // Bank blue
    grad.addColorStop(1, '#0070BA');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 110);

    // Header text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 26px sans-serif';
    ctx.fillText(`${bank} Mobile Banking`, 30, 48);
    ctx.font = '16px sans-serif';
    ctx.fillText('BUKTI TRANSAKSI TRANSFER BERHASIL', 30, 82);

    // Success check circle
    ctx.beginPath();
    ctx.arc(300, 180, 45, 0, Math.PI * 2);
    ctx.fillStyle = '#10B981';
    ctx.fill();

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(280, 180);
    ctx.lineTo(295, 195);
    ctx.lineTo(325, 165);
    ctx.stroke();

    // Amount text
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 36px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(formatIDR(amountNum), 300, 265);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = '#10B981';
    ctx.fillText('● TRANSAKSI BERHASIL', 300, 295);

    // Divider line
    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, 320);
    ctx.lineTo(560, 320);
    ctx.stroke();

    // Details table
    ctx.textAlign = 'left';
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#64748B';

    const details = [
      ['Tanggal & Waktu', new Date().toLocaleString('id-ID')],
      ['Pengirim', coupleInfo[currentSender].name],
      ['Rekening Sumber', coupleInfo[currentSender].pocketName || `${bank} - *******12`],
      ['Penerima', coupleInfo.jointAccountName],
      ['No. Rekening Tujuan', coupleInfo.jointAccountNumber || '8839-2049-1120'],
      ['No. Referensi', `TRX${Date.now().toString().slice(-9)}`],
      ['Keterangan', 'Setoran Tabungan Pernikahan'],
    ];

    let y = 360;
    details.forEach(([label, val]) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '14px sans-serif';
      ctx.fillText(label, 40, y);

      ctx.fillStyle = '#0F172A';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(val, 560, y);
      ctx.textAlign = 'left';

      y += 42;
    });

    // Footer note
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'italic 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Simpan bukti ini sebagai bukti transaksi sah tabungan pernikahan NikahPlan.', 300, 710);

    const generatedUrl = canvas.toDataURL('image/jpeg', 0.9);
    setAttachedImage(generatedUrl);
    setAttachedImageName(`Struk_${bank}_${amountNum}.jpg`);
    setIsTransferAlertMode(true);
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedSticker && !quickAmount && !attachedImage) return;

    let highlightNum: number | undefined = undefined;
    if (quickAmount) {
      highlightNum = Number(quickAmount.replace(/\D/g, ''));
    }

    const defaultMsg = attachedImage 
      ? `Bukti transfer setoran tabungan sebesar ${highlightNum ? formatIDR(highlightNum) : ''} (${selectedBank}) 🧾✨`
      : isTransferAlertMode
      ? `Setoran tabungan sebesar ${formatIDR(highlightNum || 0)} berhasil ditambahkan ke kas bersama! ✨`
      : '❤️';

    onSendMessage({
      text: inputText.trim() || defaultMsg,
      sticker: selectedSticker || undefined,
      type: (isTransferAlertMode || attachedImage) ? 'transfer_alert' : 'text',
      highlightAmount: highlightNum,
      imageUrl: attachedImage || undefined,
      imageName: attachedImageName || undefined,
      bankName: attachedImage ? selectedBank : undefined,
    });

    setInputText('');
    setSelectedSticker(null);
    setQuickAmount('');
    setAttachedImage(null);
    setAttachedImageName('');
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
    <div 
      onPaste={handlePaste}
      className={`max-w-4xl mx-auto h-[calc(100vh-170px)] min-h-[560px] flex flex-col rounded-3xl border shadow-sm overflow-hidden transition-colors ${
        isDark 
          ? 'bg-[#151D2F] border-slate-800' 
          : isCute 
          ? 'bg-white border-pink-200' 
          : 'bg-white border-rose-100'
      }`}
    >
      {/* Hidden file input for receipts */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* Chat Header */}
      <div className={`p-4 sm:p-5 border-b flex flex-wrap items-center justify-between gap-3 ${
        isDark 
          ? 'bg-slate-900/90 border-slate-800' 
          : isCute 
          ? 'bg-pink-50/70 border-pink-200' 
          : 'bg-gradient-to-r from-rose-50 via-pink-50 to-amber-50 border-rose-100'
      }`}>
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
              <h3 className={`font-serif font-bold text-base sm:text-lg ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {isCute ? 'Obrolan Gemas & Bukti Transfer 🍓' : 'Obrolan Pasangan & Pelacak Setoran'}
              </h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                isDark ? 'bg-emerald-950 text-emerald-300' : 'bg-rose-100 text-rose-700'
              }`}>
                Real-Time Aktif 🟢
              </span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Bisa kirim foto bukti transfer, paste screenshot, & saling semangati nabung.
            </p>
          </div>
        </div>

        {/* Sender switcher within chat */}
        <div className={`flex items-center gap-1.5 p-1 rounded-xl border text-xs ${
          isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-rose-200/80'
        }`}>
          <span className={`text-[11px] font-medium px-1.5 ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>Ketik sebagai:</span>
          <button
            onClick={() => setActivePartner('partner1')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              currentSender === 'partner1'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            {coupleInfo.partner1.avatar} {coupleInfo.partner1.nickname}
          </button>
          <button
            onClick={() => setActivePartner('partner2')}
            className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
              currentSender === 'partner2'
                ? isCute ? 'bg-pink-500 text-white font-semibold shadow-xs' : 'bg-rose-600 text-white font-semibold shadow-xs'
                : isDark ? 'text-slate-300 hover:text-white' : 'text-slate-600 hover:text-rose-600'
            }`}
          >
            {coupleInfo.partner2.avatar} {coupleInfo.partner2.nickname}
          </button>
        </div>
      </div>

      {/* Quick Savings Quickchips / Templates */}
      <div className={`px-4 py-2 border-b overflow-x-auto scrollbar-none flex items-center gap-2 text-xs ${
        isDark ? 'bg-slate-900/50 border-slate-800' : isCute ? 'bg-pink-50/40 border-pink-100' : 'bg-rose-50/50 border-rose-100/60'
      }`}>
        <span className="text-[11px] font-bold text-rose-500 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Ide Seru:
        </span>
        {QUICK_SAVINGS_TEMPLATES.map((tpl, idx) => (
          <button
            key={idx}
            onClick={() => handleQuickTemplate(tpl)}
            className={`shrink-0 px-3 py-1 rounded-full border transition shadow-2xs cursor-pointer flex items-center gap-1.5 text-xs ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                : 'bg-white hover:bg-rose-100 text-slate-700 hover:text-rose-800 border-rose-200/60'
            }`}
          >
            <span>{tpl.sticker}</span>
            <span className="truncate max-w-[220px]">{tpl.text}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className={`flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 ${
        isDark ? 'bg-[#0E1524]' : isCute ? 'bg-[#FFF8FA]' : 'bg-slate-50/40'
      }`}>
        {messages.map((msg) => {
          const isSystem = msg.senderId === 'system';
          const isMe = msg.senderId === currentSender;
          const isP1 = msg.senderId === 'partner1';

          if (isSystem) {
            return (
              <div key={msg.id} className="flex justify-center my-3">
                <div className={`max-w-md border rounded-2xl p-3 px-4 text-center shadow-xs ${
                  isDark ? 'bg-slate-900 border-amber-500/40 text-amber-300' : 'bg-gradient-to-r from-amber-50 to-rose-50 border-amber-200/80 text-amber-900'
                }`}>
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold mb-1">
                    <PartyPopper className="w-3.5 h-3.5 text-rose-500" />
                    <span>PEMBERITAHUAN SISTEM TABUNGAN</span>
                  </div>
                  <p className="text-xs leading-relaxed font-medium">
                    {msg.text}
                  </p>
                  <span className="text-[10px] opacity-60 block mt-1">
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
              <div className={`flex items-center gap-1.5 mb-1 px-1 text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                <span className={`font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  {msg.senderName}
                </span>
                <span>•</span>
                <span className="text-[10px] opacity-70">
                  {formatDateTimeID(msg.timestamp)}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`relative max-w-sm sm:max-w-md rounded-3xl p-3.5 sm:p-4 shadow-xs text-sm leading-relaxed transition ${
                  isMe
                    ? isP1
                      ? 'bg-blue-600 text-white rounded-tr-xs'
                      : isCute ? 'bg-pink-500 text-white rounded-tr-xs' : 'bg-rose-600 text-white rounded-tr-xs'
                    : isDark
                    ? 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-xs'
                    : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                }`}
              >
                {/* Special highlight for transfer alerts */}
                {msg.type === 'transfer_alert' && (
                  <div className={`p-2.5 rounded-xl mb-2 flex items-center justify-between gap-2 border ${
                    isMe 
                      ? 'bg-white/15 border-white/20 text-white' 
                      : isDark
                      ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  }`}>
                    <div className="flex items-center gap-2">
                      <Coins className="w-5 h-5 shrink-0" />
                      <div>
                        <span className="text-[10px] uppercase font-bold block opacity-80">
                          {msg.bankName ? `Setoran ${msg.bankName}` : 'Tabungan Masuk'}
                        </span>
                        {msg.highlightAmount && (
                          <span className="font-black font-mono text-sm">
                            {formatIDR(msg.highlightAmount)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick record button if not yet added to joint transactions */}
                    {onRecordDepositFromChat && msg.highlightAmount && (
                      <button
                        onClick={() => {
                          onRecordDepositFromChat(
                            msg.highlightAmount!,
                            `Setoran ${msg.bankName || 'Tabungan'} dari Chat (${msg.senderName})`,
                            msg.senderId as PartnerRole
                          );
                          alert(`Setoran ${formatIDR(msg.highlightAmount!)} berhasil dicatat ke Kas Bersama!`);
                        }}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition flex items-center gap-1 cursor-pointer shrink-0 ${
                          isMe 
                            ? 'bg-white text-emerald-800 hover:bg-slate-100' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                        title="Catat nominal ini ke kas bersama"
                      >
                        <PlusCircle className="w-3 h-3" />
                        <span>Catat ke Kas</span>
                      </button>
                    )}
                  </div>
                )}

                {/* TRANSFER RECEIPT IMAGE PREVIEW */}
                {msg.imageUrl && (
                  <div className="mb-2.5">
                    <div 
                      onClick={() => setViewingImage({
                        url: msg.imageUrl!,
                        title: msg.imageName || 'Bukti Transfer',
                        amount: msg.highlightAmount,
                        sender: msg.senderName,
                      })}
                      className="relative rounded-2xl overflow-hidden border border-black/10 cursor-pointer group/img shadow-xs max-h-64 bg-slate-900/10 flex items-center justify-center"
                    >
                      <img 
                        src={msg.imageUrl} 
                        alt="Bukti Transfer" 
                        className="w-full h-auto object-cover max-h-64 group-hover/img:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-bold">
                        <ZoomIn className="w-5 h-5" />
                        <span>Klik untuk Memperbesar</span>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Receipt className="w-3 h-3" />
                        <span>Bukti Transfer</span>
                      </span>
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
                  <span className={`absolute -bottom-2 right-2 border text-xs px-2 py-0.5 rounded-full shadow-xs ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-slate-200 text-slate-700'
                  }`}>
                    {msg.reaction}
                  </span>
                )}
              </div>

              {/* Hover quick reaction picker */}
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1 px-1">
                {['❤️', '👏', '🎉', '🔥', '🥰', '💍'].map((emoji) => (
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

      {/* Input Form with fun buttons & Image Attacher */}
      <div className={`p-3 sm:p-4 border-t transition-colors ${
        isDark ? 'border-slate-800 bg-[#151D2F]' : 'border-rose-100 bg-white'
      }`}>
        {/* Attached image preview banner */}
        {attachedImage && (
          <div className="mb-3 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 text-xs animate-in fade-in">
            <div className="flex items-center gap-3 min-w-0">
              <img 
                src={attachedImage} 
                alt="Preview Bukti" 
                className="w-14 h-14 rounded-xl object-cover border border-emerald-300 shrink-0"
              />
              <div className="min-w-0">
                <span className="font-bold text-emerald-900 block truncate">
                  {attachedImageName || 'Bukti Transfer Siap Dikirim'}
                </span>
                <span className="text-[11px] text-emerald-700 block">
                  Foto kuitansi/m-Banking terlampir. Bisa langsung sertakan nominal di bawah.
                </span>
              </div>
            </div>
            <button
              onClick={() => {
                setAttachedImage(null);
                setAttachedImageName('');
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
              title="Hapus foto terlampir"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Transfer Alert Mini Mode Banner */}
        {isTransferAlertMode && (
          <div className={`mb-2.5 p-3 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-emerald-50 border-emerald-200'
          }`}>
            <div className="flex flex-wrap items-center gap-2">
              <Coins className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className={`font-semibold ${isDark ? 'text-emerald-300' : 'text-emerald-800'}`}>
                Informasi Setoran:
              </span>
              <select
                value={selectedBank}
                onChange={(e) => setSelectedBank(e.target.value)}
                className="px-2 py-1 bg-white rounded-md border border-slate-300 text-xs font-semibold text-slate-800"
              >
                {POPULAR_BANKS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Nominal Rp (cth: 5.000.000)"
                value={quickAmount}
                onChange={(e) => setQuickAmount(e.target.value)}
                className="px-2.5 py-1 bg-white border border-slate-300 rounded-md font-mono text-xs w-44 text-slate-900 font-bold"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* Simulator Button */}
              <button
                type="button"
                onClick={() => {
                  const num = Number(quickAmount.replace(/\D/g, '')) || 5000000;
                  handleGenerateReceiptSimulator(num, selectedBank);
                }}
                className="px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] cursor-pointer"
                title="Buat struk transfer otomatis untuk dicoba"
              >
                + Buat Struk Kilat
              </button>
              <button
                onClick={() => setIsTransferAlertMode(false)}
                className="text-slate-400 hover:text-slate-600 text-xs cursor-pointer ml-1"
              >
                Batal
              </button>
            </div>
          </div>
        )}

        {/* Sticker Picker drawer */}
        {showStickerPicker && (
          <div className={`mb-2 p-2 border rounded-2xl flex flex-wrap gap-1.5 items-center ${
            isDark ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'
          }`}>
            <span className="text-[11px] text-slate-500 font-semibold px-2">Pilih Stiker:</span>
            {STICKERS.map((stk) => (
              <button
                key={stk}
                onClick={() => {
                  setSelectedSticker(stk);
                  setShowStickerPicker(false);
                }}
                className={`p-1.5 text-xl rounded-xl hover:bg-white/50 hover:scale-110 transition cursor-pointer ${
                  selectedSticker === stk ? 'bg-rose-100 ring-2 ring-rose-400' : ''
                }`}
              >
                {stk}
              </button>
            ))}
            {selectedSticker && (
              <button
                onClick={() => setSelectedSticker(null)}
                className="text-xs text-rose-500 hover:underline ml-2"
              >
                Hapus ({selectedSticker})
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSend} className="flex items-center gap-2">
          {/* File input trigger button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              attachedImage 
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200'
            }`}
            title="Unggah Foto Bukti Transfer (JPG/PNG)"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          {/* Fun Sticker Button */}
          <button
            type="button"
            onClick={() => setShowStickerPicker(!showStickerPicker)}
            className={`p-2.5 rounded-xl border transition cursor-pointer ${
              selectedSticker
                ? 'bg-rose-100 text-rose-700 border-rose-300'
                : isDark
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border-slate-700'
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
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : isDark
                ? 'bg-slate-800 text-emerald-400 hover:bg-slate-700 border-slate-700'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-200'
            }`}
            title="Kirim Laporan & Bukti Setoran Baru"
          >
            <Coins className="w-4 h-4" />
            <span>Kabar Setoran</span>
          </button>

          {/* Main Input Field */}
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ketik pesan untuk ${currentSender === 'partner1' ? coupleInfo.partner2.nickname : coupleInfo.partner1.nickname} (bisa paste screenshot bukti transfer)...`}
            className={`flex-1 rounded-2xl px-4 py-2.5 text-sm transition border ${
              isDark 
                ? 'bg-slate-900 text-white border-slate-700 focus:ring-2 focus:ring-rose-500' 
                : 'bg-slate-50 text-slate-900 border-slate-200 focus:ring-2 focus:ring-rose-400 focus:bg-white'
            }`}
          />

          {/* Send Button */}
          <button
            type="submit"
            className={`p-2.5 sm:px-4 sm:py-2.5 rounded-2xl font-semibold flex items-center justify-center gap-2 shadow-sm transition cursor-pointer ${
              themeConfig.primaryButton
            }`}
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-xs">Kirim</span>
          </button>
        </form>
      </div>

      {/* Lightbox Image Preview Modal */}
      {viewingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative max-w-2xl w-full bg-slate-900 rounded-3xl p-5 border border-slate-700 overflow-hidden shadow-2xl flex flex-col items-center">
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="text-white font-bold text-base mb-1 self-start">
              {viewingImage.title}
            </h4>
            <p className="text-xs text-slate-400 mb-3 self-start">
              Dikirim oleh <strong className="text-white">{viewingImage.sender}</strong>
              {viewingImage.amount && (
                <span> • Nominal: <strong className="text-emerald-400 font-mono">{formatIDR(viewingImage.amount)}</strong></span>
              )}
            </p>

            <div className="w-full max-h-[70vh] overflow-auto rounded-2xl bg-black/40 flex items-center justify-center p-2 mb-4">
              <img 
                src={viewingImage.url} 
                alt="Bukti Transfer Penuh" 
                className="max-h-[65vh] w-auto rounded-xl object-contain shadow-lg"
              />
            </div>

            <div className="w-full flex items-center justify-between gap-3 text-xs">
              <a
                href={viewingImage.url}
                download={viewingImage.title || 'Bukti_Transfer.jpg'}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Gambar</span>
              </a>

              {onRecordDepositFromChat && viewingImage.amount && (
                <button
                  onClick={() => {
                    onRecordDepositFromChat(
                      viewingImage.amount!,
                      `Setoran Terverifikasi dari Chat (${viewingImage.sender})`,
                      activePartner === 'partner2' ? 'partner2' : 'partner1'
                    );
                    setViewingImage(null);
                    alert(`Setoran ${formatIDR(viewingImage.amount!)} berhasil dicatat ke Kas Bersama!`);
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Coins className="w-4 h-4" />
                  <span>Catat ke Kas Bersama</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
