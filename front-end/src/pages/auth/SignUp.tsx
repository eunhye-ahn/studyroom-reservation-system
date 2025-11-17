import React, { useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const SignUp = () =>{
    const [name, setName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e:React.FormEvent) =>{
        e.preventDefault();

        try{
            await axios.post("/api/auth/signUp",{
                name,
                email,
                password,
            },{
                headers : {'Content-Type' : "application/json"},
            });

            const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
                name,
                email,
                password,
              }, {
                headers: { 'Content-Type': 'application/json' },
            });

            const token = loginRes.data.accessToken;
            localStorage.setItem('token', token);

            alert("회원가입 및 로그인 성공!");
            navigate('/home');
        }catch(error){
            alert('회원가입 실패!');
        }
    };

    return(
        <form onSubmit={handleSubmit}>
            <h2>회원가입</h2>
            <input 
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e)=>setName(e.target.value)}
             />
             <br />
            <input 
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            required
            />
            <br />
            <input 
            type="password"
            placeholder="비밀번호 입력"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            required
            />
            <br />
            <button type="submit">회원가입</button>
        </form>
    );
};

export default SignUp;