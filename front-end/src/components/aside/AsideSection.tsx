import { useNavigate } from "react-router-dom";
import useUserStore from "../../hooks/useUserStore";
import RoomAsideList from "../aside/RoomAsideList";

const AsideSection = () => {
    const {user} = useUserStore();
    const navigate = useNavigate();



    return(
        <>
        <div className="flex absoulte mt-8 ml-8 w-full justify-start gap-4">
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
        <div className="absolute bottom-8 w-full flex justify-center">
            <img src="/icons/Logo.svg" alt="순천대학교" 
            className="fixed flex justify-center bottom-8 w-80"/>
        </div>
        </>
        
    )
}

export default AsideSection;