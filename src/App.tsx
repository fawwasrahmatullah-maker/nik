/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
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
import { 
  getInitialRoomId, 
  pushRoomDataToServer, 
  fetchRoomDataFromServer, 
  resetRoomOnServer, 
  CLIENT_ID 
} from './services/realtimeSync';

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
import { ShareRoomModal } from './components/ShareRoomModal';

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
  // Active Room ID from URL query ?room=... or localStorage
  const [roomId, setRoomId] = useState<string>(() => getInitialRoomId());
  const [syncStatus, setSyncStatus] = useState<'connected' | 'connecting' | 'reconnecting' | 'offline'>('connecting');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // Core state
  const [coupleInfo, setCoupleInfo] = useState<CoupleInfo>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.COUPLE_INFO}_${roomId}`);
      return saved ? JSON.parse(saved) : initialCoupleInfo;
    } catch {
      return initialCoupleInfo;
    }
  });

  const [categories, setCategories] = useState<BudgetCategory[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.CATEGORIES}_${roomId}`);
      return saved ? JSON.parse(saved) : initialBudgetCategories;
    } catch {
      return initialBudgetCategories;
    }
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.TRANSACTIONS}_${roomId}`);
      return saved ? JSON.parse(saved) : initialTransactions;
    } catch {
      return initialTransactions;
    }
  });

  const [milestones, setMilestones] = useState<Milestone[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.MILESTONES}_${roomId}`);
      return saved ? JSON.parse(saved) : initialMilestones;
    } catch {
      return initialMilestones;
    }
  });

  const [notifications, setNotifications] = useState<CoupleNotification[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.NOTIFICATIONS}_${roomId}`);
      return saved ? JSON.parse(saved) : initialNotifications;
    } catch {
      return initialNotifications;
    }
  });

  const [loveNotes, setLoveNotes] = useState<LoveNote[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.LOVE_NOTES}_${roomId}`);
      return saved ? JSON.parse(saved) : initialLoveNotes;
    } catch {
      return initialLoveNotes;
    }
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${roomId}`);
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
  const lastPushedHashRef = useRef<string>('');

  // Local storage caching per room
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEYS.COUPLE_INFO}_${roomId}`, JSON.stringify(coupleInfo));
      localStorage.setItem(`${STORAGE_KEYS.CATEGORIES}_${roomId}`, JSON.stringify(categories));
      localStorage.setItem(`${STORAGE_KEYS.TRANSACTIONS}_${roomId}`, JSON.stringify(transactions));
      localStorage.setItem(`${STORAGE_KEYS.MILESTONES}_${roomId}`, JSON.stringify(milestones));
      localStorage.setItem(`${STORAGE_KEYS.NOTIFICATIONS}_${roomId}`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEYS.LOVE_NOTES}_${roomId}`, JSON.stringify(loveNotes));
      localStorage.setItem(`${STORAGE_KEYS.CHAT_MESSAGES}_${roomId}`, JSON.stringify(chatMessages));
    } catch {
      // quota or private browsing
    }
  }, [coupleInfo, categories, transactions, milestones, notifications, loveNotes, chatMessages, roomId]);

  // Push updates to server helper
  const syncToServer = useCallback((patch: Partial<{
    coupleInfo: CoupleInfo;
    categories: BudgetCategory[];
    transactions: Transaction[];
    milestones: Milestone[];
    notifications: CoupleNotification[];
    loveNotes: LoveNote[];
    chatMessages: ChatMessage[];
  }>) => {
    const fullBundle = {
      coupleInfo: patch.coupleInfo ?? coupleInfo,
      categories: patch.categories ?? categories,
      transactions: patch.transactions ?? transactions,
      milestones: patch.milestones ?? milestones,
      notifications: patch.notifications ?? notifications,
      loveNotes: patch.loveNotes ?? loveNotes,
      chatMessages: patch.chatMessages ?? chatMessages,
    };
    pushRoomDataToServer(roomId, fullBundle);
  }, [coupleInfo, categories, transactions, milestones, notifications, loveNotes, chatMessages, roomId]);

  // Real-time SSE Connection & Auto Sync
  useEffect(() => {
    let eventSource: EventSource | null = null;
    let pollInterval: any = null;
    let isMounted = true;

    setSyncStatus('connecting');

    // 1. Initial snapshot fetch
    fetchRoomDataFromServer(roomId).then((data) => {
      if (!isMounted || !data) return;
      if (data.coupleInfo) setCoupleInfo(data.coupleInfo);
      if (Array.isArray(data.categories)) setCategories(data.categories);
      if (Array.isArray(data.transactions)) setTransactions(data.transactions);
      if (Array.isArray(data.milestones)) setMilestones(data.milestones);
      if (Array.isArray(data.notifications)) setNotifications(data.notifications);
      if (Array.isArray(data.loveNotes)) setLoveNotes(data.loveNotes);
      if (Array.isArray(data.chatMessages)) setChatMessages(data.chatMessages);
      setSyncStatus('connected');
    });

    // 2. Connect to Server-Sent Events (SSE)
    try {
      const sseUrl = `/api/wedding/${encodeURIComponent(roomId)}/events`;
      eventSource = new EventSource(sseUrl);

      eventSource.onopen = () => {
        if (isMounted) setSyncStatus('connected');
      };

      eventSource.onmessage = (event) => {
        if (!isMounted) return;
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === 'CONNECTED' || payload.type === 'ROOM_UPDATE') {
            const data = payload.data;
            if (data && payload.senderClientId !== CLIENT_ID) {
              // Remote partner changed something -> update local view instantly!
              if (data.coupleInfo) setCoupleInfo(data.coupleInfo);
              if (Array.isArray(data.categories)) setCategories(data.categories);
              if (Array.isArray(data.transactions)) setTransactions(data.transactions);
              if (Array.isArray(data.milestones)) setMilestones(data.milestones);
              if (Array.isArray(data.notifications)) setNotifications(data.notifications);
              if (Array.isArray(data.loveNotes)) setLoveNotes(data.loveNotes);
              if (Array.isArray(data.chatMessages)) setChatMessages(data.chatMessages);
            }
            setSyncStatus('connected');
          }
        } catch {
          // ignore heartbeat
        }
      };

      eventSource.onerror = () => {
        if (isMounted) setSyncStatus('reconnecting');
      };
    } catch {
      if (isMounted) setSyncStatus('reconnecting');
    }

    // 3. Fallback sync poll every 5 seconds in case connection dropped
    pollInterval = setInterval(async () => {
      if (!isMounted) return;
      const data = await fetchRoomDataFromServer(roomId);
      if (data) {
        setSyncStatus('connected');
      }
    }, 5000);

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [roomId]);

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
  const checkMilestones = (newTotalDeposit: number, currentList: Milestone[]) => {
    let newlyAchieved: Milestone | null = null;

    const updated = currentList.map((m) => {
      if (!m.achieved && newTotalDeposit >= m.targetAmount) {
        const nowStr = new Date().toISOString().split('T')[0];
        newlyAchieved = { ...m, achieved: true, achievedDate: nowStr };
        return newlyAchieved;
      }
      return m;
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

      setMilestones(updated);
      setNotifications((prev) => [newNotif, ...prev]);
      setChatMessages((prev) => [...prev, newChat]);

      // Broadcast to partner in real-time
      syncToServer({
        milestones: updated,
        notifications: [newNotif, ...notifications],
        chatMessages: [...chatMessages, newChat],
      });

      // Open celebration modal
      setCelebrationMilestone(achievedItem);
    } else {
      setMilestones(updated);
    }
  };

  // Add Transaction Handler
  const handleAddTransaction = (txData: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...txData,
      id: `tx-${Date.now()}`,
      createdAt: Date.now(),
    };

    const nextTransactions = [newTx, ...transactions];
    setTransactions(nextTransactions);

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
      const nextNotifications = [notif, ...notifications];
      setNotifications(nextNotifications);

      // Check milestones
      checkMilestones(newTotal, milestones);

      // Push real-time to server
      syncToServer({
        transactions: nextTransactions,
        notifications: nextNotifications,
      });
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
      const nextNotifications = [notif, ...notifications];
      setNotifications(nextNotifications);

      // Push real-time to server
      syncToServer({
        transactions: nextTransactions,
        notifications: nextNotifications,
      });
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const nextTransactions = transactions.filter((t) => t.id !== id);
    setTransactions(nextTransactions);
    syncToServer({ transactions: nextTransactions });
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

    const nextChats = [...chatMessages, newChat];
    setChatMessages(nextChats);
    playDepositSound();

    // Broadcast chat message to partner device immediately
    syncToServer({ chatMessages: nextChats });
  };

  const handleAddReaction = (messageId: string, emoji: string) => {
    const nextChats = chatMessages.map((m) => (m.id === messageId ? { ...m, reaction: emoji } : m));
    setChatMessages(nextChats);
    syncToServer({ chatMessages: nextChats });
  };

  // Custom milestone
  const handleAddCustomMilestone = (m: Omit<Milestone, 'id' | 'achieved'>) => {
    const newM: Milestone = {
      ...m,
      id: `mile-custom-${Date.now()}`,
      achieved: totalDeposited >= m.targetAmount,
      achievedDate: totalDeposited >= m.targetAmount ? new Date().toISOString().split('T')[0] : undefined,
    };
    const nextMilestones = [...milestones, newM];
    setMilestones(nextMilestones);
    syncToServer({ milestones: nextMilestones });

    if (newM.achieved) {
      setCelebrationMilestone(newM);
    }
  };

  const handleDeleteMilestone = (id: string) => {
    const nextMilestones = milestones.filter((m) => m.id !== id);
    setMilestones(nextMilestones);
    syncToServer({ milestones: nextMilestones });
  };

  // Love notes
  const handleAddLoveNote = (note: Omit<LoveNote, 'id'>) => {
    const newNote: LoveNote = {
      ...note,
      id: `note-${Date.now()}`,
    };
    const nextNotes = [newNote, ...loveNotes];
    setLoveNotes(nextNotes);
    syncToServer({ loveNotes: nextNotes });
  };

  const handleDeleteLoveNote = (id: string) => {
    const nextNotes = loveNotes.filter((n) => n.id !== id);
    setLoveNotes(nextNotes);
    syncToServer({ loveNotes: nextNotes });
  };

  // Change room handler
  const handleChangeRoom = (newRoomId: string) => {
    if (!newRoomId || newRoomId === roomId) return;
    setRoomId(newRoomId);
    localStorage.setItem('nikahplan_active_room', newRoomId);

    // Update URL query param without full reload
    const url = new URL(window.location.href);
    url.searchParams.set('room', newRoomId);
    window.history.replaceState({}, '', url.toString());
  };

  // Export / Import
  const handleExportData = () => {
    const exportBundle = {
      version: 1,
      roomId,
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

        // Push restored data to server
        syncToServer(parsed);
        alert('Data berhasil dipulihkan dan disinkronkan ke cloud server!');
      } catch {
        alert('Gagal membaca file cadangan. Pastikan format file JSON valid.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = async () => {
    if (confirm('Kembalikan semua data ke contoh awal? Semua data yang baru Anda ubah akan digantikan data demo di server.')) {
      const resetData = await resetRoomOnServer(roomId);
      if (resetData) {
        setCoupleInfo(resetData.coupleInfo);
        setCategories(resetData.categories);
        setTransactions(resetData.transactions);
        setMilestones(resetData.milestones);
        setNotifications(resetData.notifications);
        setLoveNotes(resetData.loveNotes);
        setChatMessages(resetData.chatMessages);
      } else {
        setCoupleInfo(initialCoupleInfo);
        setCategories(initialBudgetCategories);
        setTransactions(initialTransactions);
        setMilestones(initialMilestones);
        setNotifications(initialNotifications);
        setLoveNotes(initialLoveNotes);
        setChatMessages(initialChatMessages);
        syncToServer({
          coupleInfo: initialCoupleInfo,
          categories: initialBudgetCategories,
          transactions: initialTransactions,
          milestones: initialMilestones,
          notifications: initialNotifications,
          loveNotes: initialLoveNotes,
          chatMessages: initialChatMessages,
        });
      }
      alert('Data telah dikembalikan ke contoh semula dan tersinkronkan.');
    }
  };

  // Notification actions
  const handleMarkAllNotifsRead = () => {
    const nextNotifs = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(nextNotifs);
    syncToServer({ notifications: nextNotifs });
  };

  const handleClearNotifs = () => {
    setNotifications([]);
    syncToServer({ notifications: [] });
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

      {/* Main Header with Realtime Indicator & Link Share */}
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
        roomId={roomId}
        syncStatus={syncStatus}
        onOpenShareModal={() => setIsShareModalOpen(true)}
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
              const next = categories.map((c) => (c.id === updated.id ? updated : c));
              setCategories(next);
              syncToServer({ categories: next });
            }}
            onAddCategory={(newCat) => {
              const next = [...categories, newCat];
              setCategories(next);
              syncToServer({ categories: next });
            }}
            onDeleteCategory={(catId) => {
              const next = categories.filter((c) => c.id !== catId);
              setCategories(next);
              syncToServer({ categories: next });
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
        onSave={(updated) => {
          setCoupleInfo(updated);
          syncToServer({ coupleInfo: updated });
        }}
      />

      <BudgetCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
        currentTarget={coupleInfo.targetAmount}
        onApplyBudget={(newTarget, suggested) => {
          const updatedInfo = { ...coupleInfo, targetAmount: newTarget };
          setCoupleInfo(updatedInfo);
          setCategories(suggested);
          syncToServer({ coupleInfo: updatedInfo, categories: suggested });
        }}
      />

      <ShareRoomModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        roomId={roomId}
        syncStatus={syncStatus}
        onChangeRoom={handleChangeRoom}
      />

      {/* Romantic Footer */}
      <footer className="border-t border-rose-100 bg-white/70 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="flex items-center justify-center gap-1.5">
            Dibuat dengan cinta untuk <strong className="text-slate-800">{coupleInfo.partner1.name} & {coupleInfo.partner2.name}</strong> • Menuju Akad Suci {coupleInfo.weddingDate} 💍
          </p>
          <div className="flex items-center gap-4 text-slate-400">
            <button 
              onClick={() => setIsShareModalOpen(true)}
              className="text-emerald-700 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              <span>Link Bersama: {roomId}</span>
            </button>
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
