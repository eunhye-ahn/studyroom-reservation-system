import { WaitingQueue } from 'src/api/waitingApi';
import { create } from 'zustand'

interface Reservation {
    id: number;
    seatId: number;
}

interface ReservationState {

    //예약
    myReservations: Reservation[];
    currentSeatId: number | null;
    currentReservationId: number | null;
    setMyReservations: (reservations: Reservation[]) => void;
    setCurrentReservationId: (id: number | null) => void;

    //대기
    myWaitingList: WaitingQueue[];
    waitingNotification: {
        type: 'ASSIGNED' | 'EXPIRED' | 'WAITING' | 'CANCELLED' | 'CONFIRMED',
        waiting: WaitingQueue | null;
    } | null;
    setMyWaitingList: (list: WaitingQueue[]) => void;
    addWaiting: (waiting: WaitingQueue) => void;
    updateWaiting: (waiting: WaitingQueue) => void;
    removeWaiting: (waitingId: number) => void;
    setWaitingNotification: (notification: any) => void;
    clearWaitingNotification: () => void;
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
    },

    myWaitingList: [],
    waitingNotification: null,


    setMyWaitingList: (list) => set({ myWaitingList: list }),

    addWaiting: (waiting) => set((state) => ({
        myWaitingList: [...state.myWaitingList, waiting]
    })),

    updateWaiting: (waiting) => set((state) => ({
        myWaitingList: state.myWaitingList.map(w =>
            w.id === waiting.id ? waiting : w
        )
    })),
    removeWaiting: (waitingId) => set((state) => ({
        myWaitingList: state.myWaitingList.filter(w => w.id !== waitingId)
    })),

    setWaitingNotification: (notification) => set({
        waitingNotification: notification
    }),

    clearWaitingNotification: () => set({
        waitingNotification: null
    }),
}));


export default useReservationStore;