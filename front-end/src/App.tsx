
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
import useNotification from './hooks/useNotification';
import useSeatStore from './store/useSeatStore';
import NotificationModal from './components/NotificationModal';

function App() {

  const { selectedSeat } = useSeatStore();
    useNotification(selectedSeat?.id ?? null);
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
