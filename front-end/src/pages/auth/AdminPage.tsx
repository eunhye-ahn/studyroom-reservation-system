
import React, { useState, useEffect, useMemo } from 'react';
import { useAdminWebSocket } from '../../hooks/useAdminWebsocket';
import { useSeatWebSocket } from '../../hooks/useSeatWebSocket';
import useGlobalNotification from '../../store/useNotificationStore';
import webSocketService from 'src/services/WebSocketService';
import { fetchRooms } from '../../api/rooms';
import useRoomStore from '../../store/useRoomStore';
import { RoomInfo } from '../../api/rooms';
import { LABEL_TO_CODE } from '../../api/rooms';
import api from "../../api/axiosInstance";
import useSeatStore from '../../store/useSeatStore';

const AdminPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [totalRooms, setTotalRooms] = useState<RoomInfo[]>([]);

  const { forceReturnSeat, sendAnnouncement } = useAdminWebSocket();

  const { seats, connected } = useSeatWebSocket(0); // userId 0 (관리자)

  const [selectedRoomForSeats, setSelectedRoomForSeats] = useState<number | null>(null); // 선택된 방 ID



  //좌석 로드
  const {
    mode,
    selectedFloor,
    selectedCategory,
    setSelectedCategory,
    setRoomName,
    setMode,
    openRoom,
    selectedRoomId,
    rooms,
    setRooms,
  } = useRoomStore();

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (mode !== "floor" || !selectedFloor) return;

    const controller = new AbortController(); // axios v1: AbortController 지원
    setLoading(true);
    setErr(null);

    const categoryParam =
      selectedCategory
        ? (LABEL_TO_CODE[selectedCategory] ?? selectedCategory)
        : undefined;
    api
      .get<RoomInfo[]>("/rooms", {
        params: { floor: Number(selectedFloor), category: categoryParam },
        signal: controller.signal,
      })
      .then((res) => {
        setRooms(res.data);
      }
      )
      .catch((e) => {
        if (controller.signal.aborted) return;
        setRooms([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [mode, selectedFloor, selectedCategory, setRooms]);



  const filteredRooms = useMemo(() => {


    if (!selectedCategory) return rooms;

    let filtered = rooms;

    if (selectedCategory) {
      filtered = filtered.filter((r) => {
        const displayName = r.categoryType?.displayName;
        return displayName === selectedCategory;
      });
    }

    filtered = filtered.filter((r) => r.floor === selectedFloor);

    return filtered;
  }, [rooms, selectedCategory, selectedFloor]);

  const handleClickRoom = (roomId: number, roomName: string) => {
    setRoomName(roomName);
    setMode("room");
    openRoom(roomId); // selectedRoomId 업데이트 → useSeatWebSocket이 자동으로 해당 방 연결
  };

  useGlobalNotification();

  //웹소켓 연결
  useEffect(() => {
    const loadRooms = async () => {
      try {
        const data = await fetchRooms();
        setTotalRooms(data);
      } catch (error) {
        console.log("방 로드 실패 :", error);
      }
    };

    loadRooms();
  }, []);


  // 간단한 인증
  const handleLogin = () => {
    if (password === '1234') {
      setIsAuthenticated(true);
    } else {
      alert('비밀번호가 틀립니다');
    }
  };

  // 강제 반납
  const handleForceReturn = (seatId: number) => {
    if (window.confirm(`좌석 ${seatId}번을 강제 반납하시겠습니까?`)) {
      forceReturnSeat(seatId, password);
    }
  };

  // 긴급 공지
  const handleSendAnnouncement = () => {

    console.log('🔔 관리자: 공지 전송 시도');
    if (!announcementText.trim()) {
      alert('공지 내용을 입력하세요');
      return;
    }

    if (window.confirm('긴급 공지를 전송하시겠습니까?')) {
      sendAnnouncement(announcementText, password);
      setAnnouncementText('');
      alert('공지가 전송되었습니다');
    }
  };

  // 로그인하지 않은 경우
  if (!isAuthenticated) {
    return (
      <div className="admin-login">
        <h2>관리자 로그인</h2>
        <input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        />
        <button onClick={handleLogin}>로그인</button>
      </div>
    );
  }


  return (
    <div className="admin-page">
      <h1>🔧 관리자 페이지</h1>

      <div className="connection-status">
        WebSocket: {connected ? '✅ 연결됨' : '❌ 연결 안 됨'}
      </div>

      {/* 긴급 공지 섹션 */}
      <div className="announcement-section">
        <h2>📢 긴급 공지</h2>
        <textarea
          placeholder="모든 사용자에게 보낼 공지를 입력하세요"
          value={announcementText}
          onChange={(e) => setAnnouncementText(e.target.value)}
          rows={4}
        />
        <button
          className="send-announcement-btn"
          onClick={handleSendAnnouncement}
        >
          공지 전송
        </button>
      </div>

      {/* 좌석 관리 섹션 */}
      <div className="seat-management-section">
        <h2>💺 좌석 관리</h2>
        {/* <div className="seat-list">
          {seats.map((seat) => (
            <div key={seat.seatId} className={`seat-item ${seat.status}`}>
              <div className="seat-info">
                <span className="seat-number">좌석 {seat.seatId}번</span>
                <span className={`seat-status ${seat.status}`}>
                  {seat.status === 'AVAILABLE' ? '사용 가능' : '사용 중'}
                </span>
              </div>
              <button
                className="force-return-btn"
                onClick={() => handleForceReturn(seat.seatId)}
                disabled={seat.status === 'AVAILABLE'}
              >
                강제 반납
              </button>
            </div>
          ))}
        </div> */}
        {/* {!selectedRoomId && (
          <> */}
        <div>
          <button onClick={() => setSelectedCategory("자료관")}>
            자료관
          </button>

          {selectedCategory === "자료관" && (
            filteredRooms.length > 0 ? (
              <ul>
                {filteredRooms.map((room) => (
                  <li key={room.id}>
                    <div onClick={() => handleClickRoom(room.id, room.name)}>
                      {room.name}
                    </div>
                    <div>
                      {room.availableSeats}/{room.totalSeats}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>자료관에 방이 없습니다.</p>
            )
          )}
        </div>

        <div>
          <button onClick={() => setSelectedCategory("학습관")}>
            학습관
          </button>

          {selectedCategory === "학습관" && (
            filteredRooms.length > 0 ? (
              <ul>
                {filteredRooms.map((room) => (
                  <li key={room.id}>
                    <div onClick={() => handleClickRoom(room.id, room.name)}>
                      {room.name}
                    </div>
                    <div>
                      {room.availableSeats}/{room.totalSeats}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>학습관에 방이 없습니다.</p>
            )
          )}
        </div>
        {/* </>
        )} */}
        {selectedRoomId && (
          <div className="selected-room-seats">
            <h3>
              {rooms.find(r => r.id === selectedRoomId)?.name} - 사용중인 좌석
            </h3>
            <div className="seat-list">
              {seats.length > 0 ? (
                seats.map((seat) => (
                  <div key={seat.seatId} className="seat-item">
                    <div className="seat-info">
                      <span className="seat-number">좌석 {seat.number}번</span>
                      <span className="seat-status">사용 중</span>
                    </div>
                    <button
                      className="force-return-btn"
                      onClick={() => handleForceReturn(seat.seatId)}
                    >
                      강제 반납
                    </button>
                  </div>
                ))
              ) : (
                <p>현재 사용중인 좌석이 없습니다.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default AdminPage;