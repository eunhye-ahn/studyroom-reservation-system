import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import createReservation from "../api/reservationApi";


interface SeatList {
    id : number,
    number : number,
    readingRoomName : String
};

interface SeatStatus{
    seatId : number;
    seatNumber : number;
    available : boolean;
}

interface SeatCombined {
    id : number;
    number : number;
    readingRoomName : String;
    available : boolean;
}

function RoomDetail(){
    const {roomId} = useParams();

    const [seats,setSeats] = useState<SeatCombined[]>([]);
    const navigate = useNavigate();

    async function fetchSeatData(){
        try{
        const seatListRes =  await axiosInstance.get(`/reading-rooms/${roomId}/seats`);
        const seatList: SeatList[] = seatListRes.data
         
        const statusRes = await axiosInstance.get(`/reading-rooms/${roomId}/status`);
        const statusList : SeatStatus[] = statusRes.data;

        const combined: SeatCombined[] = seatList.map((seat)=>{
            const status = statusList.find((s)=>s.seatId === seat.id);
            return {
                id:seat.id,
                number:seat.number,
                readingRoomName:seat.readingRoomName,
                available:status?status.available:true,
            };
        });
        setSeats(combined);
        
    }
            catch(error){
                alert("좌석조회 안됨")
                console.error("좌석조회 안됨",error);
            }
            }

    useEffect(()=>{
        
                fetchSeatData();
    },[roomId]);

    const handleReserve = async (id:number) =>{
        try{
            await createReservation(id);
            alert("예약 성공")
            fetchSeatData();

        }catch(error){
            console.error("예약 실패",error);
            alert("이미 예약된 좌석이거나 오류 발생");
        }
    };

    return(
        <div>
            <div>
                <img src="" alt="" />
            </div>
            <div>
                {seats.map((seat)=>(
                    <div key={seat.id}>
                        <div onClick={()=>{handleReserve(seat.id)}}>좌석 {seat.number}</div>
                        <div>{seat.available ? "사용 가능":"사용 중"}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RoomDetail;





















// import { useEffect } from "react";
// import { useParams } from "react-router-dom";
// import axiosInstance from "../api/axiosInstance";
// import { useState } from "react";

// interface Seat {
//     id : number;
//     number : number;
//     available : boolean;
// }

// function RoomDetail(){
//     const {roomId} = useParams();
//     const [seats, setSeats] = useState<Seat[]>([]);

//     useEffect(()=>{
//         async function fetchSeats() {
//             try{
//                 const seatListRes = await axiosInstance.get(
//                     `/reading-rooms/${roomId}/seats`
//                 );
//                 const seatList = seatListRes.data;
                
//                 const seatsWithStatus:Seat[]=await Promise.all(
//                     seatList.map(async (seat:{id : number; number : number})=>{
//                         const statusRes = await axiosInstance.get(
//                             `/reading-rooms/${roomId}/status`
//                         );
//                         return{
//                             id : seat.id,
//                             number : seat.number,
//                             available : Boolean(statusRes.data.available),
//                         };
//                     })
//                 );
//             setSeats(seatsWithStatus);
            
//             }catch(err){
//                 console.error("좌석 또는 상태 조회 실패", err);
//             }
//             }
            
//         fetchSeats();
//     },[roomId]);

//     return(
//         <div>
//             <h2>좌석현황</h2>
//             <div>
//                 {seats.map((seat)=>(
//                     <div key={seat.id}>좌석{seat.number}
//                     <div>{seat.available === true ? "이용 가능":"이용 중"}</div>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default RoomDetail;