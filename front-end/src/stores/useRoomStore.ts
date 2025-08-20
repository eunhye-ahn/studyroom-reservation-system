import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RoomInfo } from "../api/rooms";

interface RoomStore {
    
    selectedFloor: number;
    selectedCategory: string;
    rooms : RoomInfo[];
    currentRoom : RoomInfo | null;
    roomName: string | null;
    mode: 'floor' | 'room';

    setRoomName: (name: string | null)=> void;
    setSelectedFloor:(floor: number) => void;
    setSelectedCategory: (category: string) => void;
    setRooms: (rooms: RoomInfo[]) => void;
    setCurrentRoom: (room: RoomInfo) => void;
    clearRoom: () => void;
    setMode: (m:'floor' | 'room')=> void;
}


const useRoomStore = create<RoomStore>()(
    persist(
        (set) => ({
            selectedFloor: 1,
            selectedCategory: "자료관",
            rooms: [],
            currentRoom: null,
            roomName: null,
            mode:'floor',

            setRoomName: (name)=> set({roomName : name}),
            setSelectedFloor: (floor) => set({ selectedFloor: floor }),
            setSelectedCategory: (category) => set({ selectedCategory: category }),
            setRooms: (rooms) => set({ rooms }),
            setCurrentRoom: (room) => set({ currentRoom: room }),
            clearRoom: () => set({ currentRoom: null }),
            setMode: (mode)=> set({mode}),
        }),
        {
            name: "room-store",
        }
    )
);

export default useRoomStore;