import { useNavigate } from "react-router-dom";

function Home(){
    const navigate = useNavigate();

    return(
        <div>
            <h1>순천대 도서관</h1>
            <button onClick={()=> navigate("/profile")}>나의 프로필</button>
            <button onClick={()=> navigate("/myReservation")}>나의 자리</button>
            <button onClick={()=> navigate("/roomList")}>열람실</button>
        </div>
    )
}

export default Home;