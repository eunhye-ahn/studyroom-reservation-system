import { useEffect, useState } from 'react';
import webSocketService, { SeatStatusMessage, AdminNotification, SeatStatus, MessageType } from '../services/WebSocketService';
import useRoomStore from '../store/useRoomStore';
import axiosInstance from '../api/axiosInstance';
import { SeatList, SeatStatusInfo } from '../components/SeatButton';

export const useSeatWebSocket = (userId: number, seatId?: number) => {
  const [connected, setConnected] = useState(false);
  const [seats, setSeats] = useState<SeatStatusMessage[]>([]);
  const {
    selectedRoomId
  } = useRoomStore();
  const [forceReturnNotification, setForceReturnNotification] = useState<AdminNotification | null>(null);


  useEffect(() => {

    async function fetchSeatData() {
      try {
        const seatListRes = await axiosInstance.get(`/reading-rooms/${selectedRoomId}/seats`);
        const seatList: SeatList[] = seatListRes.data;

        const statusRes = await axiosInstance.get(`/reading-rooms/${selectedRoomId}/status`);
        const statusList: SeatStatusInfo[] = statusRes.data;

        const initialSeats: SeatStatusMessage[] = seatList.map((seat: any) => {
          const statusInfo = statusList.find(s => s.seatId === seat.id);
          return {
            seatId: seat.id,
            number: seat.number,
            status: (statusInfo?.available ? 'AVAILABLE' : 'OCCUPIED') as SeatStatus,
            userId: userId || null,
            timestamp: new Date().toISOString(),
            type: 'SEAT_STATUS' as MessageType
          };
        })
          .filter((s) => s.status === 'OCCUPIED');
        setSeats(initialSeats);

        // WebSocket 연결
        webSocketService.connect(userId, selectedRoomId);
        setConnected(true);

      } catch (error) {
        alert("좌석조회 안됨");
        console.error("좌석조회 안됨", error);
      }
    }

    fetchSeatData();

    // 좌석 상태 업데이트 구독
    const unsubscribe = webSocketService.subscribeToMessages((message: SeatStatusMessage) => {
      console.log('Received seat update:', message);

      // 좌석 목록 업데이트
      setSeats(prevSeats => {
        const existingIndex = prevSeats.findIndex(s => s.seatId === message.seatId);

        //사용가능으로바뀌엇따면?
        if (message.status === 'AVAILABLE') {
          if (existingIndex >= 0) {
            return prevSeats.filter(s => s.seatId !== message.seatId);
          }
          return prevSeats;
        }

        //사용불가로 바뀌면
        if (message.status === 'OCCUPIED') {
          if (existingIndex) {
            const updated = [...prevSeats];
            updated[existingIndex] = message;
            return updated;
          } else {
            return [...prevSeats, message];
          }
        }

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
      if (unsubscribeForceReturn) {
        unsubscribeForceReturn();
      }
      // webSocketService.disconnect();
      // setConnected(false);
    };
  }, [userId, selectedRoomId, seatId]);

  return { connected, seats };
};