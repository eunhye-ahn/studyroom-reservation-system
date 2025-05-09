import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent)=>{
        e.preventDefault();

        try{
            const res = await axios.post("/api/auth/login",{
                email,
                password
            }, { headers: { 'Content-Type': 'application/json' } });
            const accessToken = res.data.accessToken;
            localStorage.setItem("accessToken",accessToken);
            console.log("로그인토큰",accessToken);
        

            alert("로그인 성공!")
            navigate("/home");

        }catch (error) {
            alert("로그인 실패!");
          }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>로그인</h2>
            <input 
            type="email"
            placeholder='이메일 입력'
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
            />
            <br />
            <input 
            type="password"
            placeholder='비밀번호 입력'
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
            <br />
            <button type="submit">로그인</button>
        </form>
    );
};

export default Login;