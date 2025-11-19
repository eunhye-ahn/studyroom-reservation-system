import React, { useEffect } from "react";
import type { RoomId } from "../types/type"
import { SEAT_BUTTON_BY_AREA } from "./constans/seats";
import useRoomStore from "../store/useRoomStore";
import axiosInstance from "../api/axiosInstance";
import useSeatStore,{Seat} from "../store/useSeatStore";
import useUserStore from "../store/useUserStore";
import { useSeatWebSocket } from "../hooks/useSeatWebSocket";
import {useParams} from "react-router-dom";

import webSocketService, { 
  SeatStatusMessage, 
  SeatStatus as WSSeatStatus 
} from "../services/WebSocketService";
import useNotification from "../hooks/useNotification";

interface SeatButtonsProps {
  roomId: RoomId;
  onReserve?: (seatId: number) => void;
}

interface SeatList {
  id: number;
  number: number;
  readingRoomName: string;
}

interface SeatStatus {
  seatId: number;
  available: boolean;
}

const SeatButtons: React.FC<SeatButtonsProps> = ({roomId, onReserve }) => {
  const {seats, setSeats, setLoading, selectedSeat} = useSeatStore(); 
  const {user} = useUserStore();

  const userId = user?.id || null;
  const numericRoomId = Number(roomId);

  // useNotification(selectedSeat?.id || null);
  const seatsButtons = SEAT_BUTTON_BY_AREA[numericRoomId as RoomId] ?? [];
  if (!seatsButtons.length) return null;

  async function fetchSeatData() {
    try {
      const seatListRes = await axiosInstance.get(`/reading-rooms/${numericRoomId}/seats`);
      const seatList: SeatList[] = seatListRes.data;
       
      const statusRes = await axiosInstance.get(`/reading-rooms/${numericRoomId}/status`);
      const statusList: SeatStatus[] = statusRes.data;

      const combined: Seat[] = seatList.map((seat: any) => {
        const status = statusList.find(s => s.seatId === seat.id);
        return {
          id: seat.id,
          number: seat.number,
          roomId: numericRoomId,
          readingRoomName: seat.readingRoomName,
          available: status ? status.available : true,
        };
      });
      
      setSeats(combined);
    } catch (error) {
      alert("좌석조회 안됨");
      console.error("좌석조회 안됨", error);
    }
  }

  useEffect(() => {
    fetchSeatData();
  }, [numericRoomId]);

  // 웹소켓 좌석현황 실시간 업데이트
  useEffect(() => {
    console.log(`🔌 WebSocket 연결 시도: 열람실 ${numericRoomId}`);
    
    // WebSocket 연결
    webSocketService.connect(userId, numericRoomId);

    // 좌석 상태 변경 구독 : 메시지받으면 실행될 콜백함수 등록
    const unsubscribe = webSocketService.subscribeToMessages((message: SeatStatusMessage) => {
      // 좌석 상태 업데이트
      setSeats((prevSeats: Seat[]) => {
        const updatedSeats = prevSeats.map((seat: Seat) => {
          if (seat.id === message.seatId) {
            return {
              ...seat,
              available: message.status === WSSeatStatus.AVAILABLE
            };
          }
          return seat;
        });
        return updatedSeats;
      });
      
      const currentRoom = useRoomStore.getState().rooms.find(
        r => r.id === numericRoomId
      );

    if(currentRoom){
      const seats = useSeatStore.getState().seats;
      const availableCount = seats.filter(  // 오타 수정: avaialbaleCount → availableCount
        s => s.available === true
    ).length;

    useRoomStore.getState().updateRoomSeats(
      numericRoomId,  // selectedRoomId → numericRoomId
      availableCount
    );
  }
});

    // Cleanup : 컴포넌트 언마운트 시 연결해제
    return () => {
        unsubscribe();
        webSocketService.disconnect();
    };
  }, [numericRoomId, userId, setSeats]);

  const handleSeatClick = async (button: any) => {
    // zustand store에서 관리하는 seats배열에서의 number와 버튼의 라벨이 같다면?
    const seat = seats.find(s => s.roomId === numericRoomId && s.number === Number(button.label));

    console.log('🖱️ 좌석 클릭:', button.seatId);

    if (!seat) {
      console.error('❌ 좌석을 찾을 수 없음:', button.label);
      return;
    }

    // 🟢 예약 가능한 좌석 (초록색) - 예약하기
    if (seat.available) {
      console.log('▶️ 좌석 예약 시도:', seat.id, seat.number);
      try {
        // REST API로 예약 (백엔드 DB 업데이트)
        const response = await axiosInstance.post('/reservation', { 
          seatId: seat.id, 
          readingRoomId: numericRoomId 
        });
        
        console.log('✅ 예약 성공:', response.data);
        alert(`좌석 ${seat.number} 예약 완료!`);
        onReserve?.(seat.id);
        
      } catch (error: any) {
        console.error('❌ 예약 실패:', error);
        
        // 백엔드 에러 메시지 구분
        if (error.response) {
          const status = error.response.status;
          const message = error.response.data?.message || error.response.data;
          
          if (status === 409 || message.includes('중복') || message.includes('이미')) {
            alert("이미 예약된 좌석이거나 중복 예약입니다.");
          } else if (status === 403) {
            alert("예약 권한이 없습니다.");
          } else {
            alert(`예약 실패: ${message}`);
          }
        } else {
          alert("네트워크 오류가 발생했습니다.");
        }
      }
    } 
    // 🔴 예약 불가능한 좌석 (빨간색) - 반납하기
    else {
      console.log('⏹️ 좌석 반납 시도:', seat.id, seat.number);
      
      try {
        // REST API로 반납
        await axiosInstance.post(`/seats/${seat.id}/release`, { 
          userId 
        });
        
        // WebSocket으로 상태 변경 브로드캐스트
        webSocketService.releaseSeat(seat.id, seat.number);
        
        console.log('✅ 반납 성공 + WebSocket 전송');
        alert(`좌석 ${seat.number} 반납 완료!`);
        
      } catch (error: any) {
        console.error('❌ 반납 실패:', error);
        
        if (error.response) {
          const message = error.response.data?.message || error.response.data;
          alert(`반납 실패: ${message}`);
        } else {
          alert("반납 실패: 네트워크 오류");
        }
      }
    }
  }; 

  return (
    <g>
      {seatsButtons.map((button) => {
        const seat = seats.find(s => 
          s.roomId === numericRoomId && s.number === Number(button.label)
        );
        const isAvailable = seat?.available ?? true;
        
        return (
          <g
            key={button.label}
            onClick={(e) => {
              e.stopPropagation();
              handleSeatClick(button);
            }}
            style={{ 
              cursor: isAvailable ? "pointer" : "not-allowed", 
            }}
            aria-label={`Seat ${button.label}`}
            role="button"
          >
            <rect 
              x={button.x} 
              y={button.y} 
              width={button.w} 
              height={button.h} 
              rx={2} 
              fill={isAvailable ? "rgba(70,193,29)" : "rgba(205,0,0)"}
            />
            {button.label && (
              <text 
                x={button.x + button.w / 2} 
                y={button.y + button.h / 2 + 3} 
                fill="white" 
                fontSize={10} 
                textAnchor="middle"
              >
                {button.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};

export default SeatButtons;