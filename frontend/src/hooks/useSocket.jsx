import { useEffect, useRef, useCallback, useState } from 'react';
import useAuthStore from '../store/authStore';
import useScheduleStore from '../store/scheduleStore';
import { getAccessToken } from '../api/axiosClient';

/**
 * ============================================================
 * useSocket — Socket.IO Client Hook với Graceful Fallback
 * ============================================================
 * Connect đến backend Socket.IO server để nhận real-time updates.
 *
 * Graceful fallback:
 * - Thử import socket.io-client động
 * - Nếu server không hỗ trợ WebSocket → tự động thử long-polling
 * - Nếu vẫn không connect được sau CONNECTION_TIMEOUT → fallback to polling
 * - Kết nối tự động ngắt khi user logout
 *
 * Events được lắng nghe:
 *   match:update   → invalidate cache lịch mùa giải
 *   match:score    → cập nhật tỉ số trực tiếp trong cache
 *   season:update  → force refresh season
 *
 * @param {{ enabled?: boolean, seasonId?: number }} options
 * @returns {{ isConnected: boolean, connectionMode: 'socket'|'polling'|'disconnected' }}
 *
 * @example
 * const { isConnected } = useSocket({ seasonId: selectedSeasonId });
 * ============================================================
 */

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL
  || (import.meta.env.VITE_API_URL?.replace('/api/v1', ''))
  || 'http://localhost:3000';

const CONNECTION_TIMEOUT = 5000;   // 5 giây để thử kết nối
const FALLBACK_POLL_INTERVAL = 30000; // 30 giây polling fallback

// Singleton socket instance — chia sẻ giữa tất cả component
let _globalSocket = null;
let _listenerCount = 0;

export function useSocket({ enabled = true, seasonId = null } = {}) {
  const { isAuthenticated } = useAuthStore();
  const { invalidateSeason, fetchBySeason } = useScheduleStore();
  const socketRef      = useRef(null);
  const pollingRef     = useRef(null);
  const connectionTRef = useRef(null);
  const [isConnected, setIsConnected]     = useState(false);
  const [connectionMode, setConnectionMode] = useState('disconnected');

  // ── Polling fallback ──────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    setConnectionMode('polling');
    pollingRef.current = setInterval(() => {
      if (seasonId) fetchBySeason(seasonId, { force: true });
    }, FALLBACK_POLL_INTERVAL);
  }, [seasonId, fetchBySeason]);

  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  // ── Socket event handlers ─────────────────────────────────
  const onMatchUpdate = useCallback((data) => {
    const sid = data?.season_id ?? data?.seasonId;
    if (sid) { invalidateSeason(sid); fetchBySeason(sid, { force: true }); }
  }, [invalidateSeason, fetchBySeason]);

  const onSeasonUpdate = useCallback((data) => {
    const sid = data?.season_id ?? data?.seasonId;
    if (sid) invalidateSeason(sid);
  }, [invalidateSeason]);

  // ── Main connect effect ───────────────────────────────────
  useEffect(() => {
    if (!enabled || !isAuthenticated) {
      stopPolling();
      setConnectionMode('disconnected');
      setIsConnected(false);
      return;
    }

    let cancelled = false;

    async function connect() {
      try {
        // Lazy import socket.io-client
        const { io } = await import('socket.io-client');

        if (cancelled) return;

        // Reuse existing connected socket
        if (_globalSocket?.connected) {
          socketRef.current = _globalSocket;
          _listenerCount++;
          setIsConnected(true);
          setConnectionMode('socket');
          stopPolling();
          return;
        }

        // Disconnect stale socket
        if (_globalSocket) {
          _globalSocket.disconnect();
          _globalSocket = null;
        }

        const token = getAccessToken() || '';
        const socket = io(SOCKET_URL, {
          auth: { token },
          transports: ['websocket', 'polling'],
          reconnectionAttempts: 3,
          reconnectionDelay: 2000,
          timeout: CONNECTION_TIMEOUT,
          forceNew: false,
        });

        _globalSocket = socket;
        socketRef.current = socket;
        _listenerCount++;

        socket.on('connect', () => {
          if (cancelled) return;
          setIsConnected(true);
          setConnectionMode('socket');
          stopPolling();
          if (connectionTRef.current) {
            clearTimeout(connectionTRef.current);
            connectionTRef.current = null;
          }
        });

        socket.on('disconnect', (reason) => {
          if (cancelled) return;
          setIsConnected(false);
          if (reason !== 'io server disconnect') startPolling();
          else setConnectionMode('disconnected');
        });

        socket.on('connect_error', () => {
          // silent — timeout fallback handles this
        });

        socket.on('match:update', onMatchUpdate);
        socket.on('match:score',  onMatchUpdate);
        socket.on('season:update', onSeasonUpdate);

        // Fallback timeout
        connectionTRef.current = setTimeout(() => {
          if (!socket.connected && !cancelled) {
            startPolling();
          }
        }, CONNECTION_TIMEOUT);

      } catch {
        // socket.io-client not available or import failed
        if (!cancelled) startPolling();
      }
    }

    connect();

    return () => {
      cancelled = true;
      if (connectionTRef.current) {
        clearTimeout(connectionTRef.current);
        connectionTRef.current = null;
      }

      const socket = socketRef.current;
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('connect_error');
        socket.off('match:update', onMatchUpdate);
        socket.off('match:score',  onMatchUpdate);
        socket.off('season:update', onSeasonUpdate);

        _listenerCount = Math.max(0, _listenerCount - 1);
        if (_listenerCount === 0) {
          socket.disconnect();
          _globalSocket = null;
        }
        socketRef.current = null;
      }

      stopPolling();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isAuthenticated]);

  return { isConnected, connectionMode };
}

