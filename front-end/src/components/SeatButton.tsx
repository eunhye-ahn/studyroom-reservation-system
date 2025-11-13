import React, { useEffect } from "react";
import type { RoomId } from "../api/type"
import { SEAT_BUTTON_BY_AREA } from "../constans/seats";
import useRoomStore from "../stores/useRoomStore";
import axiosInstance from "../api/axiosInstance";
import useSeatStore,{Seat} from "../stores/useSeatStore";
import useUserStore from "src/stores/useUserStore";
import { useSeatWebSocket } from "../hooks/useSeatWebSocket";
import {useParams} from "react-router-dom";

import webSocketService, { 
  SeatStatusMessage, 
  SeatStatus as WSSeatStatus 
} from "../services/WebSocketService";

interface SeatButtonsProps {
  roomId: RoomId;
  onReserve?: (seatId: number) => void;

};

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
  const {seats, setSeats, setLoading} = useSeatStore();

  const userId = 1;

  const numericRoomId = Number(roomId);


  const seatsButtons = SEAT_BUTTON_BY_AREA[numericRoomId as RoomId] ?? [];
  if (!seatsButtons.length) return null;

    async function fetchSeatData() {
    try {
      const seatListRes = await axiosInstance.get(`/reading-rooms/${numericRoomId}/seats`);
      const seatList: SeatList[] = seatListRes.data;
       
      const statusRes = await axiosInstance.get(`/reading-rooms/${numericRoomId}/status`);
      const statusList: SeatStatus[] = statusRes.data;

const combined: Seat[] = seatList.map((seat: any) => {
  //db에서 상태가져오기
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

  useEffect(()=>{
      fetchSeatData();
  },[numericRoomId]);


  // 컴포넌트 마운트 시 초기 데이터 로드
  // useEffect(() => {
  //   fetchSeatData();
  // }, [selectedRoomId]);

  //웹소켓 좌석현황 실시간 업데이트
useEffect(() => {

    console.log(`🔌 WebSocket 연결 시도: 열람실 ${numericRoomId}`);
    // WebSocket 연결
    webSocketService.connect(userId, numericRoomId);

    // 좌석 상태 변경 구독
    const unsubscribe = webSocketService.subscribeToMessages((message: SeatStatusMessage) => {
          console.log('📨 WebSocket 메시지 수신:', message);

          //좌석 상태 업데이트
      setSeats((prevSeats:Seat[]) => {
const updatedSeats = prevSeats.map((seat: Seat) => {
          if (seat.id === message.seatId) {
            console.log(`🔄 좌석 ${seat.number} 상태 변경: ${seat.available} → ${message.status === WSSeatStatus.AVAILABLE}`);
            return {
              ...seat,
              available: message.status === WSSeatStatus.AVAILABLE
            };
          }
          return seat;
        });
        return updatedSeats;
      });
    });
    // Cleanup : 컴포넌트 언마운트 시 연결해제
    return () => {
      console.log('🔌 WebSocket 연결 해제');
      unsubscribe();
      webSocketService.disconnect();
    };
  }, [numericRoomId, userId]); //roomId, userId 변경시 재연결

  const handleSeatClick = async (button: any) => {

    //zustand store에서 관리하는 seats배열에서의 number와 버튼의 라벨이 같다면?
  const seat = seats.find(s => s.roomId === numericRoomId && s.number === Number(button.label));


  
  console.log('🖱️ 좌석 클릭:', button.seatId);

  if (!seat) {
    console.error('❌ 좌석을 찾을 수 없음:', button.label);
    return;
  }

  if (seat.available) {
    console.log('▶️ 좌석 예약 시도:', seat.id, seat.number);
    try {

      
      // 1️⃣ REST API로 예약 (백엔드 DB 업데이트)
      const response = await axiosInstance.post('/reservation',{ seatId: seat.id, readingRoomId: numericRoomId});
      
      console.log('✅ 예약 성공:', response.data);
      onReserve?.(seat.id); 
      // << 이친구의 역할을 잘 모르겠어 웹소켓에 관여하지도않음
      
      // 2️⃣ WebSocket으로 상태 변경 브로드캐스트
      // webSocketService.startUsingSeat(seat.id, seat.number, userId);

    } catch (error) {
      console.error('❌ 예약 실패:', error);
      alert("예약실패")
    }
  } else {
    console.log('⏹️ 좌석 반납:', seat.id, seat.number);
    
    try {
      // 1️⃣ REST API로 반납
      await axiosInstance.post(`/seats/${seat.id}/release`, { 
        userId 
      });
      
      // 2️⃣ WebSocket으로 상태 변경 브로드캐스트
      webSocketService.releaseSeat(seat.id, seat.number);
      
      console.log('✅ 반납 성공 + WebSocket 전송');
    } catch (error) {
      console.error('❌ 반납 실패:', error);
      alert("반납실패");
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
              handleSeatClick(button); // 🔥 수정
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
              <text x={button.x + button.w / 2} y={button.y + button.h / 2 + 3} 
                    fill="white" fontSize={10} textAnchor="middle">
                {button.label}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
};export default SeatButtons;