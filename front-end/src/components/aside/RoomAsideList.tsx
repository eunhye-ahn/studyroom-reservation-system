import useRoomStore from "../../stores/useRoomStore";
import { useEffect, useMemo, useState } from "react";
import { fetchRooms, RoomInfo } from "../../api/rooms";
import { useNavigate } from "react-router-dom";

const RoomAsideList = () => {
  const { rooms, 
    selectedFloor, 
    selectedCategory, 
    setSelectedCategory,
    setRoomName,
    setMode
  } = useRoomStore();
    
  const navigate = useNavigate();

  const handleClickRoom = (roomId: number, roomName: string) => {
    setRoomName(roomName);
    setMode('room');
  }


  const filteredRooms = useMemo(() => {
    return rooms
      .filter((room) => room.floor === selectedFloor)
      .filter((room) => room.categoryType?.displayName === selectedCategory);
  }, [rooms, selectedFloor, selectedCategory])


  return (
    <aside>
      <div>
        <button onClick={() => setSelectedCategory("자료관")
        }
          // className="mt-8 mb-3 w-full h-11 bg-transparent hover:bg-[#3343F3] text-white px-3 py-1 rounded transition-colors border border-black"
        
          className={`mt-8 mb-3 w-full h-11 text-white rounded font-semibold text-2xl
            ${
              selectedCategory === "자료관"
              ? "bg-[#3343F3] border-0 "
              : "bg-transparent border-gray-500 rounded hover:bg-[#3343F3]"
            }`}        
        >
          자료관
        </button>

        {selectedCategory === "자료관" && (
          filteredRooms.length > 0 ? (
            <ul>
              {filteredRooms.map((room) => (
                <li key={room.id} className="text-white">
                  <div
                    onClick={() => handleClickRoom(room.id, room.name)}
                    className="cursor-pointer"
                  >{room.name}</div>
                  <div>
                    좌석: {room.availableSeats}/{room.totalSeats}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>자료관에 방이 없습니다.</p>
          )
        )}
      </div>
      <div>
        <button
          onClick={() => setSelectedCategory("학습관")}
          className={`mt-8 mb-3 w-full h-11 text-white rounded font-semibold text-2xl
            ${
              selectedCategory === "학습관"
              ? "bg-[#3343F3] border-0 "
              : "bg-transparent  border-gray-500 rounded hover:bg-[#3343F3]"
            }`}        
        >
          학습관
        </button>

        {selectedCategory === "학습관" && (
          filteredRooms.length > 0 ? (
            <ul>
              {filteredRooms.map((room) => (
                <li key={room.id} className="text-white">
                  <div
                  onClick={() => navigate(`/rooms/${room.id}`)}
                  >{room.name}</div>
                  <div>
                    좌석: {room.availableSeats}/{room.totalSeats}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>학습관에 방이 없습니다.</p>
          )
        )}
      </div>
    </aside>
  )
}

export default RoomAsideList;
