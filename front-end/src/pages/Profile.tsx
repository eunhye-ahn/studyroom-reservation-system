import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

interface UserInfo {
    name: string;
    email: string;
    role: 'USER' | 'ADMIN';
  }

function Profile(){
    const [userInfo,setUserInfo] = useState<UserInfo>();
    const navigate = useNavigate();

    useEffect(()=>{
        const token = localStorage.getItem("token");
        console.log("보내는 토큰", token);
        if(!token){
            alert("로그인이 필요합니다.");
            navigate("/login");
            return;
        }
        axiosInstance.get("/api/auth/me")
        .then((res) => {
            console.log("응답 데이터:", res.data);
          setUserInfo(res.data);
        })
        .catch((err) => {
          console.error("사용자 정보 조회 실패", err);
          alert("로그인을 다시 해주세요.");
          navigate("/login");
        });
    }, [navigate]);
    if(!userInfo){
        return <div>loading...</div>
    }


    return(
        <div>
            <h2>나의 프로필</h2>
            <p><strong>이름: </strong>{userInfo.name}</p>
            <p><strong>이메일: </strong>{userInfo.email}</p>
            <p><strong>역할: </strong>{userInfo.role}</p>
        </div>
    )
}
export default Profile;