import React from 'react';
import { X, Bell, CheckCheck, Trash2, Trophy, ArrowDownLeft, ArrowUpRight, Sparkles } from 'lucide-react';
import { CoupleNotification } from '../types/wedding';
import { formatDateTimeID, formatIDR } from '../utils/formatters';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: CoupleNotification[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectMilestone?: (milestoneId: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectMilestone,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col transform transition-transform animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-rose-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-rose-100 text-rose-600 rounded-xl">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-800 text-base">Notifikasi Pasangan</h2>
              <p className="text-xs text-slate-500">Milestone, setoran, & pengeluaran baru</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-4 py-2 border-b border-slate-100 bg-white flex items-center justify-between text-xs text-slate-500">
          <span>{notifications.length} pemberitahuan</span>
          <div className="flex items-center gap-3">
            <button
              onClick={onMarkAllAsRead}
              className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-medium cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Tandai terbaca</span>
            </button>
            <button
              onClick={onClearAll}
              className="flex items-center gap-1 text-slate-400 hover:text-red-600 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Bersihkan</span>
            </button>
          </div>
        </div>

        {/* Notification List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
              <Sparkles className="w-10 h-10 text-rose-200 mb-2" />
              <p className="font-medium text-slate-600 text-sm">Belum ada notifikasi baru</p>
              <p className="text-xs mt-1">Setoran baru dan pencapaian milestone akan muncul di sini secara otomatis.</p>
            </div>
          ) : (
            notifications.map((notif) => {
              const isMilestone = notif.type === 'milestone';
              const isDeposit = notif.type === 'deposit';

              return (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (isMilestone && notif.milestoneId && onSelectMilestone) {
                      onSelectMilestone(notif.milestoneId);
                    }
                  }}
                  className={`p-3.5 rounded-2xl border transition text-left cursor-pointer ${
                    !notif.read
                      ? 'bg-rose-50/60 border-rose-200 shadow-xs'
                      : 'bg-white border-slate-100 hover:border-rose-200'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-xl shrink-0 ${
                      isMilestone 
                        ? 'bg-amber-100 text-amber-700' 
                        : isDeposit 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-rose-100 text-rose-700'
                    }`}>
                      {isMilestone ? (
                        <Trophy className="w-4 h-4" />
                      ) : isDeposit ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-800 truncate">
                          {notif.title}
                        </h4>
                        {!notif.read && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {notif.message}
                      </p>
                      {notif.amount && (
                        <div className="mt-1 text-xs font-mono font-semibold text-slate-700">
                          Nominal: {formatIDR(notif.amount)}
                        </div>
                      )}
                      <div className="mt-2 text-[10px] text-slate-400">
                        {typeof notif.date === 'string' && notif.date.includes('-') 
                          ? notif.date 
                          : formatDateTimeID(notif.date)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
