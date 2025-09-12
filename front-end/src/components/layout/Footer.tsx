import useRoomStore from "../../stores/useRoomStore";
import React, { useEffect, useState } from "react";
// import {FloorId} from "../../api/type"


const Footer: React.FC=()=>{
    const {selectedFloor, setSelectedFloor, setMode} = useRoomStore();
    const floors = [1, 2, 3, 4];

    useEffect(() => {
  console.log('selectedFloor:', selectedFloor, typeof selectedFloor);
}, [selectedFloor]);
    

    return(
        <div className="flex gap-8 text-2xl font-bold">
            {floors.map((floor) => (
                <button key={floor}
                onClick={()=>{
                    setSelectedFloor(floor)
                    setMode('floor');
                }}
                type="button" 
className={`w-18 h-11 px-3 py-1 rounded border transition-colors,
    cursor-pointer 
            ${
              selectedFloor === floor
                ? "bg-[#3343F3] border-0 text-white" // 선택된 상태 (hover 유지 효과)
                : "bg-transparent border-gray-500 text-white hover:bg-[#3343F3] hover:border-0"
            }`}
        >                    {floor}F
                </button>
            ))}
        </div>

    )
}
export default Footer;
