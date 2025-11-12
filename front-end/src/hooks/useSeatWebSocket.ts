import { useEffect, useState } from 'react';
import webSocketService, { SeatStatusMessage } from '../services/WebSocketService';

export const useSeatWebSocket = (userId: number) => {
  const [connected, setConnected] = useState(false);
  const [seats, setSeats] = useState<SeatStatusMessage[]>([]);

  useEffect(() => {
    // WebSocket 연결
    webSocketService.connect(userId);
    setConnected(true);

    // 좌석 상태 업데이트 구독
    const unsubscribe = webSocketService.subscribeToMessages((message: SeatStatusMessage) => {
      console.log('Received seat update:', message);
      
      // 좌석 목록 업데이트
      setSeats(prevSeats => {
        const existingIndex = prevSeats.findIndex(s => s.seatId === message.seatId);
        
        if (existingIndex >= 0) {
          // 기존 좌석 업데이트
          const updated = [...prevSeats];
          updated[existingIndex] = message;
          return updated;
        } else {
          // 새 좌석 추가
          return [...prevSeats, message];
        }
      });
    });

    // Cleanup
    return () => {
      unsubscribe();
      webSocketService.disconnect();
      setConnected(false);
    };
  }, [userId]);

  return { connected, seats };
};