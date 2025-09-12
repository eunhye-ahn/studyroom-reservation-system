import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";
import useRoomStore from "../stores/useRoomStore";

interface RoomInfo {
    id: number
    categoryType: 'general_pc' | 'group_study' | 'personal_carrel';
    subcategory: 'PERSON_1' | 'PERSON_2' | 'PERSON_4' | 'PERSON_6' | 'PERSON_12';
    floor: number;
    name: string;
    reservationType: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
    totalSeats: number;
    availableSeats: number;
}


const RoomList = () => {
    const [rooms, setRoom] = useState<RoomInfo[]>([]);
    const navigate = useNavigate();
    const { setRooms } = useRoomStore();

    useEffect(() => {
        axiosInstance.get("/rooms")
            .then((res) => {
                setRooms(res.data);
                setRoom(res.data);
            })
            .catch((err) => {
                console.error("열람실 불러오기 실패", err);
            });
    }, []);

    return (
        <div>
            <h2>열람실 목록</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room.id}>
                        <span onClick={() => navigate(`/rooms/${room.id}`)}>{room.name} </span>
                        <span>잔여좌석 : {room.availableSeats}/{room.totalSeats}</span>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default RoomList;