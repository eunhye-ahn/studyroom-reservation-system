import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import useUserStore from "../../store/useUserStore";
import SignUp from './SignUp';
import axiosInstance from '../../api/axiosInstance';
import { login, fetchMe } from '../../api/auth';
import { MyReserve } from '../../types/reservation.types';
import dayjs from 'dayjs';
import { ActiveReservationModal } from '../../components/ActiveReservationModal';
import useReservationStore from '../../store/useReservationStore';

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { setUser } = useUserStore();
    const { currentReservationId, setCurrentReservationId } = useReservationStore();

    const [activeItem, setActiveItem] = useState<MyReserve | null>(null);

    //현재 예약 중인지 검사
    function isActive(r: MyReserve) {
        const now = dayjs();
        const start = dayjs(`${r.date}T${r.startTime}`);
        const end = dayjs(`${r.date}T${r.endTime}`);
        return now.isAfter(start) && now.isBefore(end) && r.status === 'ACTIVE';
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const { accessToken } = await login(email, password);
            localStorage.setItem("accessToken", accessToken);

            const me = await fetchMe();
            setUser(me);

            const list: MyReserve[] = await axiosInstance.get("/reservation/my").then(r => r.data);
            const activeList = list.filter(isActive);
            if (activeList.length > 0) { setActiveItem(activeList[0]); }
            else { navigate("/home"); }
            console.log('📋 전체 예약 목록:', list);
            console.log('실행중인 예약 :', activeList);


        } catch (error) {
            alert("로그인 실패!");

        }
    };

    async function cancelNow(id: number) {

        await axiosInstance.delete(`/reservation/${id}`);
        alert("예약이 취소되었습니다.");
        setActiveItem(null);
        setCurrentReservationId(null);
        navigate("/home");


    }






    return (
        <div className='flex min-h-screen justify-center items-center '>

            <div className='flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-2xl shadow-sm p-6 md:p-20'>

                <img src="/icons/Logo.svg" alt="" className='w-[400px] px-[8px]' /><br />

                <form onSubmit={handleSubmit} className='w-[400px] px-[8px] space-y-5 '>
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
                    <button type="submit" className='w-full border border-gray-200 rounded-2xl p-3 shadow-sm cursor-pointer'>Login now</button><br />
                    <button type="button" onClick={() => navigate("/signUp")} className='w-full  border border-gray-200 rounded-2xl p-3 shadow-sm cursor-pointer'>Signup now</button>
                </form>
            </div>

            {activeItem && (
                <ActiveReservationModal
                    item={activeItem}
                    onCancel={cancelNow}
                    onClose={() => setActiveItem(null)}
                    onGoMyPage={() => { setActiveItem(null); }}
                />
            )}

        </div>
    );
};

export default Login;