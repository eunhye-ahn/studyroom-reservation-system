import useRoomStore from "../../stores/useRoomStore";
import { useEffect, useMemo, useState } from "react";
import { fetchRooms, RoomInfo, LABEL_TO_CODE } from "../../api/rooms";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";


const RoomAsideList = () => {
  const {
    mode,
    selectedFloor,
    selectedCategory,
    setSelectedCategory,
    setRoomName,
    setMode,
    openRoom,
    selectedRoomId,
  } = useRoomStore();

  const navigate = useNavigate();

  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "floor" || !selectedFloor) return;

    console.log("=== API 호출 시작 ===");
    console.log("selectedFloor:", selectedFloor);
    console.log("selectedCategory:", selectedCategory);


    const controller = new AbortController(); // axios v1: AbortController 지원
    setLoading(true);
    setErr(null);

    const categoryParam =
      selectedCategory
        ? (LABEL_TO_CODE[selectedCategory] ?? selectedCategory)
        : undefined;


    console.log("categoryParam:", categoryParam);
    console.log("API params:", { floor: Number(selectedFloor), category: categoryParam });

    api
      .get<RoomInfo[]>("/rooms", {
        params: { floor: Number(selectedFloor), category: categoryParam },
        signal: controller.signal,
      })
      .then((res) => {
        console.log("API 응답 성공:", res.data);
        console.log("응답 데이터 길이:", res.data.length);
        console.log("응답 데이터 내용:", res.data);
        setRooms(res.data);
      }
      )
      .catch((e) => {
        if (controller.signal.aborted) return;
        console.error("[rooms] API 호출 실패:", e);
        console.error("에러 응답:", e.response?.data);
        console.error("에러 상태:", e.response?.status);
        setErr("목록을 불러오지 못했어요.");
        setRooms([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [mode, selectedFloor, selectedCategory]);



  // 서버가 카테고리 필터를 처리하지만, 방어적으로 한 번 더 필터링
  const filteredRooms = useMemo(() => {

    console.log("=== 필터링 ===");
    console.log("전체 rooms:", rooms);
    console.log("selectedCategory:", selectedCategory);

    if (!selectedCategory) return rooms;

    let filtered = rooms;

    if (selectedCategory) {
      filtered = filtered.filter((r) => {
        const displayName = r.categoryType?.displayName;
        return displayName === selectedCategory;
      });
    }

    filtered = filtered.filter((r) => r.floor === selectedFloor);


    console.log("층 필터링 후:", filtered);
    return filtered;
  }, [rooms, selectedCategory, selectedFloor]);

  const handleClickRoom = (roomId: number, roomName: string) => {
    setRoomName(roomName);
    setMode("room");
    openRoom(roomId);
  };

  // if (mode !== "floor") return null;

  if (loading && rooms.length === 0) {
    return <aside className="p-3 text-sm text-gray-500">불러오는 중…</aside>;
  }
  if (err) {
    return <aside className="p-3 text-sm text-red-500">{err}</aside>;
  }

  return (
    <aside>
      <div>
        <button onClick={() => setSelectedCategory("자료관")
        }
          // className="mt-8 mb-3 w-full h-11 bg-transparent hover:bg-[#3343F3] text-white px-3 py-1 rounded transition-colors border border-black"

          className={`mt-8 mb-3 w-full h-11 text-white rounded font-semibold text-2xl
            ${selectedCategory === "자료관"
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
                <li key={room.id} className="text-white flex items-center justify-between pt-3 pb-3 gap-4">
                  <div
                    onClick={() => handleClickRoom(room.id, room.name)}
                    className="cursor-pointer"
                  >{room.name}</div>
                  <div className="w-52 h-6 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3343F3]  text-xs text-white flex items-center justify-center"
                      style={{
                        width: `${(room.availableSeats / room.totalSeats) * 100}%`,
                      }}>
                      {room.availableSeats}/{room.totalSeats}
                    </div>

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
            ${selectedCategory === "학습관"
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
                <li key={room.id} className="text-white  flex items-center justify-between pt-3 pb-3">
                  <div
                    onClick={() => handleClickRoom}
                  >{room.name}</div>
                  <div className="w-54 h-6 bg-[#3343F3] rounded-full overflow-hidden flex-shrink-0">
                    <div className="h-full bg-gray-200 text-xs text-white flex items-center justify-center"
                      style={{
                        width: `${(room.availableSeats / room.totalSeats) * 100}%`,
                      }}>
                      {room.availableSeats}/{room.totalSeats}
                    </div>

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
