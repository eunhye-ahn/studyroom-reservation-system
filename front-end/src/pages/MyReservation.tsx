import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface MyReserve {
    userEmail: String;
    readingRoomName: String;
    seatNumber: number;
    date: String;
    startTime: String;
    endTime: String;
    id: number;
}

function MyReservation() {
    const [myReserveInfo, setMyReserveInfo] = useState<MyReserve[]>([]);

    async function fetchMyReserveData() {
        const res = await axiosInstance.get("/reservation/my");
        setMyReserveInfo(res.data);
    }
    useEffect(() => {

        fetchMyReserveData();
    }, []);

    async function handleCancel(id: number) {
        try {
            await axiosInstance.delete(`/reservation/${id}`);
            alert("예약이 취소되었습니다.");
            fetchMyReserveData();


        } catch (error) {
            console.error("예약 취소 실패", error);
            alert("예약 취소 실패");
        }
    }

    return (
        <div>
            <h2>내 예약 목록</h2>
            {myReserveInfo.length === 0 ? (
                <p>현재 예약이 없습니다.</p>) : (
                <ul>
                    {myReserveInfo.map((res) => (
                        <li key={res.id}>
                            <div>열람실 : {res.readingRoomName}</div>
                            <div>좌석 번호 : {res.seatNumber}</div>
                            <div>날짜 : {res.date}</div>
                            <div>
                                시간 : {res.startTime} ~ {res.endTime}
                            </div>
                            <button onClick={() =>  handleCancel(res.id) }>취소하기</button>
                        </li>
                    ))}
                </ul>

            )
            }

        </div>
    )
}

export default MyReservation;