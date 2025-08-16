import { create } from "zustand";
import { persist } from "zustand/middleware";


interface RoomInfo {
    categoryType : 'general_pc' | 'group_study' | 'personal_carrel';
    subcategory : 'PERSON_1' | 'PERSON_2' |'PERSON_4' | 'PERSON_6' | 'PERSON_12';
    floor : number;
    name: string;
    reservationType: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
    totalSeats : number;
    availableSeats : number;
  }

interface RoomStore {
  room: RoomInfo | null;
  setRoom: (user: RoomInfo) => void;
  clearRoom: () => void;
}


const useRoomStore = create<RoomStore>()(
  persist(
    (set) => ({
      room: null,
      setRoom: (room) => set({ room }),
      clearRoom: () => set({ room: null }),
    }),
    {
      name: "room-store", // localStorage key
    }
  )
);
export default useRoomStore;