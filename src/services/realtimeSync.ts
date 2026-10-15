/**
 * Real-time Room Sync service using Server-Sent Events (SSE) and REST persistence
 */

export interface SyncState {
  roomId: string;
  status: 'connected' | 'connecting' | 'reconnecting' | 'offline';
  lastSyncedAt: number | null;
}

// Generate unique client session identifier to avoid echo jitter
export const CLIENT_ID = typeof window !== 'undefined'
  ? sessionStorage.getItem('nikahplan_client_id') || (() => {
      const id = 'client_' + Math.random().toString(36).substring(2, 9);
      sessionStorage.setItem('nikahplan_client_id', id);
      return id;
    })()
  : 'server_client';

export function getInitialRoomId(): string {
  if (typeof window === 'undefined') return 'nikah-rizky-amanda';
  
  // 1. Check URL query params: ?room=... or ?code=...
  const urlParams = new URLSearchParams(window.location.search);
  const fromUrl = urlParams.get('room') || urlParams.get('code');
  if (fromUrl && fromUrl.trim()) {
    const clean = fromUrl.trim().toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    localStorage.setItem('nikahplan_active_room', clean);
    return clean;
  }

  // 2. Check localStorage
  const stored = localStorage.getItem('nikahplan_active_room');
  if (stored && stored.trim()) {
    return stored.trim();
  }

  return 'nikah-rizky-amanda';
}

export function buildShareableRoomUrl(roomId: string): string {
  if (typeof window === 'undefined') return '';
  const url = new URL(window.location.href);
  url.searchParams.set('room', roomId);
  return url.toString();
}

/**
 * Pushes updated wedding data to server for the room, broadcasting to other connected partners
 */
export async function pushRoomDataToServer(roomId: string, data: any): Promise<boolean> {
  try {
    const res = await fetch(`/api/wedding/${encodeURIComponent(roomId)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-id': CLIENT_ID,
      },
      body: JSON.stringify({
        ...data,
        senderClientId: CLIENT_ID,
      }),
    });
    return res.ok;
  } catch (err) {
    console.warn('[Sync] Failed to push data to server:', err);
    return false;
  }
}

/**
 * Fetches current snapshot from server for the room
 */
export async function fetchRoomDataFromServer(roomId: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/wedding/${encodeURIComponent(roomId)}`, {
      headers: {
        'x-client-id': CLIENT_ID,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[Sync] Failed to fetch data from server:', err);
    return null;
  }
}

/**
 * Resets the room to initial sample data
 */
export async function resetRoomOnServer(roomId: string): Promise<any | null> {
  try {
    const res = await fetch(`/api/wedding/${encodeURIComponent(roomId)}/reset`, {
      method: 'POST',
      headers: {
        'x-client-id': CLIENT_ID,
      },
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch (err) {
    console.warn('[Sync] Failed to reset room on server:', err);
    return null;
  }
}
