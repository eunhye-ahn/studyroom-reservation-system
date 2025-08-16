import useRoomStore from "../../stores/useRoomStore";
import React from "react";

const Footer: React.FC=()=>{
    const {selectedCategory, setSelectedCategory} = useRoomStore();

    return(
        <div>
            <button onClick={()=>setSelectedCategory('general_pc')}>
                일반/PC
            </button>
            <button onClick={()=>setSelectedCategory('group_study')}>
                그룹 스터디
            </button>
            <button onClick={()=>setSelectedCategory('personal_carrel')}>
                개인 캐럴
            </button>
        </div>
    )
}
export default Footer;
