
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/home/Home';
import Profile from './pages/Profile';
import RoomList from './pages/RoomList';
// import RoomDetail from './pages/RoomDetail';
import MyReservation from './pages/MyReservation';
import AdminPage from './pages/auth/AdminPage';
import './index.css'
import useGlobalNotification from './hooks/useGlobalNotification';
import useSeatStore from './store/useSeatStore';
import NotificationModal from './components/NotificationModal';
import useUserStore from './store/useUserStore';
import { useEffect, useState } from 'react';
import webSocketService from './services/WebSocketService';
import useReservationStore from './store/useReservationStore';
import useReturnNotification from './hooks/useReturnNotification';
import axiosInstance from './api/axiosInstance';


function App() {


  const { selectedSeat } = useSeatStore();
  const { user } = useUserStore();
  const userId = user?.id || null;
  const { currentSeatId, myReservations, setMyReservations } = useReservationStore();


  //웹소켓 전역연결
  useEffect(() => {
    console.log('웹소켓 전역 연결 시작');
    webSocketService.connect(userId, null);

    setTimeout(() => {
      console.log('='.repeat(50));
      console.log('[App] 3초 후 상태 확인');
      // @ts-ignore
      const ws = webSocketService.client;
      console.log('WebSocket 객체:', ws);
      // @ts-ignore
      const listeners = webSocketService.announcementListeners;
      console.log('구독자 수:', listeners?.length);
      console.log('='.repeat(50));
    }, 3000);

    return () => {
      console.log('웹소켓 전역 연결 해제');
      webSocketService.disconnect();
    };
  }, [userId]);

  //로그인 시 현재 예약 정보 확인
  useEffect(() => {
    console.log('🔍 [예약 정보 useEffect 실행]');
    console.log('👤 현재 userId:', userId);
    console.log('📦 user 객체:', user);
    const fetchReservations = async () => {
      if (!userId) {
        setMyReservations([]);
        return;
      }

      try {
        const res = await axiosInstance.get("/reservation/my");
        useReservationStore.getState().setMyReservations(res.data);
        setMyReservations(res.data);
        console.log('✅ 예약 정보 Store에 저장 완료:', useReservationStore.getState().myReservations);

      } catch (error) {
        console.error("예약정보조회실패", error);
        setMyReservations([]);
      }
    };

    fetchReservations();

  }, [userId, setMyReservations]);

  useGlobalNotification();
  useReturnNotification(currentSeatId);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signUp" element={<SignUp />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/roomList" element={<RoomList />} />
        <Route path="myReservation" element={<MyReservation />} />
        <Route path="/admin" element={<AdminPage />} />
        {/* <Route path="/rooms/:roomId" element={<RoomDetail/>}/> */}

      </Routes>
      <NotificationModal />

    </BrowserRouter>


  )
}

export default App;
