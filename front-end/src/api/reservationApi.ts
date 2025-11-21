import axios from "axios";
import axiosInstance from "./axiosInstance";

const createReservation = async (seatId: number) => {
    return await axiosInstance.post("/reservation", { seatId })

};

export const fetchMyReservations = async () => {
    try {
        const response = await axiosInstance.get('/reservation/my');
        return response.data;
    } catch (error) {
        console.error('예약 조회 실패:', error);
        throw error;
    }
};

export default createReservation;