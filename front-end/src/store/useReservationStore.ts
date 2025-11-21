import { create } from 'zustand'

interface Reservation {
    id: number;
    seatId: number;
}

interface ReservationState {
    myReservations: Reservation[];
    currentSeatId: number | null;
    currentReservationId: number | null;
    setMyReservations: (reservations: Reservation[]) => void;
    setCurrentReservationId: (id: number | null) => void;
}

const useReservationStore = create<ReservationState>((set) => ({
    myReservations: [],
    currentSeatId: null,
    currentReservationId: null,

    setMyReservations: (reservations) => {
        const currentSeatId = reservations.length > 0 ? reservations[0].seatId : null;
        const currentReservationId =
            currentSeatId !== null
                ? reservations.find(r => r.seatId === currentSeatId)?.id ?? null
                : null;

        set({ myReservations: reservations, currentSeatId, currentReservationId });
    },

    setCurrentReservationId: (id: number | null) => {
        set({ currentReservationId: id });
    }
}));


export default useReservationStore;