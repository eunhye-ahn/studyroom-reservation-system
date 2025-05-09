import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useEffect, useState } from "react";

interface Room {
    name : String;
    totalSeats : number;
    availableSeats : number;
}

const RoomList= ()=>{
    const [rooms,setRooms] = useState<Room[]>([]);
    const navigate = useNavigate();

    useEffect(()=>{
        axiosInstance.get("/rooms")
        .then((res)=>{
            setRooms(res.data);
        })
        .catch((err)=>{
            console.error("열람실 불러오기 실패", err);
        });
        
    },[])

    return(
        <div>
            <h2>열람실 목록</h2>
            <ul>
                {rooms.map((room)=>(
                    <li>
                        <span>{room.name} </span>
                        <span>잔여좌석 : {room.availableSeats}/{room.totalSeats}</span>
                    </li>
                ))}

            </ul>
        </div>
    )
}

export default RoomList;