import React, { useEffect,useCallback } from "react";
import type { RoomId } from "../api/type"
import { SEAT_BUTTON_BY_AREA } from "../constans/seats";
import useRoomStore from "../stores/useRoomStore";
import axiosInstance from "../api/axiosInstance";
import useSeatStore,{Seat} from "../stores/useSeatStore";

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


const SeatButtons: React.FC<SeatButtonsProps> = ({ roomId: roomId, onReserve }) => {
  const {selectedRoomId, setSeatsInRoom} = useRoomStore();
  const {seats, setSeats, setLoading} = useSeatStore();

  const seatsButtons = SEAT_BUTTON_BY_AREA[roomId] ?? [];
  if (!seatsButtons.length) return null;

    async function fetchSeatData() {
    try {
      const seatListRes = await axiosInstance.get(`/reading-rooms/${selectedRoomId}/seats`);
      const seatList: SeatList[] = seatListRes.data;
       
      const statusRes = await axiosInstance.get(`/reading-rooms/${selectedRoomId}/status`);
      const statusList: SeatStatus[] = statusRes.data;

const combined: Seat[] = seatList.map((seat: any) => {
  const status = statusList.find((s: any) => s.seatId === seat.id);
  return {
    id: seat.id,
    number: seat.number,
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
  },[selectedRoomId]);


  // 컴포넌트 마운트 시 초기 데이터 로드
  useEffect(() => {
    fetchSeatData();
  }, [selectedRoomId]);

return (
  <g>
    {seatsButtons.map((button) => {
      // API 데이터에서 해당 좌석의 실시간 상태 찾기
      const seatStatus = seats.find(seat => seat.number === button.seatId);
      const isAvailable = seatStatus?.available ?? true;
      
      return (
        <g
          key={button.seatId}
          onClick={(e) => {
            e.stopPropagation();
            if (isAvailable) onReserve?.(button.seatId); // 사용가능할 때만 예약
          }}
          style={{ 
            cursor: isAvailable ? "pointer" : "not-allowed", 
          }}
          aria-label={`Seat ${button.label ?? button.seatId}`}
          role="button"
        >
          <rect 
            x={button.x} 
            y={button.y} 
            width={button.w} 
            height={button.h} 
            rx={2} 
            fill={isAvailable ? "rgba(70,193,29)" : "rgba(205,0,0)"} // 상태에 따른 색상
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
);};

export default SeatButtons;