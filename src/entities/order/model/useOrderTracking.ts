import { useEffect, useState, useCallback, useRef } from 'react';
import { getWebSocketUrl } from '../../../shared/utils/wsUtils';

export interface OrderTrackingEvent {
  type: 'connection' | 'status_update' | 'error' | 'disconnect';
  status?: string;
  mensaje?: string;
  timestamp?: string;
}

interface UseOrderTrackingOptions {
  onStatusChange?: (newStatus: string) => void;
  onError?: (error: string) => void;
  enabled?: boolean;
}

export const useOrderTracking = (
  orderId: string | undefined,
  options: UseOrderTrackingOptions = {}
) => {
  const { onStatusChange, onError, enabled = true } = options;
  const [isConnected, setIsConnected] = useState(false);
  const [currentStatus, setCurrentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<number | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const connectRef = useRef<() => void>(() => {});
  const maxReconnectAttempts = 5;

  const mapStatusCodigo = (codigo: string): 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' => {
    const mapping: Record<string, 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'> = {
      PENDIENTE: 'pending',
      CONFIRMADO: 'confirmed',
      EN_PREP: 'confirmed',
      EN_PREPARACION: 'confirmed',
      EN_CAMINO: 'shipped',
      ENTREGADO: 'delivered',
      CANCELADO: 'cancelled',
    };
    return mapping[codigo] || 'pending';
  };

  const connect = useCallback(() => {
    if (!orderId || !enabled) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        console.warn('No auth token found, WebSocket connection skipped.');
        return;
      }

      const finalWsUrl = getWebSocketUrl(token);

      const ws = new WebSocket(finalWsUrl);

      ws.onopen = () => {
        console.log('WebSocket connected for order', orderId);
        setIsConnected(true);
        setError(null);
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('Order tracking event:', data);

          if (data.type === 'pedido_estado_update' && String(data.pedido_id) === String(orderId)) {
            const statusCode = data.estado_codigo;
            if (statusCode) {
              const mappedStatus = mapStatusCodigo(statusCode);
              setCurrentStatus(mappedStatus);
              onStatusChange?.(mappedStatus);
            }
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };

      ws.onerror = (event) => {
        console.error('WebSocket error:', event);
        const errorMsg = 'Error en la conexión de seguimiento';
        setError(errorMsg);
        onError?.(errorMsg);
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected for order', orderId);
        setIsConnected(false);
        wsRef.current = null;

        // Attempt reconnection
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current += 1;
          const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current - 1), 30000);
          console.log(`Attempting reconnection in ${delay}ms (attempt ${reconnectAttemptsRef.current})`);
          reconnectTimeoutRef.current = window.setTimeout(() => connectRef.current(), delay);
        }
      };

      wsRef.current = ws;
    } catch (err) {
      console.error('Error establishing WebSocket connection:', err);
      const errorMsg = err instanceof Error ? err.message : 'Error de conexión';
      setError(errorMsg);
      onError?.(errorMsg);
    }
  }, [orderId, enabled, onStatusChange, onError]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    if (orderId && enabled) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      connect();
    }

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [orderId, enabled, connect]);

  return {
    isConnected,
    currentStatus,
    error,
    reconnect: connect,
  };
};
