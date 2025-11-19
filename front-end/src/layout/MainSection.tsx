import React from "react";
import { useEffect, useState, useMemo } from "react";
import useRoomStore from "../store/useRoomStore";
import { FloorId, RoomId } from "../types/type"
import FloorButton from "../components/FloorButton";
import SeatButton from "../components/SeatButton";
import api from "axios";
import { RoomInfo } from "../api/rooms";
import axiosInstance from "../api/axiosInstance";
import { Seat } from "../store/useSeatStore";



const MainSection: React.FC = () => {


    const { roomName, selectedFloor,setSelectedFloor,setSelectedCategory, selectedRoomId: selectedRoomId, openRoom: openArea, mode, setSeatsInRoom: setSeatsInRoom } = useRoomStore();
    const [roomImage, setRoomImage] = useState<string>("");
    const [seats, setSeats] = useState<Seat[]>([]);



    useEffect(()=>{
        setSelectedFloor(1);
        setSelectedCategory("자료관");
},[]);

    useEffect(() => {
        let alive = true;
        async function load() {
            if (mode !== "room" || !selectedRoomId) return;
            try {
                const rooms = await api.get(`/areas/${selectedRoomId}/rooms`).then(r => r.data as RoomInfo[]);
                if (!alive) return;
                setSeatsInRoom(rooms);
            } catch (e) {
                if (!alive) return;
                console.error("[Main] fetch rooms failed", e);
                setSeatsInRoom([]);
            }
        }
        load();
        return () => { alive = false; };
    }, [mode, selectedRoomId, setSeatsInRoom]);

    useEffect(() => {
        if (mode === "room" && selectedRoomId !== null) {
            const image = IMAGE_BY_ROOM_ID[selectedRoomId];
            if (image) {
                setRoomImage(image);
            }
        }
    }, [selectedRoomId, mode]);



    //mapping
    const ROOM_BY_BUTTON_ID: Record<string, { roomId: RoomId; image: string, displayName?: string }> = {
        "1": { roomId: 1, image: "map/1_book_A.jpg", displayName: "책마당A" },
        "2": { roomId: 6, image: "map/1_eulim_A.jpg", displayName: "어울림A" },
        "6": { roomId: 3, image: "map/1_media_pc.jpg", displayName: "미디어라운지 pc 이용석" },
        "7": { roomId: 4, image: "map/2_study201.jpg", displayName: "열람실 201호" },
        "8": { roomId: 5, image: "map/2_study202.jpg", displayName: "열람실 202호" },
        "11": { roomId: 2, image: "map/2_chang_A.jpg", displayName: "창의마루A" },
        "12": { roomId: 9, image: "map/2_chang_B.jpg", displayName: "창의마루B" },
        "14": { roomId: 7, image: "map/3_hae_A.jpg", displayName: "해오름마루A" },
        "15": { roomId: 8, image: "map/3_hae_B.jpg", displayName: "해오름마루B" },
        "20": { roomId: 10, image: "map/4_study404.jpg", displayName: "열람실 404호" },
        
    };

    // 이미지 선택
    const IMAGE_BY_ROOM_ID: Record<RoomId, string> = {
        1: "map/1_book_A.jpg",
        2: "map/2_chang_A.jpg",
        3: "map/1_media_pc.jpg",
        4: "map/1_eulim_A.jpg",
        5: "map/2_study201.jpg",
        6: "map/2_study202.jpg",
        7: "map/3_hae_A.jpg",
        8: "map/3_hae_B.jpg",
        9: "map/2_chang_B.jpg",
        10: "map/4_study404.jpg",
        

    };


    const floorImage = selectedFloor ? `/map/${selectedFloor}F.png` : '';

    const imageSrc = useMemo(() => {
        if (mode === "room" && roomImage) return roomImage;
        if (mode === 'floor') {
            return floorImage;
        }
        return ''
    }, [roomName, selectedFloor, roomImage, mode])

    console.log('[MainSection] render', {
        mode,
        selectedFloor,
        typeOfSelectedFloor: typeof selectedFloor,
        imageSrc,
    });

    const onEnterAreaByButtonId = async (buttonId: string) => {
        const hit = ROOM_BY_BUTTON_ID[buttonId];
        if (!hit) return;
        openArea(hit.roomId);
        console.log(hit.roomId);
    }

    


    return (
        <div className="min-h-screen flex items-center justify-center -translate-y-10">
            <div className="max-w-[800px] w-full aspect-[900/732]">
                <svg
                    viewBox="0 0 930 732"
                    className="block w-full h-full mx-auto"
                    preserveAspectRatio="xMidYMid meet"
                    onClick={(e) => {
                        const svg = e.currentTarget;
                        const pt = svg.createSVGPoint();
                        pt.x = e.clientX;
                        pt.y = e.clientY;
                        const ctm = svg.getScreenCTM();
                        if (ctm) {
                            const local = pt.matrixTransform(ctm.inverse());
                            console.log(`x=${Math.round(local.x)}, y=${Math.round(local.y)}`);
                        }
                    }}
                >
                    <image href={imageSrc} x="0" y="0" width="930" height="732"
                        style={{ pointerEvents: 'none' }} />
                    {/* 층 보기일 때 → 영역 버튼 표시 */}
                    {mode === "floor" && (
                        <FloorButton
                            floor={(Number(selectedFloor) as FloorId) ?? null}
                            onButtonClick={onEnterAreaByButtonId}
                        />
                    )}

                    {mode === 'room' && selectedRoomId && (
                        <SeatButton
                            roomId={selectedRoomId}
                                // try {
                                // }
                                // catch (error: any) {
                                //     console.error("예약실패 : ", error);
                                //     console.error("예약 실패 상세:", error.response?.status);
                                //     let msg = "예약 실패";
                                //     if (error.response?.data) {
                                //         if (typeof error.response.data === "string") {
                                //             msg = error.response.data;
                                //         } else if (typeof error.response.data.message === "string") {
                                //             msg = error.response.data.message;
                                //         }
                                //     }
                                //     alert(msg);

                                // }
                            
                        />
                    )}
                </svg>
            </div>
        </div>


    )
}

export default MainSection;

