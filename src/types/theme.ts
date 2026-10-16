export type AppTheme = 'romantic' | 'cute' | 'dark' | 'emerald' | 'lavender' | 'peach';

export interface ThemeConfig {
  id: AppTheme;
  name: string;
  badge: string;
  description: string;
  icon: string;
  previewColors: string[];
  isDark: boolean;
  // Classes
  bodyBg: string;
  cardBg: string;
  cardBorder: string;
  cardHoverBorder: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  topBannerGradient: string;
  heroGradient: string;
  primaryButton: string;
  primaryButtonHover: string;
  accentBadge: string;
  accentColor: string;
  progressTrack: string;
  progressGradient: string;
  inputBg: string;
  inputBorder: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  romantic: {
    id: 'romantic',
    name: 'Romantis Klasik',
    badge: 'Anggun & Hangat',
    description: 'Nuansa rose gold, blush pink, dan ivory khas pernikahan romantis.',
    icon: '🌹',
    previewColors: ['#F43F5E', '#FB7185', '#FFF1F2'],
    isDark: false,
    bodyBg: 'bg-[#FAF7F5]',
    cardBg: 'bg-white',
    cardBorder: 'border-rose-100',
    cardHoverBorder: 'hover:border-rose-300',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-slate-600',
    textMuted: 'text-slate-400',
    topBannerGradient: 'from-rose-500 via-pink-500 to-amber-500',
    heroGradient: 'from-rose-600 via-pink-600 to-amber-500',
    primaryButton: 'bg-rose-600 hover:bg-rose-700 text-white',
    primaryButtonHover: 'hover:bg-rose-700',
    accentBadge: 'bg-rose-100 text-rose-700',
    accentColor: '#F43F5E',
    progressTrack: 'bg-slate-200/80',
    progressGradient: 'from-rose-500 via-pink-500 to-amber-400',
    inputBg: 'bg-slate-50 focus:bg-white',
    inputBorder: 'border-slate-200 focus:ring-rose-400',
  },
  cute: {
    id: 'cute',
    name: 'Lucu & Gemas (Kawaii)',
    badge: 'Super Cute & Sweet 🎀',
    description: 'Pastel strawberry milk, pita pink gemas, ornamen manis dan stiker lucu bikin menabung makin hepi!',
    icon: '🎀',
    previewColors: ['#F472B6', '#FBCFE8', '#FFF0F5'],
    isDark: false,
    bodyBg: 'bg-[#FFF5F8]',
    cardBg: 'bg-white/95 backdrop-blur-xs',
    cardBorder: 'border-pink-200 shadow-pink-100/60',
    cardHoverBorder: 'hover:border-pink-400',
    textPrimary: 'text-pink-950',
    textSecondary: 'text-pink-800/80',
    textMuted: 'text-pink-400',
    topBannerGradient: 'from-pink-500 via-rose-400 to-purple-400',
    heroGradient: 'from-pink-500 via-rose-400 to-amber-300',
    primaryButton: 'bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 text-white shadow-pink-200',
    primaryButtonHover: 'hover:opacity-90',
    accentBadge: 'bg-pink-100 text-pink-700 font-bold',
    accentColor: '#EC4899',
    progressTrack: 'bg-pink-100',
    progressGradient: 'from-pink-400 via-rose-300 to-amber-300',
    inputBg: 'bg-pink-50/60 focus:bg-white',
    inputBorder: 'border-pink-200 focus:ring-pink-400',
  },
  dark: {
    id: 'dark',
    name: 'Gelap Elegan (Midnight)',
    badge: 'Mewah & Nyaman di Mata 🌙',
    description: 'Mode gelap modern bertabur emas champagne dan glowing rose, sangat nyaman dilihat malam hari.',
    icon: '🌙',
    previewColors: ['#0F172A', '#1E293B', '#F59E0B'],
    isDark: true,
    bodyBg: 'bg-[#0B0F19]',
    cardBg: 'bg-[#151D2F]',
    cardBorder: 'border-slate-800',
    cardHoverBorder: 'hover:border-slate-600',
    textPrimary: 'text-slate-100',
    textSecondary: 'text-slate-300',
    textMuted: 'text-slate-500',
    topBannerGradient: 'from-slate-900 via-slate-800 to-rose-950',
    heroGradient: 'from-slate-900 via-rose-950 to-amber-950',
    primaryButton: 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-950',
    primaryButtonHover: 'hover:bg-rose-500',
    accentBadge: 'bg-rose-950/80 text-rose-300 border border-rose-800/60',
    accentColor: '#FB7185',
    progressTrack: 'bg-slate-800',
    progressGradient: 'from-rose-500 via-amber-400 to-emerald-400',
    inputBg: 'bg-slate-900/90 text-white focus:bg-slate-900',
    inputBorder: 'border-slate-700 focus:ring-rose-500',
  },
  emerald: {
    id: 'emerald',
    name: 'Sage Botanical (Hijau Alam)',
    badge: 'Sejuk & Menenangkan 🌿',
    description: 'Sentuhan warna sage green, dedaunan eucalyptus, dan emas menyejukkan hati.',
    icon: '🌿',
    previewColors: ['#059669', '#A7F3D0', '#F0FDF4'],
    isDark: false,
    bodyBg: 'bg-[#F2F7F4]',
    cardBg: 'bg-white',
    cardBorder: 'border-emerald-100',
    cardHoverBorder: 'hover:border-emerald-300',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-emerald-900/80',
    textMuted: 'text-emerald-600/60',
    topBannerGradient: 'from-emerald-600 via-teal-600 to-amber-600',
    heroGradient: 'from-emerald-700 via-teal-600 to-amber-600',
    primaryButton: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
    primaryButtonHover: 'hover:bg-emerald-700',
    accentBadge: 'bg-emerald-100 text-emerald-800',
    accentColor: '#10B981',
    progressTrack: 'bg-emerald-100',
    progressGradient: 'from-emerald-500 via-teal-400 to-amber-400',
    inputBg: 'bg-emerald-50/40 focus:bg-white',
    inputBorder: 'border-emerald-200 focus:ring-emerald-400',
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Dream (Ungu Manis)',
    badge: 'Estetik & Anggun 🔮',
    description: 'Nuansa ungu pastel lilac bloom yang syahdu, puitis, dan estetik.',
    icon: '🔮',
    previewColors: ['#8B5CF6', '#DDD6FE', '#F5F3FF'],
    isDark: false,
    bodyBg: 'bg-[#F7F5FC]',
    cardBg: 'bg-white',
    cardBorder: 'border-purple-100',
    cardHoverBorder: 'hover:border-purple-300',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-purple-950/80',
    textMuted: 'text-purple-400',
    topBannerGradient: 'from-purple-600 via-violet-500 to-pink-500',
    heroGradient: 'from-purple-700 via-violet-600 to-pink-500',
    primaryButton: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200',
    primaryButtonHover: 'hover:bg-purple-700',
    accentBadge: 'bg-purple-100 text-purple-800',
    accentColor: '#8B5CF6',
    progressTrack: 'bg-purple-100',
    progressGradient: 'from-purple-500 via-violet-400 to-pink-400',
    inputBg: 'bg-purple-50/40 focus:bg-white',
    inputBorder: 'border-purple-200 focus:ring-purple-400',
  },
  peach: {
    id: 'peach',
    name: 'Sunset Peach (Coral Hangat)',
    badge: 'Hangat & Penuh Semangat 🍑',
    description: 'Perpaduan peach segar, jingga aprikot, dan matahari terbenam yang penuh optimisme.',
    icon: '🍑',
    previewColors: ['#F97316', '#FFEDD5', '#FFF7ED'],
    isDark: false,
    bodyBg: 'bg-[#FFF8F3]',
    cardBg: 'bg-white',
    cardBorder: 'border-orange-100',
    cardHoverBorder: 'hover:border-orange-300',
    textPrimary: 'text-slate-800',
    textSecondary: 'text-orange-950/80',
    textMuted: 'text-orange-400',
    topBannerGradient: 'from-orange-500 via-amber-500 to-rose-500',
    heroGradient: 'from-orange-600 via-amber-500 to-rose-500',
    primaryButton: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-200',
    primaryButtonHover: 'hover:bg-orange-600',
    accentBadge: 'bg-orange-100 text-orange-800',
    accentColor: '#F97316',
    progressTrack: 'bg-orange-100',
    progressGradient: 'from-orange-500 via-amber-400 to-rose-400',
    inputBg: 'bg-orange-50/40 focus:bg-white',
    inputBorder: 'border-orange-200 focus:ring-orange-400',
  },
};
