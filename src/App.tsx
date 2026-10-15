/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  CoupleInfo, 
  BudgetCategory, 
  Transaction, 
  Milestone, 
  CoupleNotification, 
  LoveNote, 
  ChatMessage, 
  PartnerRole, 
  TransactionType 
} from './types/wedding';
import { 
  initialCoupleInfo, 
  initialBudgetCategories, 
  initialMilestones, 
  initialTransactions, 
  initialNotifications, 
  initialLoveNotes, 
  initialChatMessages 
} from './data/initialData';
import { 
  playMilestoneSound, 
  playDepositSound, 
  formatIDR 
} from './utils/formatters';

import { Header } from './components/Header';
import { DashboardOverview } from './components/DashboardOverview';
import { CategoryBudgetSection } from './components/CategoryBudgetSection';
import { TransactionList } from './components/TransactionList';
import { MilestonesSection } from './components/MilestonesSection';
import { CoupleChat } from './components/CoupleChat';
import { LoveNotesWidget } from './components/LoveNotesWidget';
import { AddTransactionModal } from './components/AddTransactionModal';
import { MilestoneCelebrationModal } from './components/MilestoneCelebrationModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { CoupleSettingsModal } from './components/CoupleSettingsModal';
import { BudgetCalculatorModal } from './components/BudgetCalculatorModal';

const STORAGE_KEYS = {
  COUPLE_INFO: 'nikahplan_couple_info',
  CATEGORIES: 'nikahplan_categories',
  TRANSACTIONS: 'nikahplan_transactions',
  MILESTONES: 'nikahplan_milestones',
  NOTIFICATIONS: 'nikahplan_notifications',
  LOVE_NOTES: 'nikahplan_love_notes',
  CHAT_MESSAGES: 'nikahplan_chat_messages',
};

