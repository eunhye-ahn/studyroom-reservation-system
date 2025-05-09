import axios from "axios";
import axiosInstance from "./axiosInstance";

const createReservation = async (seatId:number)=>{
    return await axiosInstance.post("/reservation",{seatId})
        
};

export default createReservation;