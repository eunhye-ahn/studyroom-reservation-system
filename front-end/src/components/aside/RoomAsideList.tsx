import useRoomStore from "../../stores/useRoomStore";
import { useEffect, useMemo, useState } from "react";
import { fetchRooms, RoomInfo } from "../../api/rooms";
import { useNavigate } from "react-router-dom";

const RoomAsideList = () => {
  const { rooms, selectedFloor, selectedCategory, setSelectedCategory } = useRoomStore();
    const navigate = useNavigate();


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
          className="mt-8 mb-3 w-full h-11 bg-transparent hover:bg-[#3343F3] text-white px-3 py-1 rounded transition-colors border border-black"
        >
          자료관
        </button>

        {selectedCategory === "자료관" && (
          filteredRooms.length > 0 ? (
            <ul>
              {filteredRooms.map((room) => (
                <li key={room.id}>
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
            <p>자료관에 방이 없습니다.</p>
          )
        )}
      </div>
      <div>
        <button
          onClick={() => setSelectedCategory("학습관")}
          className="mt-8 mb-3 w-full h-11 bg-transparent hover:bg-[#3343F3] text-white px-3 py-1 rounded transition-colors border border-black"

        >
          학습관
        </button>

        {selectedCategory === "학습관" && (
          filteredRooms.length > 0 ? (
            <ul>
              {filteredRooms.map((room) => (
                <li key={room.id}>
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
