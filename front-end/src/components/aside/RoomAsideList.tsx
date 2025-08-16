import useRoomStore from "../../stores/useRoomStore";
import { useEffect } from "react";
import { fetchRooms } from "../../api/rooms";

const RoomAsideList = () => {
  const { rooms, selectedCategory , setRooms} = useRoomStore();

  const filtered = selectedCategory
    ? rooms.filter((room) => room.categoryType === selectedCategory)
    : [];

     useEffect(() => {
    if (rooms.length === 0) {
      fetchRooms()
        .then((data) => {
          setRooms(data);
          console.log("방 목록 로드됨:", data);
        })
        .catch((err) => {
          console.error("방 목록 로드 실패", err);
        });
    }
  }, []);

    const roomsByFloor = filtered.reduce((acc: Record<number, typeof filtered>, room) => {
    if (!acc[room.floor]) acc[room.floor] = [];
    acc[room.floor].push(room);
    return acc;
  }, {});


  //     useEffect(() => {
  //   console.log("rooms 상태:", rooms);
  // }, [rooms]);

  // useEffect(() => {
  //   console.log("선택된 카테고리:", selectedCategory);
  // }, [selectedCategory]);
  return (
    <aside >
      {filtered.length === 0 && <p>해당 카테고리의 방이 없습니다.</p>}
{Object.entries(roomsByFloor)
        .sort(([a], [b]) => Number(a) - Number(b)) // 층 순 정렬
        .map(([floor, rooms]) => (
          <div key={floor} className="mb-4">
            <h4 className="font-semibold mb-1">{floor}층</h4>
            <ul className="space-y-1">
              {rooms.map((room) => (
                <li key={room.id} className="ml-2 text-sm">
                  <span>{room.name}</span><br />
                  <span className="text-xs">
                    좌석: {room.availableSeats}/{room.totalSeats}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
    </aside>
  );
};

export default RoomAsideList;
