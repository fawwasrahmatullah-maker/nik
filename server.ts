import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const STORE_FILE = path.resolve(DATA_DIR, 'wedding-rooms.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory room storage & persistence
interface RoomData {
  coupleInfo: any;
  categories: any[];
  transactions: any[];
  milestones: any[];
  notifications: any[];
  loveNotes: any[];
  chatMessages: any[];
  updatedAt: number;
}

const rooms = new Map<string, RoomData>();

// Load from disk if exists
try {
  if (fs.existsSync(STORE_FILE)) {
    const raw = fs.readFileSync(STORE_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    for (const [key, val] of Object.entries(parsed)) {
      rooms.set(key, val as RoomData);
    }
    console.log(`[Storage] Loaded ${rooms.size} rooms from ${STORE_FILE}`);
  }
} catch (err) {
  console.error('[Storage] Error loading store file:', err);
}

function saveStoreToDisk() {
  try {
    const obj: Record<string, RoomData> = {};
    for (const [key, val] of rooms.entries()) {
      obj[key] = val;
    }
    fs.writeFileSync(STORE_FILE, JSON.stringify(obj, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Storage] Error saving store file:', err);
  }
}

// Default Seed Data Generator for any new couple room
function generateDefaultRoomData(): RoomData {
  return {
    coupleInfo: {
      title: 'Pernikahan Impian Rizky & Amanda',
      weddingDate: '2027-08-15',
      location: 'Bandung & Jakarta',
      targetAmount: 120000000,
      estimatedGuests: 450,
      partner1: {
        id: 'partner1',
        name: 'Rizky Pratama',
        nickname: 'Rizky',
        avatar: '🤵',
        color: '#2563EB',
        targetShareRatio: 50,
        pocketName: 'BCA Prioritas / Jago Rizky',
      },
      partner2: {
        id: 'partner2',
        name: 'Amanda Putri',
        nickname: 'Amanda',
        avatar: '👰',
        color: '#E11D48',
        targetShareRatio: 50,
        pocketName: 'Mandiri Livin Amanda',
      },
      jointAccountName: 'Kantong Bersama (BCA & Jago)',
      jointAccountNumber: '8839-2049-1120',
      notes: 'Bismillah, melangkah bersama menuju akad suci & masa depan yang berkah.',
    },
    categories: [
      {
        id: 'cat-venue-catering',
        name: 'Gedung & Katering (450 Porsi)',
        icon: 'UtensilsCrossed',
        allocatedAmount: 50000000,
        color: '#F43F5E',
        description: 'Sewa ballroom, buffet 6 menu, food stall kambing guling & es krim',
      },
      {
        id: 'cat-dekorasi',
        name: 'Dekorasi & Pelaminan Modern Rustic',
        icon: 'Flower2',
        allocatedAmount: 18000000,
        color: '#EC4899',
        description: 'Pelaminan 10m, fresh flowers, photobooth, aisle pathway, lighting',
      },
      {
        id: 'cat-mua-busana',
        name: 'MUA & Busana Pengantin + Keluarga',
        icon: 'Sparkles',
        allocatedAmount: 14000000,
        color: '#8B5CF6',
        description: 'Rias akad & resepsi, retouch, kebaya adat sunda modern, beskap ortu',
      },
      {
        id: 'cat-dokumentasi',
        name: 'Dokumentasi Foto & Cinematic Video',
        icon: 'Camera',
        allocatedAmount: 11000000,
        color: '#06B6D4',
        description: '2 fotografer, 1 videografer drone, album premium magnetik, teaser reels',
      },
      {
        id: 'cat-cincin-mahar',
        name: 'Cincin Nikah & Mahar / Seserahan',
        icon: 'Gem',
        allocatedAmount: 12000000,
        color: '#F59E0B',
        description: 'Sepasang cincin emas putih/palladium & kotak mahar akrilik ukir',
      },
      {
        id: 'cat-undangan-souvenir',
        name: 'Undangan Digital + Cetak & Souvenir',
        icon: 'MailOpen',
        allocatedAmount: 5500000,
        color: '#10B981',
        description: 'Website undangan RSVP otomatis, 150 undangan fisik VIP, tumbler souvenir',
      },
      {
        id: 'cat-sound-mc',
        name: 'Sound System, MC & Acoustic Band',
        icon: 'Music',
        allocatedAmount: 4500000,
        color: '#6366F1',
        description: 'MC akad & resepsi bilingual, sound 5000 watt, live mini orchestra akustik',
      },
      {
        id: 'cat-tak-terduga',
        name: 'Dana Darurat & Biaya Tak Terduga (KUA & Hansip)',
        icon: 'ShieldAlert',
        allocatedAmount: 5000000,
        color: '#64748B',
        description: 'Penghulu KUA, keamanan gedung, parkir, perizinan, konsumsi panitia',
      },
    ],
    milestones: [
      {
        id: 'mile-10',
        title: 'Langkah Awal Komitmen Bersama',
        targetPercentage: 10,
        targetAmount: 12000000,
        description: 'Tabungan awal terbuka! Kita sudah resmi mulai berjuang bersama.',
        icon: 'Compass',
        badge: '10% Unlocked',
        achieved: true,
        achievedDate: '2026-06-10',
        celebrationMessage: 'Hebat! Langkah 10% pertama terlampaui. Niat baik selalu dimudahkan!',
      },
      {
        id: 'mile-25',
        title: 'Booking Venue & Tanggal Pernikahan!',
        targetPercentage: 25,
        targetAmount: 30000000,
        description: 'Dana cukup untuk DP Gedung favorit dan kunci tanggal hari H resmi.',
        icon: 'Building2',
        badge: 'Venue Secured',
        achieved: true,
        achievedDate: '2026-08-20',
        celebrationMessage: 'Gedung impian kita sudah aman! Kita melaju ke tahap berikutnya!',
      },
      {
        id: 'mile-50',
        title: 'Setengah Perjalanan! DP Katering & Dekorasi Terkunci',
        targetPercentage: 50,
        targetAmount: 60000000,
        description: 'Alhamdulillah separuh target tercapai. Vendor utama sudah mulai siap.',
        icon: 'HeartHandshake',
        badge: 'Halfway Hero 💖',
        achieved: true,
        achievedDate: '2026-09-30',
        celebrationMessage: 'Setengah perjalanan sudah kita lalui! Bangga banget sama perjuangan kita berdua.',
      },
      {
        id: 'mile-75',
        title: 'Busana, MUA & Dokumentasi Teramankan',
        targetPercentage: 75,
        targetAmount: 90000000,
        description: 'Hampir di garis finish! Menuju fitting busana dan prewedding shoot.',
        icon: 'Sparkles',
        badge: '75% Almost There',
        achieved: false,
        celebrationMessage: 'Tinggal 25% lagi! Gaun impian dan momen abadi kita sudah di depan mata!',
      },
      {
        id: 'mile-100',
        title: 'ALHAMDULILLAH! Dana Pernikahan Impian Lunas 100%',
        targetPercentage: 100,
        targetAmount: 120000000,
        description: 'Target dana impian terkumpul penuh tanpa hutang! Siap menyongsong hari bahagia.',
        icon: 'Crown',
        badge: 'Goal Completed 💍',
        achieved: false,
        celebrationMessage: 'MasyaAllah, tabungan pernikahan kita lunas 100%! Selamat cinta, mimpi kita jadi kenyataan!',
      },
    ],
    transactions: [
      {
        id: 'tx-dep-1',
        type: 'deposit',
        amount: 15000000,
        date: '2026-06-05',
        partnerId: 'partner1',
        pocketSource: 'Rekening BCA Rizky',
        description: 'Setoran modal tabungan awal bersama',
        notes: 'Tabungan gaji bulan Juni',
        createdAt: 1717550000000,
      },
      {
        id: 'tx-dep-2',
        type: 'deposit',
        amount: 15000000,
        date: '2026-06-08',
        partnerId: 'partner2',
        pocketSource: 'Mandiri Livin Amanda',
        description: 'Setoran tabungan awal penyeimbang',
        notes: 'Bonus project freelance',
        createdAt: 1717800000000,
      },
      {
        id: 'tx-dep-3',
        type: 'deposit',
        amount: 10000000,
        date: '2026-07-25',
        partnerId: 'partner1',
        pocketSource: 'BCA Rizky',
        description: 'Tabungan rutin bulanan Juli',
        notes: 'Disisihkan saat gajian',
        createdAt: 1721890000000,
      },
      {
        id: 'tx-dep-4',
        type: 'deposit',
        amount: 10000000,
        date: '2026-07-28',
        partnerId: 'partner2',
        pocketSource: 'Mandiri Amanda',
        description: 'Tabungan rutin bulanan Juli',
        notes: 'Disisihkan gajian Juli',
        createdAt: 1722150000000,
      },
      {
        id: 'tx-exp-1',
        type: 'expense',
        amount: 15000000,
        date: '2026-08-15',
        partnerId: 'joint',
        categoryId: 'cat-venue-catering',
        categoryName: 'Gedung & Katering (450 Porsi)',
        vendorName: 'Graha Mahardika Ballroom',
        paymentStatus: 'dp',
        description: 'DP 30% Booking Gedung Graha Mahardika',
        notes: 'Kuitansi No. GM/2026/08/112, sisa pelunasan H-30',
        createdAt: 1723700000000,
      },
      {
        id: 'tx-dep-5',
        type: 'deposit',
        amount: 12500000,
        date: '2026-08-28',
        partnerId: 'partner1',
        pocketSource: 'BCA Rizky',
        description: 'Tabungan rutin Agustus + lembur',
        notes: 'Alhamdulillah rezeki lemburan',
        createdAt: 1724830000000,
      },
      {
        id: 'tx-dep-6',
        type: 'deposit',
        amount: 12500000,
        date: '2026-09-02',
        partnerId: 'partner2',
        pocketSource: 'Mandiri Amanda',
        description: 'Tabungan rutin Agustus + hasil jualan preloved',
        notes: 'Semangat menuju target 50%!',
        createdAt: 1725260000000,
      },
      {
        id: 'tx-exp-2',
        type: 'expense',
        amount: 10000000,
        date: '2026-09-12',
        partnerId: 'joint',
        categoryId: 'cat-venue-catering',
        categoryName: 'Gedung & Katering (450 Porsi)',
        vendorName: 'Dapur Lestari Catering',
        paymentStatus: 'dp',
        description: 'DP Katering 450 Porsi (Menu A Platinum)',
        notes: 'Termasuk food test 6 pax gratis di kantor vendor',
        createdAt: 1726120000000,
      },
      {
        id: 'tx-exp-3',
        type: 'expense',
        amount: 5000000,
        date: '2026-09-22',
        partnerId: 'joint',
        categoryId: 'cat-dekorasi',
        categoryName: 'Dekorasi & Pelaminan Modern Rustic',
        vendorName: 'Seruni Wedding Decor',
        paymentStatus: 'dp',
        description: 'DP Booking Dekorasi & Pelaminan 10 Meter',
        notes: 'Tema Modern Minimalist Warm Champagne',
        createdAt: 1726980000000,
      },
      {
        id: 'tx-dep-7',
        type: 'deposit',
        amount: 7500000,
        date: '2026-10-05',
        partnerId: 'partner1',
        pocketSource: 'BCA Rizky',
        description: 'Tabungan Oktober (Tahap 1)',
        notes: 'Menuju milestone 75%!',
        createdAt: 1728110000000,
      },
      {
        id: 'tx-dep-8',
        type: 'deposit',
        amount: 7500000,
        date: '2026-10-10',
        partnerId: 'partner2',
        pocketSource: 'Mandiri Amanda',
        description: 'Tabungan Oktober (Tahap 1)',
        notes: 'Tercatat di kantong bersama',
        createdAt: 1728540000000,
      },
    ],
    notifications: [
      {
        id: 'notif-1',
        title: 'Milestone 50% Terbuka! 🎉',
        message: 'Selamat Rizky & Amanda! Total tabungan telah melampaui Rp 60.000.000. Setengah jalan menuju pelaminan impian!',
        date: '2026-09-30 19:40',
        type: 'milestone',
        read: false,
        milestoneId: 'mile-50',
        amount: 60000000,
      },
      {
        id: 'notif-2',
        title: 'Setoran Baru dari Amanda (Rp 7.500.000) 💰',
        message: 'Amanda baru saja menyetorkan tabungan Oktober. Saldo kas bersama makin kokoh!',
        date: '2026-10-10 14:15',
        type: 'deposit',
        read: false,
        amount: 7500000,
      },
      {
        id: 'notif-3',
        title: 'Pengeluaran Dicatat: DP Dekorasi (Rp 5.000.000) 💐',
        message: 'Seruni Wedding Decor telah menerima DP Rp 5.000.000 dari kas bersama.',
        date: '2026-09-22 11:00',
        type: 'expense',
        read: true,
        amount: 5000000,
      },
      {
        id: 'notif-4',
        title: 'Milestone 25% Terlampaui! 🏛️',
        message: 'Dana Rp 30.000.000 telah terkumpul. Tanggal dan gedung resmi di-booking!',
        date: '2026-08-20 16:30',
        type: 'milestone',
        read: true,
        milestoneId: 'mile-25',
        amount: 30000000,
      },
    ],
    loveNotes: [
      {
        id: 'note-1',
        authorId: 'partner1',
        message: 'Setiap rupiah yang kita sisihkan terasa ringan karena tujuannya adalah membangun masa depan bersamamu. Semangat terus sayang! ❤️',
        date: '2026-10-01',
        sticker: '💍',
      },
      {
        id: 'note-2',
        authorId: 'partner2',
        message: 'Terima kasih udah selalu konsisten dan transparan. Nggak sabar jalan berdampingan di hari H nanti 🌸👰🤵',
        date: '2026-10-06',
        sticker: '🕊️',
      },
    ],
    chatMessages: [
      {
        id: 'chat-1',
        senderId: 'partner1',
        senderName: 'Rizky Pratama',
        text: 'Bismillah sayang, hari ini aku baru setor tabungan gajian Rp 7.500.000 ke kantong bersama kita! 🥳💍',
        timestamp: Date.now() - 1000 * 60 * 60 * 26,
        sticker: '💰',
        reaction: '❤️',
        type: 'transfer_alert',
        highlightAmount: 7500000,
      },
      {
        id: 'chat-2',
        senderId: 'partner2',
        senderName: 'Amanda Putri',
        text: 'Alhamdulillah makasih mas Rizky! Aku juga udah imbangi setor Rp 7.500.000 dari rekening Mandiri tadi siang 💖',
        timestamp: Date.now() - 1000 * 60 * 60 * 20,
        sticker: '✨',
        reaction: '🥰',
        type: 'transfer_alert',
        highlightAmount: 7500000,
      },
      {
        id: 'chat-3',
        senderId: 'system',
        senderName: 'Sistem NikahPlan',
        text: '🎉 REKOR BARU: Total tabungan bersama mencapai Rp 77.500.000 (64.6% dari target impian Rp 120.000.000)! Tinggal sedikit lagi menuju Milestone 75%!',
        timestamp: Date.now() - 1000 * 60 * 60 * 18,
        type: 'savings_milestone',
      },
      {
        id: 'chat-4',
        senderId: 'partner1',
        senderName: 'Rizky Pratama',
        text: 'Wah keren banget kita! Nanti malam kita food test katering ya, kata vendornya dapet bonus dessert stall kalau deal minggu ini 🥗🍰',
        timestamp: Date.now() - 1000 * 60 * 60 * 4,
        sticker: '😋',
        reaction: '🔥',
        type: 'text',
      },
      {
        id: 'chat-5',
        senderId: 'partner2',
        senderName: 'Amanda Putri',
        text: 'Siap sayangku! Aku juga setuju tantangan hemat minggu ini: bawa bekal ke kantor biar akhir bulan bisa nabung ekstra Rp 1 Juta! 🍱💪',
        timestamp: Date.now() - 1000 * 60 * 30,
        sticker: '🍱',
        reaction: '💯',
        type: 'pledge',
      },
    ],
    updatedAt: Date.now(),
  };
}

// SSE Clients Registry: roomId -> Set<Response>
const sseClients = new Map<string, Set<Response>>();

function broadcastRoomUpdate(roomId: string, data: RoomData, senderClientId?: string) {
  const clients = sseClients.get(roomId);
  if (!clients || clients.size === 0) return;

  const payload = JSON.stringify({
    type: 'ROOM_UPDATE',
    roomId,
    data,
    senderClientId,
    timestamp: Date.now(),
  });

  for (const client of clients) {
    try {
      client.write(`data: ${payload}\n\n`);
    } catch {
      clients.delete(client);
    }
  }
}

async function startServer() {
  const app = express();

  // Basic CORS & JSON body parser
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-client-id');
    if (req.method === 'OPTIONS') return res.sendStatus(200);
    next();
  });

  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // Helper to get or create room
  function getOrCreateRoom(roomId: string): RoomData {
    const cleanId = roomId.trim().toLowerCase() || 'default-couple';
    if (!rooms.has(cleanId)) {
      const initial = generateDefaultRoomData();
      rooms.set(cleanId, initial);
      saveStoreToDisk();
      console.log(`[Room] Initialized new room: ${cleanId}`);
    }
    return rooms.get(cleanId)!;
  }

  // --- API Endpoints ---

  // 1. GET /api/wedding/:roomId -> Fetch current room state
  app.get('/api/wedding/:roomId', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const room = getOrCreateRoom(roomId);
    res.json({
      success: true,
      roomId,
      data: room,
    });
  });

  // 2. POST /api/wedding/:roomId -> Full or partial sync update & broadcast
  app.post('/api/wedding/:roomId', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const room = getOrCreateRoom(roomId);
    const senderClientId = (req.headers['x-client-id'] as string) || req.body.senderClientId;

    const {
      coupleInfo,
      categories,
      transactions,
      milestones,
      notifications,
      loveNotes,
      chatMessages,
    } = req.body;

    if (coupleInfo) room.coupleInfo = coupleInfo;
    if (Array.isArray(categories)) room.categories = categories;
    if (Array.isArray(transactions)) room.transactions = transactions;
    if (Array.isArray(milestones)) room.milestones = milestones;
    if (Array.isArray(notifications)) room.notifications = notifications;
    if (Array.isArray(loveNotes)) room.loveNotes = loveNotes;
    if (Array.isArray(chatMessages)) room.chatMessages = chatMessages;

    room.updatedAt = Date.now();
    rooms.set(roomId, room);
    saveStoreToDisk();

    // Broadcast in real-time to all other devices/tabs in this room
    broadcastRoomUpdate(roomId, room, senderClientId);

    res.json({
      success: true,
      roomId,
      updatedAt: room.updatedAt,
    });
  });

  // 2b. POST /api/wedding/:roomId/chat -> Fast Real-Time Chat Message endpoint
  app.post('/api/wedding/:roomId/chat', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const room = getOrCreateRoom(roomId);
    const senderClientId = (req.headers['x-client-id'] as string) || req.body.senderClientId;
    const message = req.body.message;

    if (!message || !message.id) {
      return res.status(400).json({ error: 'Invalid message payload' });
    }

    if (!Array.isArray(room.chatMessages)) {
      room.chatMessages = [];
    }

    // Append to message list
    room.chatMessages.push(message);
    room.updatedAt = Date.now();
    rooms.set(roomId, room);
    saveStoreToDisk();

    // Instantly broadcast to all connected clients in this room
    const clients = sseClients.get(roomId);
    if (clients) {
      const payload = JSON.stringify({
        type: 'NEW_CHAT_MESSAGE',
        roomId,
        message,
        senderClientId,
        timestamp: Date.now(),
      });
      for (const client of clients) {
        try {
          client.write(`data: ${payload}\n\n`);
        } catch {
          clients.delete(client);
        }
      }
    }

    res.json({
      success: true,
      messageId: message.id,
      timestamp: message.timestamp,
    });
  });

  // 2c. POST /api/wedding/:roomId/typing -> Broadcast typing status
  app.post('/api/wedding/:roomId/typing', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const senderClientId = (req.headers['x-client-id'] as string) || req.body.senderClientId;
    const { senderName, isTyping } = req.body;

    const clients = sseClients.get(roomId);
    if (clients) {
      const payload = JSON.stringify({
        type: 'TYPING_STATUS',
        roomId,
        senderName,
        isTyping,
        senderClientId,
      });
      for (const client of clients) {
        try {
          client.write(`data: ${payload}\n\n`);
        } catch {
          clients.delete(client);
        }
      }
    }

    res.json({ success: true });
  });

  // 3. POST /api/wedding/:roomId/reset -> Reset room to sample data
  app.post('/api/wedding/:roomId/reset', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const fresh = generateDefaultRoomData();
    rooms.set(roomId, fresh);
    saveStoreToDisk();

    const senderClientId = req.headers['x-client-id'] as string;
    broadcastRoomUpdate(roomId, fresh, senderClientId);

    res.json({
      success: true,
      message: 'Room reset to default',
      data: fresh,
    });
  });

  // 4. GET /api/wedding/:roomId/events -> Server-Sent Events (SSE) Real-Time Stream
  app.get('/api/wedding/:roomId/events', (req: Request, res: Response) => {
    const roomId = req.params.roomId;
    const room = getOrCreateRoom(roomId);

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); // For nginx / reverse proxy
    res.flushHeaders?.();

    if (!sseClients.has(roomId)) {
      sseClients.set(roomId, new Set());
    }
    const clientSet = sseClients.get(roomId)!;
    clientSet.add(res);

    console.log(`[SSE] Client connected to room "${roomId}". Total clients: ${clientSet.size}`);

    // Send initial snapshot immediately
    res.write(`data: ${JSON.stringify({ type: 'CONNECTED', roomId, data: room, timestamp: Date.now() })}\n\n`);

    // Keepalive ping every 15s to prevent cloud proxy timeout
    const keepalive = setInterval(() => {
      try {
        res.write(`: ping\n\n`);
      } catch {
        clearInterval(keepalive);
      }
    }, 15000);

    req.on('close', () => {
      clearInterval(keepalive);
      clientSet.delete(res);
      console.log(`[SSE] Client disconnected from room "${roomId}". Remaining: ${clientSet.size}`);
    });
  });

  // --- Vite Dev or Production Static Handler ---
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NikahPlan Realtime Server] listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
