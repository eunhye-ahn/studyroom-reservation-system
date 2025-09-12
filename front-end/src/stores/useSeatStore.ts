import { create } from "zustand";



export interface Seat {
  id: number;
  number: number;
  available: boolean;
  readingRoomName: string;
}

export interface SeatStore {
  seats: Seat[];
  selectedSeat: Seat | null;
  loading: boolean;
  
  setSeats: (seats: Seat[]) => void;
  setSelectedSeat: (seat: Seat | null) => void;
  setLoading: (loading: boolean) => void;
  clearSeats: () => void;
}



const useSeatStore = create<SeatStore>()((set) => ({
  seats: [],
  selectedSeat: null,
  loading: false,
  
  setSeats: (seats) => set({ seats }),
  setSelectedSeat: (seat) => set({ selectedSeat: seat }),
  setLoading: (loading) => set({ loading }),
  clearSeats: () => set({ seats: [], selectedSeat: null }),
}));

export default useSeatStore;