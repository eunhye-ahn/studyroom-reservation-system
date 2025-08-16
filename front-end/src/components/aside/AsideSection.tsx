import useUserStore from "../../stores/useUserStore";
import RoomAsideList from "./RoomAsideList";

const AsideSection = () => {
    const {user} = useUserStore();


    return(
        <>
        <div>
            {user ? (
                <>
                <p className="">{user.role}</p>
                <p className=""><strong>{user.name}</strong>님</p>
                <p>안녕하세요.</p>
                </>
            ):(
                <p>로그인이 필요합니다.</p>
            )}
        </div>
        <div>
            <RoomAsideList/>
        </div>
        </>
        
    )
}

export default AsideSection;