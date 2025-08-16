import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from "../stores/useUserStore";
import SignUp from './SignUp';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const {setUser} = useUserStore();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const res = await axios.post("/api/auth/login", {
                email,
                password
            }, { headers: { 'Content-Type': 'application/json' } });
            const accessToken = res.data.accessToken;
            localStorage.setItem("accessToken", accessToken);
            console.log("로그인토큰", accessToken);
            alert("로그인 성공!")

const me = await axiosInstance.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      setUser(me.data);
            


            navigate("/home");

        } catch (error) {
            alert("로그인 실패!");
        }
    };

    return (
        <div className='flex min-h-screen'>
            
            <div className='flex-[4]  flex flex-col items-center justify-center gap-2'>

                <img src="/icons/Logo.svg" alt="" className='w-[400px] px-[8px]'/><br />

                <form onSubmit={handleSubmit} className='w-[400px] px-[8px] space-y-5'>
                    <label htmlFor="email">Email address <br /></label>
                    <input
                        type="email"
                        placeholder='alex@email.com'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className='w-full px-3 py-2 bg-gray-200'
                    />
                    <br />
                    <label htmlFor="password">Password <br /></label>
                    <input
                        type="password"
                        placeholder='Enter your password'
                        value={password}
                        className='w-full px-3 py-2 bg-gray-200'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                          <button type="submit" className='w-full'>Login now</button><br />
                    <button onClick={()=> navigate("/signUp")} className='w-full'>Signup now</button>
                </form>
            </div>
            

            <div className='flex-[6] bg-gray-100 h-screen'>
                <img src="/reperence.jpg" alt="이미지"
                className='w-full h-full object-cover' />이미지
            </div>
            
        </div>
    );
};

export default Login;