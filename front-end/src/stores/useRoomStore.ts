import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomInfo } from "../api/rooms";

interface RoomStore {
    selectedCategory: 'general_pc' | 'group_study' | 'personal_carrel' | null;
    rooms : RoomInfo[]
    currentRoom : RoomInfo | null;

    setSelectedCategory:(category: 'general_pc' | 'group_study' | 'personal_carrel') => void;
    setRooms: (rooms: RoomInfo[]) => void;
    setCurrentRoom: (room: RoomInfo) => void;
    clearRoom: () => void;
}


const useRoomStore = create<RoomStore>()(
    persist(
        (set) => ({
            selectedCategory: 'general_pc',
            rooms: [],
            currentRoom: null,
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