import { useEffect, useState } from 'react';
import webSocketService, { SeatStatusMessage, AdminNotification } from '../services/WebSocketService';
import useRoomStore from '../store/useRoomStore';


export const useSeatWebSocket = (userId: number, seatId?:number) => {
  const [connected, setConnected] = useState(false);
  const [seats, setSeats] = useState<SeatStatusMessage[]>([]);
  const {
    selectedRoomId
  } = useRoomStore();
  const [forceReturnNotification, setForceReturnNotification] = useState<AdminNotification | null>(null);


  useEffect(() => {
    // WebSocket 연결
    webSocketService.connect(userId, selectedRoomId);
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

    let unsubscribeForceReturn: (() => void) | undefined;
    
    if (seatId) {
      unsubscribeForceReturn = webSocketService.subscribeToSeatNotification(
        seatId,
        (notification) => {
          console.log('내 좌석 강제 반납됨:', notification);
          setForceReturnNotification(notification);
        }
      );
    }


    // Cleanup
    return () => {
      unsubscribe();
      webSocketService.disconnect();
      setConnected(false);
    };
  }, [userId]);

  return { connected, seats };
};