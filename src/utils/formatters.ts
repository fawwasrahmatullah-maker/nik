/**
 * Utility functions for Indonesian Rupiah formatting, date calculations, and audio chime
 */

export function formatIDR(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function formatCompactIDR(amount: number): string {
  if (amount >= 1_000_000_000) {
    return `Rp ${(amount / 1_000_000_000).toFixed(1).replace('.0', '')} Miliar`;
  }
  if (amount >= 1_000_000) {
    return `Rp ${(amount / 1_000_000).toFixed(1).replace('.0', '')} Juta`;
  }
  if (amount >= 1_000) {
    return `Rp ${(amount / 1_000).toFixed(0)} Ribu`;
  }
  return formatIDR(amount);
}

export function formatDateID(dateString: string): string {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTimeID(timestamp: number | string): string {
  try {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '-';
  }
}

export interface CountdownResult {
  days: number;
  months: number;
  remainingDays: number;
  isPast: boolean;
  totalDays: number;
}

export function calculateWeddingCountdown(targetDateStr: string): CountdownResult {
  const target = new Date(targetDateStr).getTime();
  const now = new Date().getTime();
  const diffTime = target - now;
  const isPast = diffTime <= 0;
  
  const totalDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const months = Math.floor(totalDays / 30);
  const remainingDays = totalDays % 30;

  return {
    days: totalDays,
    months,
    remainingDays,
    isPast,
    totalDays,
  };
}

/**
 * Web Audio API synthesizer for cheerful milestone chime & success notifications
 * Safe, zero-network dependency, works instantly on mobile and desktop browsers.
 */
export function playMilestoneSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 fanfare
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

      gain.gain.setValueAtTime(0.01, startTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, startTime + index * 0.12 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.12);
      osc.stop(startTime + index * 0.12 + 0.4);
    });
  } catch {
    // Audio autoplay restrictions or unsupported
  }
}

export function playDepositSound(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  } catch {
    // ignore
  }
}
