
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
import { useEffect } from 'react';
import webSocketService from './services/WebSocketService';

function App() {


  const { selectedSeat } = useSeatStore();
  const {user} = useUserStore();
    const userId = user?.id || null;
  useEffect(()=>{
  console.log('웹소켓 전역 연결 시작');
  webSocketService.connect(userId, null);

  setTimeout(() => {
    console.log('='.repeat(50));
    console.log('🔍 [App] 3초 후 상태 확인');
    // @ts-ignore
    const ws = webSocketService.client;
    console.log('🔍 WebSocket 객체:', ws);
    // @ts-ignore
    const listeners = webSocketService.announcementListeners;
    console.log('🔍 구독자 수:', listeners?.length);
    console.log('='.repeat(50));
  }, 3000);

  return ()=> {
    console.log('웹소켓 전역 연결 해제');
    webSocketService.disconnect();

};
},[userId]);

  useGlobalNotification();

  return (
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<SignUp/>} />
          <Route path="/home" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/roomList" element={<RoomList/>}/>
          <Route path="myReservation" element={<MyReservation/>}/>
          <Route path="/admin" element={<AdminPage/>}/>
          {/* <Route path="/rooms/:roomId" element={<RoomDetail/>}/> */}

        </Routes>
        <NotificationModal />

      </BrowserRouter>


  )
}

export default App;
