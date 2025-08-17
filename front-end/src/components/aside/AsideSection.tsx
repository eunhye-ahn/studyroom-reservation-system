import { useNavigate } from "react-router-dom";
import useUserStore from "../../stores/useUserStore";
import RoomAsideList from "./RoomAsideList";

const AsideSection = () => {
    const {user} = useUserStore();
    const navigate = useNavigate();



    return(
        <>
        <div className="flex">
            <div>
                <img src="/icons/User.png" alt="유저"
                onClick={() => navigate("/profile")}
                className="w-20" />
            </div>
            <div className="justify-items-start px-4 text-white">
            {user ? (
                <>
                <p className="text-sm">{user.role}</p>
                <p className="text-2xl"><strong>{user.name}</strong>님</p>
                <p className="text-2xl">안녕하세요.</p>
                </>
            ):(
                <p>로그인이 필요합니다.</p>
            )}
        </div>
        </div>
        <div>
            <RoomAsideList/>
        </div>
        </>
        
    )
}

export default AsideSection;