import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomInfo } from "../api/rooms";
import type { FloorId, RoomId} from "../api/type";
import { LABEL_TO_CODE } from "../api/rooms";

export type Mode = 'floor' | 'room'


interface RoomStore {
    selectedFloor: FloorId;
    selectedCategory: string | null;
    selectedRoom: RoomInfo[] | null;
    
    selectedRoomId: RoomId | null;
    seatsInRoom: RoomInfo[]; //룸에 속한 seat 목록
    floorRooms: RoomInfo[]; //층에 속한 룸 목록 
    currentRoom: RoomInfo | null;
    roomName: string | null;
    mode: Mode;

    setRoomName: (name: string | null) => void;
    setSelectedFloor: (floor: number) => void;
    setSelectedCategory: (category: string) => void;

    //영역 단위 상태전환
    openRoom: (roomId: RoomId) => void;
    backToFloor: () => void;

    //영역 방/좌석 관련
    setSeatsInRoom: (rooms: RoomInfo[]) => void;
    setCurrentRoom: (room: RoomInfo | null) => void;
     setFloorRooms: (rooms: RoomInfo[]) => void;
    clearRoom: () => void;

    setMode: (m: Mode) => void;
}


const useRoomStore = create<RoomStore>()(
    persist(
        (set) => ({
            selectedFloor: 1 as FloorId,
            selectedCategory: '자료관',
            selectedRoom: [],
            currentRoom: null,
            roomName: null,
            mode: 'floor',
            selectedRoomId: null,
            seatsInRoom: [],
            floorRooms: [],

            setRoomName: (name) => set({ roomName: name }),
            setSelectedFloor: (floor) => {
                const v = Number(floor);
            set({
                selectedFloor: (Number.isFinite(v)? (v as FloorId):(1 as FloorId)),
                selectedRoomId: null,
                seatsInRoom: [],
                mode: 'floor',
            });
        },
            setSelectedCategory: (category) => set({ selectedCategory: category }),

            openRoom: (seatId) =>
                set({ selectedRoomId: seatId, seatsInRoom: [], mode: "room" }),
            backToFloor: () => set({ selectedRoomId: null, seatsInRoom: [], currentRoom: null, mode: "floor" }),

            setSeatsInRoom: (rooms) => set({ seatsInRoom: rooms }),
            setFloorRooms: (rooms) => set({ floorRooms: rooms }),
            setCurrentRoom: (room) => set({ currentRoom: room }),
            clearRoom: () => set({ currentRoom: null }),

            setMode: (mode) => set({ mode }),
        }),
        {
            name: 'room-store',
            version: 3,
            migrate: (state: any, version) => {
                if (!state) return state;
                if (version < 2) {
                    const raw = state.selectedCategory;
                    const code = typeof raw === 'string' ? LABEL_TO_CODE[raw] : undefined;
                    return { ...state, selectedCategory: code ?? null };
                }
                if (version < 3) {
                    const mode: Mode = state.mode === "room" ? "room" : state.mode ?? "floor";
                    const roomsInArea: RoomInfo[] = Array.isArray(state.selectedArea) ? state.selectedArea : [];


                    state = {
                        ...state,
                        selectedAreaId: state.selectedAreaId ?? null,
                        roomsInArea,
                        mode,
                    };

                }

                return state;
            }
        }

    )
);

export default useRoomStore;

// 결정적 이유:
// Zustand persist가 로컬스토리지에 저장된 예전 스냅샷(예: selectedCategory: "자료관")을 앱 시작 시 초기값보다 먼저 불러와서 상태를 덮어쓰고 있었어요. 그래서 코드에서 초기값을 바꿔도 매번 예전 값이 복원되었죠.

// 버전을 올리면 persist가 저장된 버전 ≠ 현재 버전을 감지하고, 우리가 넣은 migrate 로직을 실행합니다. 그 결과:

// 예전 저장값(라벨 "자료관")을 무시/변환(→ null 또는 코드값)

// 변환된 새 상태로 재저장(리라이트)

// 이후부터는 초기값/새 구조가 그대로 적용

// 즉, **“버전 불일치 → 마이그레이션 실행 → 오래된 상태 제거/정규화”**가 일어나서, 더 이상 오래된 필터 값이 다시 올라오지 않게 된 게 핵심입니다.
// (동일 효과를 내는 다른 방법: name 키를 바꿔 새 저장소로 시작하거나, localStorage.removeItem('room-store')로 수동 초기화.)