export default function App() {
  // Load state from localStorage or initial seed
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COUPLE_INFO);
      return saved ? JSON.parse(saved) : initialCoupleInfo;
    } catch {
      return initialCoupleInfo;
    }
  });

  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      return saved ? JSON.parse(saved) : initialBudgetCategories;
    } catch {
      return initialBudgetCategories;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MILESTONES);
      return saved ? JSON.parse(saved) : initialMilestones;
    } catch {
      return initialMilestones;
    }
  });

  const [notifications, setNotifications] = useState<CoupleNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [loveNotes, setLoveNotes] = useState<LoveNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LOVE_NOTES);
      return saved ? JSON.parse(saved) : initialLoveNotes;
    } catch {
      return initialLoveNotes;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
      return saved ? JSON.parse(saved) : initialChatMessages;
    } catch {
      return initialChatMessages;
    }
  });

  // UI state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'categories' | 'transactions' | 'milestones' | 'chat' | 'loveNotes'>('dashboard');
  const [activePartner, setActivePartner] = useState<PartnerRole | 'both'>('both');

  // Modals
  const [addTxModalOpen, setAddTxModalOpen] = useState(false);
  const [addTxDefaultType, setAddTxDefaultType] = useState<TransactionType>('deposit');
  const [addTxDefaultPartner, setAddTxDefaultPartner] = useState<PartnerRole | undefined>(undefined);
  const [celebrationMilestone, setCelebrationMilestone] = useState<Milestone | null>(null);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COUPLE_INFO, JSON.stringify(coupleInfo));
  }, [coupleInfo]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  }, [milestones]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LOVE_NOTES, JSON.stringify(loveNotes));
  }, [loveNotes]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Derived financial computations
  const totalDeposited = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const totalExpenses = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const partner1Deposits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit' && t.partnerId === 'partner1')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const partner2Deposits = useMemo(() => {
    return transactions
      .filter((t) => t.type === 'deposit' && t.partnerId === 'partner2')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.read).length;
  }, [notifications]);

  // Automatic Milestone Detection Engine
  const checkMilestones = (newTotalDeposit: number) => {
    let newlyAchieved: Milestone | null = null;

    setMilestones((prevMilestones) => {
      const updated = prevMilestones.map((m) => {
        if (!m.achieved && newTotalDeposit >= m.targetAmount) {
          const nowStr = new Date().toISOString().split('T')[0];
          newlyAchieved = { ...m, achieved: true, achievedDate: nowStr };
          return newlyAchieved;
        }
        return m;
      });
      return updated;
    });

    if (newlyAchieved) {
      const achievedItem = newlyAchieved as Milestone;
      // Sound fanfare
      playMilestoneSound();

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#F43F5E', '#EC4899', '#F59E0B', '#10B981', '#6366F1'],
        });
      } catch {
        // ignore
      }

      // Add Notification
      const newNotif: CoupleNotification = {
        id: `notif-${Date.now()}`,
        title: `Milestone ${achievedItem.targetPercentage}% Terbuka! 🎉`,
        message: `Hebat! Total tabungan mencapai ${formatIDR(newTotalDeposit)}. Milestone "${achievedItem.title}" resmi tercapai!`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'milestone',
        read: false,
        milestoneId: achievedItem.id,
        amount: achievedItem.targetAmount,
      };
      setNotifications((prev) => [newNotif, ...prev]);

      // Add System Chat Announcement
      const newChat: ChatMessage = {
        id: `chat-sys-${Date.now()}`,
        senderId: 'system',
        senderName: 'Sistem NikahPlan',
        text: `🎉 MILESTONE BARU TERCAPAI: "${achievedItem.title}" senilai ${formatIDR(achievedItem.targetAmount)} (${achievedItem.targetPercentage}%)! Selamat ${coupleInfo.partner1.nickname} & ${coupleInfo.partner2.nickname}! 💖💍`,
        timestamp: Date.now(),
        type: 'savings_milestone',
        highlightAmount: achievedItem.targetAmount,
      };
      setChatMessages((prev) => [...prev, newChat]);

      // Open celebration modal
      setCelebrationMilestone(achievedItem);
    }
  };

  // Add Transaction Handler
  const handleAddTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: Date.now(),
    };

    setTransactions((prev) => [newTx, ...prev]);

    if (newTx.type === 'deposit') {
      playDepositSound();
      const newTotal = totalDeposited + newTx.amount;

      // Add notification for deposit
      const depositor = newTx.partnerId === 'partner1' ? coupleInfo.partner1.nickname : newTx.partnerId === 'partner2' ? coupleInfo.partner2.nickname : 'Kalian berdua';
      const notif: CoupleNotification = {
        id: `notif-${Date.now()}`,
        title: `Setoran Tabungan Baru (+${formatIDR(newTx.amount)}) 💰`,
        message: `${depositor} menambahkan setoran "${newTx.description}". Saldo kas bersama bertambah!`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'deposit',
        read: false,
        amount: newTx.amount,
      };
      setNotifications((prev) => [notif, ...prev]);

      // Check milestones
      checkMilestones(newTotal);
    } else {
      // Expense notification
      const notif: CoupleNotification = {
        id: `notif-${Date.now()}`,
        title: `Pengeluaran Vendor Tercatat (-${formatIDR(newTx.amount)}) 🧾`,
        message: `Pembayaran "${newTx.description}" (${newTx.categoryName || 'Vendor'}) dicatat ke kas bersama.`,
        date: new Date().toISOString().replace('T', ' ').slice(0, 16),
        type: 'expense',
        read: false,
        amount: newTx.amount,
      };
      setNotifications((prev) => [notif, ...prev]);
    }
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Chat message send handler
  const handleSendChatMessage = (msg: { text: string; sticker?: string; type?: ChatMessage['type']; highlightAmount?: number }) => {
    const senderRole = activePartner === 'partner2' ? 'partner2' : 'partner1';
    const sender = coupleInfo[senderRole];

    const newChat: ChatMessage = {
      id: `chat-${Date.now()}`,
      senderId: senderRole,
      senderName: sender.name,
      text: msg.text,
      sticker: msg.sticker,
      type: msg.type || 'text',
      highlightAmount: msg.highlightAmount,
      timestamp: Date.now(),
    };

    setChatMessages((prev) => [...prev, newChat]);
    playDepositSound();
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    setChatMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, reaction: emoji } : m))
    );
  };

  // Custom milestone
  const handleAddCustomMilestone = (m: Omit<Milestone, 'id' | 'achieved'>) => {
    const newM: Milestone = {
      ...m,
      id: `mile-custom-${Date.now()}`,
      achieved: totalDeposited >= m.targetAmount,
      achievedDate: totalDeposited >= m.targetAmount ? new Date().toISOString().split('T')[0] : undefined,
    };
    setMilestones((prev) => [...prev, newM]);

    if (newM.achieved) {
      setCelebrationMilestone(newM);
    }
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  // Love notes
  const handleAddLoveNote = (note: Omit<LoveNote, 'id'>) => {
    const newNote: LoveNote = {
      ...note,
      id: `note-${Date.now()}`,
    };
    setLoveNotes((prev) => [newNote, ...prev]);
  };

  const handleDeleteLoveNote = (id: string) => {
    setLoveNotes((prev) => prev.filter((n) => n.id !== id));
  };

  // Export / Import
  const handleExportData = () => {
    const exportBundle = {
      version: 1,
      exportedAt: new Date().toISOString(),
      coupleInfo,
      categories,
      transactions,
      milestones,
      notifications,
      loveNotes,
      chatMessages,
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `NikahPlan_Backup_${coupleInfo.partner1.nickname}_${coupleInfo.partner2.nickname}_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleTriggerImport = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.coupleInfo) setCoupleInfo(parsed.coupleInfo);
        if (parsed.categories) setCategories(parsed.categories);
        if (parsed.transactions) setTransactions(parsed.transactions);
        if (parsed.milestones) setMilestones(parsed.milestones);
        if (parsed.notifications) setNotifications(parsed.notifications);
        if (parsed.loveNotes) setLoveNotes(parsed.loveNotes);
        if (parsed.chatMessages) setChatMessages(parsed.chatMessages);
        alert('Data berhasil dipulihkan dari cadangan!');
      } catch (err) {
        alert('Gagal membaca file cadangan. Pastikan format file JSON valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = () => {
    if (confirm('Kembalikan semua data ke contoh awal? Semua data yang baru Anda ubah akan digantikan data demo.')) {
      setCoupleInfo(initialCoupleInfo);
      setCategories(initialBudgetCategories);
      setTransactions(initialTransactions);
      setMilestones(initialMilestones);
      setNotifications(initialNotifications);
      setLoveNotes(initialLoveNotes);
      setChatMessages(initialChatMessages);
      localStorage.clear();
      alert('Data telah dikembalikan ke contoh semula.');
    }
  };

  // Notification actions
  const handleMarkAllNotifsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleClearNotifs = () => {
    setNotifications([]);
  };

  const handleOpenAddModal = (type?: TransactionType, partner?: PartnerRole) => {
    setAddTxDefaultType(type || 'deposit');
    setAddTxDefaultPartner(partner);
    setAddTxModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F5] flex flex-col selection:bg-rose-200 selection:text-rose-900">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImportFile}
        accept=".json"
        className="hidden"
      />

      {/* Main Header */}
      <Header
        coupleInfo={coupleInfo}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activePartner={activePartner}
        setActivePartner={setActivePartner}
        unreadCount={unreadCount}
        setIsNotificationOpen={setIsNotificationOpen}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenCalculator={() => setIsCalculatorOpen(true)}
        onExportData={handleExportData}
        onImportData={handleTriggerImport}
        onResetData={handleResetData}
      />

      {/* Main Body Content based on active tab */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeTab === 'dashboard' && (
          <DashboardOverview
            coupleInfo={coupleInfo}
            categories={categories}
            transactions={transactions}
            milestones={milestones}
            activePartner={activePartner}
            totalDeposited={totalDeposited}
            totalExpenses={totalExpenses}
            partner1Deposits={partner1Deposits}
            partner2Deposits={partner2Deposits}
            onOpenAddModal={handleOpenAddModal}
            onSelectMilestone={(m) => setCelebrationMilestone(m)}
            onOpenCalculator={() => setIsCalculatorOpen(true)}
            onNavigateToTab={(t) => setActiveTab(t)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoryBudgetSection
            categories={categories}
            transactions={transactions}
            coupleInfo={coupleInfo}
            onUpdateCategory={(updated) => {
              setCategories((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
            }}
            onAddCategory={(newCat) => {
              setCategories((prev) => [...prev, newCat]);
            }}
            onDeleteCategory={(catId) => {
              setCategories((prev) => prev.filter((c) => c.id !== catId));
            }}
          />
        )}

        {activeTab === 'transactions' && (
          <TransactionList
            transactions={transactions}
            coupleInfo={coupleInfo}
            onOpenAddModal={handleOpenAddModal}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'milestones' && (
          <MilestonesSection
            milestones={milestones}
            totalDeposited={totalDeposited}
            coupleInfo={coupleInfo}
            onSelectMilestone={(m) => setCelebrationMilestone(m)}
            onAddCustomMilestone={handleAddCustomMilestone}
            onDeleteMilestone={handleDeleteMilestone}
          />
        )}

        {activeTab === 'chat' && (
          <CoupleChat
            coupleInfo={coupleInfo}
            activePartner={activePartner}
            setActivePartner={setActivePartner}
            messages={chatMessages}
            onSendMessage={handleSendChatMessage}
            onAddReaction={handleAddReaction}
          />
        )}

        {activeTab === 'loveNotes' && (
          <LoveNotesWidget
            loveNotes={loveNotes}
            coupleInfo={coupleInfo}
            activePartner={activePartner}
            onAddNote={handleAddLoveNote}
            onDeleteNote={handleDeleteLoveNote}
          />
        )}
      </main>

      {/* Modals & Drawers */}
      <AddTransactionModal
        isOpen={addTxModalOpen}
        onClose={() => setAddTxModalOpen(false)}
        categories={categories}
        coupleInfo={coupleInfo}
        initialType={addTxDefaultType}
        initialPartner={addTxDefaultPartner}
        onAddTransaction={handleAddTransaction}
      />

      <MilestoneCelebrationModal
        milestone={celebrationMilestone}
        coupleInfo={coupleInfo}
        onClose={() => setCelebrationMilestone(null)}
        onSendToChat={(text) => {
          handleSendChatMessage({
            text,
            type: 'savings_milestone',
            highlightAmount: celebrationMilestone?.targetAmount,
          });
          setActiveTab('chat');
        }}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotifsRead}
        onClearAll={handleClearNotifs}
        onSelectMilestone={(mId) => {
          const found = milestones.find((m) => m.id === mId);
          if (found) {
            setCelebrationMilestone(found);
            setIsNotificationOpen(false);
          }
        }}
      />

      <CoupleSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        coupleInfo={coupleInfo}
        onSave={(updated) => setCoupleInfo(updated)}
      />

      <BudgetCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentTarget={coupleInfo.targetAmount}
        onApplyBudget={(newTarget, suggested) => {
          setCoupleInfo((prev) => ({ ...prev, targetAmount: newTarget }));
          setCategories(suggested);
        }}
      />

      {/* Romantic Footer */}
      <footer className="border-t border-rose-100 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center justify-center gap-1.5">
            Dibuat dengan cinta untuk <strong className="text-slate-800">{coupleInfo.partner1.name} & {coupleInfo.partner2.name}</strong> • Menuju Akad Suci {coupleInfo.weddingDate} 💍
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Satu Hati, Satu Tabungan</span>
            <span>•</span>
            <button onClick={handleExportData} className="hover:text-rose-600 transition cursor-pointer">
              Unduh Rekap Data
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
