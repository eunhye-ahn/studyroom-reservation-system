import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomInfo } from "../api/rooms";

interface RoomStore {
    
    selectedFloor: number;
    selectedCategory: string;
    rooms : RoomInfo[]
    currentRoom : RoomInfo | null;

    setSelectedFloor:(floor: number) => void;
    setSelectedCategory: (category: string) => void;
    setRooms: (rooms: RoomInfo[]) => void;
    setCurrentRoom: (room: RoomInfo) => void;
    clearRoom: () => void;
}


const useRoomStore = create<RoomStore>()(
    persist(
        (set) => ({
            selectedFloor: 1,
            selectedCategory: "자료관",
            rooms: [],
            currentRoom: null,
            
            setSelectedFloor: (floor) => set({ selectedFloor: floor }),
            setSelectedCategory: (category) => set({ selectedCategory: category }),
            setRooms: (rooms) => set({ rooms }),
            setCurrentRoom: (room) => set({ currentRoom: room }),
            clearRoom: () => set({ currentRoom: null }),
        }),
        {
            name: "room-store",
        }
    )
);

export default useRoomStore;