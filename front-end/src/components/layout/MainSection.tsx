import React from "react";
import { useEffect, useState, useMemo } from "react";
import useRoomStore from "../../stores/useRoomStore";

const MainSection : React.FC=() => {
        const {roomName, selectedFloor, mode} = useRoomStore();


        const ROOM_IMAGE_BY_NAME: Record<string, string>={
        '미디어라운지 매체제작실' : '/map/test.jpg',
        '해오름A 테스트': '/map/test.jpg',
        '열람실 202 테스트' : '/map/test.jpg',
    }

    const floorImage = selectedFloor ? `/map/${selectedFloor}F.png` : '';


    const imageSrc = useMemo(()=>{
        if(mode === 'room' && roomName) {
            return ROOM_IMAGE_BY_NAME[roomName] ?? '';
        }
        if (mode === 'floor'){
            return floorImage;
        }
        return ''

    },[roomName, selectedFloor, mode])




    return(
        <div>
            <div className="flex justify-center items-center min-h-screen w-full -translate-y-10">
                <img src={imageSrc} alt="지도" 
                className="w-200"/>
            </div>
        </div>
    )
}

export default MainSection;