import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import {ReservationTimer} from "../components/ReservationTimer";
import dayjs from "dayjs";

interface MyReserve {
    userEmail: string;
    readingRoomName: string;
    seatNumber: number;
    date: string;
    startTime: string;
    endTime: string;
    id: number;
}

function MyReservation() {
    const [myReserveInfo, setMyReserveInfo] = useState<MyReserve[]>([]);
    const [extensionCountMap, setExtensionCountMap] = useState<{[key:number]:number}>({});

    const now = dayjs();
    const activeReservations = myReserveInfo.filter((res)=>
    dayjs(`${res.date}T${res.endTime}`).isAfter(now)); 

    async function fetchMyReserveData() {
        const res = await axiosInstance.get("/reservation/my");
        setMyReserveInfo(res.data);

        const counts: {[key:number]:number}={};
        for(const reservation of res.data){
            try{
                const countRes = await axiosInstance.get(`/reservation/${reservation.id}/extend`);
            counts[reservation.id] = countRes.data;
        } catch (e) {
            console.error(`연장 횟수 조회 실패 (예약 ID: ${reservation.id})`, e);
        }
    }
    setExtensionCountMap(counts);

    }
    useEffect(() => {
        fetchMyReserveData();
    }, []);


    async function handleCancel(id: number) {
        try {
            await axiosInstance.delete(`/reservation/${id}`);
            alert("예약이 취소되었습니다.");
            fetchMyReserveData();


        } catch (error) {5
            console.error("예약 취소 실패", error);
            alert("예약 취소 실패");
        }
    }

    async function handleExtension(id:number){
        try{
            const res = await axiosInstance.post(`/reservation/${id}/extend`);
        alert("예약이 연장되었습니다.");

        setExtensionCountMap(prev => ({
            ...prev,
            [id]: res.data.extensionCount
        }));}
        catch(error:any){
    let msg = "예약 연장 실패";

    if (error.response?.data) {
        if (typeof error.response.data === "string") {
            msg = error.response.data;
        } else if (typeof error.response.data.message === "string") {
            msg = error.response.data.message;
        }
    }

    alert(msg);
}}

    return (
        <div>
            <h2>내 예약 목록</h2>
            <h3>현재 이용 중</h3>
            {activeReservations.length === 0 ? (
                <p>현재 예약이 없습니다.</p>) : ( 
                <ul>
                    {activeReservations.map((res) => (
                        <li key={res.id}>
                            <div>열람실 : {res.readingRoomName}</div>
                            <div>좌석 번호 : {res.seatNumber}</div>
                            <div>날짜 : {res.date}</div>
                            <div>
                                사용 시간 : {res.startTime} ~ {res.endTime}
                            </div>
                            <div>
                                남은 시간 : <ReservationTimer endTime={`${res.date}T${res.endTime}`} />
                            </div>
                            <div>연장 횟수 : {extensionCountMap[res.id] ?? "로딩 중..."}</div>
                            <button onClick={() =>  handleCancel(res.id) }>취소하기</button>
                            <button onClick={()=>handleExtension(res.id)}>연장하기</button>
                        </li>
                    ))}
                </ul>

            )
            }

            <h3>이용 내역</h3>
            {myReserveInfo.length === 0? (
                <p>이용 내역이 없습니다.</p>
            ):(
                <ul>
                    {myReserveInfo.map((res)=>(
                        <li key={res.id}>
                            <div>{res.date}</div>
                            <div>{res.startTime} - {res.endTime}</div>
                            <div>{res.readingRoomName}</div>
                            <div>좌석 번호. {res.seatNumber}</div>
                            <div>{activeReservations.length === 0? "반납됨" :"사용중"}</div>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    )

}
export default MyReservation;