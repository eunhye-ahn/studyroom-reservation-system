
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import RoomList from './pages/RoomList';
import RoomDetail from './pages/RoomDetail';
import MyReservation from './pages/MyReservation';
import './index.css' 

function App() {

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
        <Route path="/rooms/:roomId" element={<RoomDetail/>}/>

      </Routes>
    </BrowserRouter>

  )
}

export default App;
