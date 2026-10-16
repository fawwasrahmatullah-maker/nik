import React from 'react';
import { X, Palette, Check, Sparkles, Moon, Sun, Heart } from 'lucide-react';
import { AppTheme, THEMES } from '../types/theme';
import { useTheme } from '../context/ThemeContext';

interface ThemeSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThemeSelectorModal: React.FC<ThemeSelectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { theme, setTheme, isDark } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className={`w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto transition-colors ${
        isDark ? 'bg-[#151D2F] border-slate-700 text-slate-100' : 'bg-white border-rose-100 text-slate-800'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-500 via-pink-500 to-purple-500 text-white flex items-center justify-center shadow-md">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-xl flex items-center gap-2">
                <span>Pilih Tema & Suasana Aplikasi</span>
                <span className="text-sm">🎨✨</span>
              </h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pilih tema lucu, gelap elegan, atau warna estetik favorit kalian berdua
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-xl transition cursor-pointer ${
              isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {Object.values(THEMES).map((t) => {
            const isSelected = theme === t.id;

            return (
              <button
                key={t.id}
                onClick={() => {
                  setTheme(t.id);
                }}
                className={`relative p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between group ${
                  isSelected
                    ? isDark
                      ? 'border-rose-400 bg-slate-800/90 ring-2 ring-rose-400/50 shadow-md'
                      : 'border-rose-500 bg-rose-50/60 ring-2 ring-rose-300 shadow-md'
                    : isDark
                    ? 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    : 'border-slate-200 bg-slate-50/50 hover:border-rose-200 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <h4 className={`font-bold text-sm ${
                          isDark ? 'text-white' : 'text-slate-800'
                        }`}>
                          {t.name}
                        </h4>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          t.id === 'cute'
                            ? 'bg-pink-100 text-pink-700 font-bold'
                            : t.id === 'dark'
                            ? 'bg-slate-700 text-amber-300 font-bold'
                            : 'bg-white/80 text-slate-600 border border-slate-200'
                        }`}>
                          {t.badge}
                        </span>
                      </div>
                    </div>

                    {isSelected && (
                      <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </span>
                    )}
                  </div>

                  <p className={`text-xs mb-3 leading-relaxed line-clamp-2 ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>
                    {t.description}
                  </p>
                </div>

                {/* Color swatches preview bar */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-200/40">
                  <div className="flex items-center gap-1.5">
                    {t.previewColors.map((color, i) => (
                      <span
                        key={i}
                        className="w-4 h-4 rounded-full border border-black/10 shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>

                  <span className={`text-[11px] font-semibold ${
                    isSelected ? 'text-rose-500' : isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}>
                    {isSelected ? 'Aktif Digunakan' : 'Pilih Tema ➔'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Cute or Dark specific fun prompt */}
        {theme === 'cute' && (
          <div className="bg-pink-50 border border-pink-200 rounded-2xl p-3.5 mb-4 flex items-center gap-3 text-pink-900 text-xs">
            <span className="text-2xl">🎀</span>
            <p>
              <strong>Mode Lucu Aktif:</strong> Tampilan pastel manis dengan nuansa strawberry milk & glitter cinta untuk menyemangati nabung berdua! 🍓💖
            </p>
          </div>
        )}

        {theme === 'dark' && (
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-3.5 mb-4 flex items-center gap-3 text-amber-300 text-xs">
            <span className="text-2xl">🌙</span>
            <p className="text-slate-200">
              <strong className="text-amber-300">Mode Gelap Elegan:</strong> Mengurangi ketegangan mata saat mengecek tabungan dan chatting di malam hari dengan sentuhan emas mewah.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
              isDark ? 'bg-rose-600 hover:bg-rose-500 text-white' : 'bg-rose-600 hover:bg-rose-700 text-white'
            }`}
          >
            Selesai Memilih
          </button>
        </div>
      </div>
    </div>
  );
};
