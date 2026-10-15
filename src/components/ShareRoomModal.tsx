import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Radio, 
  Sparkles, 
  Link2, 
  Smartphone, 
  Users, 
  RefreshCw, 
  ArrowRight 
} from 'lucide-react';
import { buildShareableRoomUrl } from '../services/realtimeSync';

interface ShareRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
  syncStatus: 'connected' | 'connecting' | 'reconnecting' | 'offline';
  onChangeRoom: (newRoomId: string) => void;
}

export const ShareRoomModal: React.FC<ShareRoomModalProps> = ({
  isOpen,
  onClose,
  roomId,
  syncStatus,
  onChangeRoom,
}) => {
  const [copied, setCopied] = useState(false);
  const [customRoomInput, setCustomRoomInput] = useState('');
  const [isChangingRoom, setIsChangingRoom] = useState(false);

  if (!isOpen) return null;

  const shareUrl = buildShareableRoomUrl(roomId);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShareWhatsApp = () => {
    const text = `Hai sayang! 💕 Buka link tabungan pernikahan bersama kita di sini: ${shareUrl}\n\nData kita sudah real-time, jadi setiap setoran, pengeluaran, dan milestone akan langsung terupdate bersama tanpa perlu refresh! 💍✨`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleApplyNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customRoomInput.trim()) return;
    const clean = customRoomInput.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    onChangeRoom(clean);
    setIsChangingRoom(false);
    setCustomRoomInput('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-rose-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 bg-gradient-to-tr from-rose-500 to-pink-500 text-white rounded-2xl shadow-sm">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
                <span>Sinkronisasi Real-Time Pasangan</span>
                <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  syncStatus === 'connected' 
                    ? 'bg-emerald-100 text-emerald-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 animate-ping' : 'bg-amber-500'}`} />
                  {syncStatus === 'connected' ? 'Aktif Terhubung' : 'Menghubungkan...'}
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Data tersinkron otomatis antar HP & laptop berdua secara langsung
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

        {/* Highlight Feature Explainer */}
        <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-amber-50 rounded-2xl p-4 border border-rose-100/80 mb-5 text-xs text-slate-700 space-y-2">
          <div className="flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Link Bersama:</strong> Siapapun yang membuka link ini akan selalu melihat data yang <strong>sama persis</strong>. Saat kamu mencatat setoran baru, mengubah anggaran, atau mengirim pesan di chat, perangkat pasanganmu akan <strong>langsung ter-update real-time</strong> tanpa perlu refresh!
            </p>
          </div>
        </div>

        {/* Share Link Box */}
        <div className="space-y-3 mb-6">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>Link Akses Bersama (Kode Ruang: <span className="font-mono text-rose-600">{roomId}</span>)</span>
            <button
              onClick={() => setIsChangingRoom(!isChangingRoom)}
              className="text-[11px] text-rose-600 hover:underline font-semibold cursor-pointer"
            >
              {isChangingRoom ? 'Batal Ganti Ruang' : 'Ganti / Buat Kode Ruang Sendiri'}
            </button>
          </label>

          {isChangingRoom && (
            <form onSubmit={handleApplyNewRoom} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 mb-3 space-y-2 animate-in fade-in">
              <span className="text-[11px] text-slate-500 block">
                Masukkan nama kode ruang khusus kalian (misal: <code>nikah-tono-siti</code>):
              </span>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="kode-ruang-baru"
                  value={customRoomInput}
                  onChange={(e) => setCustomRoomInput(e.target.value)}
                  className="flex-1 px-3 py-1.5 bg-white rounded-xl border border-slate-300 font-mono text-xs focus:ring-2 focus:ring-rose-400"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Terapkan
                </button>
              </div>
            </form>
          )}

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-mono text-slate-700 truncate select-all">
              {shareUrl}
            </div>

            <button
              onClick={handleCopyLink}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0 shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-rose-600 hover:bg-rose-700 text-white'
              }`}
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Tersalin!' : 'Salin Link'}</span>
            </button>
          </div>
        </div>

        {/* Fast Action WhatsApp */}
        <div className="space-y-2">
          <button
            onClick={handleShareWhatsApp}
            className="w-full py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Share2 className="w-4 h-4" />
            <span>Kirim Link Langsung ke WhatsApp Pasangan</span>
          </button>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span className="flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            Dapat dibuka di Android, iPhone, Tablet & Laptop
          </span>
          <span className="text-emerald-700 font-semibold">Tersimpan di Cloud Server</span>
        </div>
      </div>
    </div>
  );
};
