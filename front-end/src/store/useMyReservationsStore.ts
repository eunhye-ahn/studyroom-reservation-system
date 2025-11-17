import {create} from "zustand"
import { persist } from "zustand/middleware";

interface MyReserveStore {
    userEmail: string;
    readingRoomName: string;
    seatNumber: number;
    date: string;
    startTime: string;
    endTime: string;
    id: number;
}
