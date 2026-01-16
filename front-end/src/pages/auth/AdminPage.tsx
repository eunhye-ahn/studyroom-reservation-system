
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
import './AdminPage.css';

type TabType = 'dashboard' | 'seats' | 'announcement';


const AdminPage: React.FC = () => {
  //인증
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  //탭
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  //공지
  const [announcementText, setAnnouncementText] = useState('');

  //좌석/방
  const [totalRooms, setTotalRooms] = useState<RoomInfo[]>([]);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // 새로 추가
  const [selectedRoomForDetail, setSelectedRoomForDetail] = useState<number | null>(null); // 새로 추가

  const { forceReturnSeat, sendAnnouncement } = useAdminWebSocket();

  const { seats, connected } = useSeatWebSocket(0); // userId 0 (관리자)


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

  // 통계 계산
  const statistics = useMemo(() => {
    const total = totalRooms.reduce((sum, room) => sum + room.totalSeats, 0);
    const available = totalRooms.reduce((sum, room) => sum + room.availableSeats, 0);
    const occupied = total - available;
    const usageRate = total > 0 ? ((occupied / total) * 100).toFixed(1) : '0';

    return { total, available, occupied, usageRate };
  }, [totalRooms]);

  // 카테고리별 방 그룹화
  const roomsByCategory = useMemo(() => {
    const grouped: Record<string, RoomInfo[]> = {};
    totalRooms.forEach(room => {
      const category = room.categoryType?.displayName || '기타';
      if (!grouped[category]) grouped[category] = [];
      grouped[category].push(room);
    });
    return grouped;
  }, [totalRooms]);

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

  const handleViewRoomDetails = (roomId: number, roomName: string) => {

    setRoomName(roomName);
    setMode("room");
    openRoom(roomId);
    setSelectedRoomForDetail(roomId);
    setExpandedCategory(null);

  };

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category);
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
  const handleForceReturn = (seatId: number, seatNumber: number) => {
    if (window.confirm(`좌석 ${seatNumber}번을 강제 반납하시겠습니까?`)) {
      forceReturnSeat(seatId, password);
    }
  };

  // 긴급 공지
  const handleSendAnnouncement = () => {

    console.log('관리자: 공지 전송 시도');
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
      {/* 헤더 */}
      <div className="admin-header">
        <h1>관리자 대시보드</h1>
        <div className="connection-status">
          WebSocket: {connected ? '연결됨' : '연결 안 됨'}
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          대시보드
        </button>
        <button
          className={`tab-button ${activeTab === 'seats' ? 'active' : ''}`}
          onClick={() => setActiveTab('seats')}
        >
          좌석 관리
        </button>
        <button
          className={`tab-button ${activeTab === 'announcement' ? 'active' : ''}`}
          onClick={() => setActiveTab('announcement')}
        >
          긴급 공지
        </button>
      </div>

      {/* 탭 내용 */}
      <div className="tab-content">
        {activeTab === 'dashboard' && (

          <div className="dashboard-tab">
            {/* 통계 카드 */}
            <div className="statistics-grid">
              <div className="stat-card">
                <div className="stat-label">전체 좌석</div>
                <div className="stat-value">{statistics.total}</div>
              </div>
              <div className="stat-card occupied">
                <div className="stat-label">사용 중</div>
                <div className="stat-value">{statistics.occupied}</div>
              </div>
              <div className="stat-card available">
                <div className="stat-label">사용 가능</div>
                <div className="stat-value">{statistics.available}</div>
              </div>
              <div className="stat-card usage">
                <div className="stat-label">사용률</div>
                <div className="stat-value">{statistics.usageRate}%</div>
              </div>
            </div>

            {/* 전체 방 현황 */}
            <div className="rooms-overview">
              <h3>전체 열람실 현황</h3>
              {Object.entries(roomsByCategory).map(([category, rooms]) => (
                <div key={category} className="category-section">
                  <h4>{category}</h4>
                  <div className="rooms-grid">
                    {rooms.map(room => (
                      <div key={room.id} className="room-card-mini">
                        <div className="room-name">{room.name}</div>
                        <div className="room-status">
                          <span className="available">{room.availableSeats}</span>
                          <span className="divider">/</span>
                          <span className="total">{room.totalSeats}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'seats' && (
          <div className="seats-tab">
            <h3>좌석 관리</h3>

            {/* 카테고리별 접기/펼치기 */}
            {Object.entries(roomsByCategory).map(([category, rooms]) => (
              <div key={category} className="category-accordion">
                <div
                  className="category-header"
                  onClick={() => toggleCategory(category)}
                >
                  <h4>
                    {expandedCategory === category ? '▼' : '▶'} {category}
                  </h4>
                  <span className="category-summary">
                    {rooms.reduce((sum, r) => sum + r.totalSeats - r.availableSeats, 0)} /
                    {' '}{rooms.reduce((sum, r) => sum + r.totalSeats, 0)} 사용 중
                  </span>
                </div>

                {expandedCategory === category && (
                  <div className="rooms-list">
                    {rooms.map(room => (
                      <div key={room.id} className="room-item">
                        <div className="room-info">
                          <span className="room-name">{room.name}</span>
                          <span className="room-seats">
                            {room.availableSeats}/{room.totalSeats}
                          </span>
                        </div>
                        <button
                          className="view-details-btn"
                          onClick={() => handleViewRoomDetails(room.id, room.name)}
                        >
                          상세보기
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {selectedRoomId && (
              <div className="room-details">
                <div className="details-header">
                  <h4>
                    {rooms.find(r => r.id === selectedRoomId)?.name} - 사용 중인 좌석
                  </h4>
                  <button
                    className="close-btn"
                    onClick={() => openRoom(null)}
                  >
                    ✕
                  </button>
                </div>

                <div className="seat-list">
                  {seats.length > 0 ? (
                    seats.map((seat) => (
                      <div key={seat.seatId} className="seat-item">
                        <div className="seat-info">
                          <span className="seat-number">좌석 {seat.number}번</span>
                          <span className="seat-status occupied">사용 중</span>
                        </div>
                        <button
                          className="force-return-btn"
                          onClick={() => handleForceReturn(seat.seatId, seat.number)}
                        >
                          강제 반납
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="no-seats">현재 사용 중인 좌석이 없습니다.</div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'announcement' && (
          <div className="announcement-tab">
            <h3>긴급 공지 발송</h3>
            <div className="announcement-form">
              <textarea
                placeholder="모든 사용자에게 보낼 긴급 공지를 입력하세요"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                rows={6}
              />
              <button
                className="send-announcement-btn"
                onClick={handleSendAnnouncement}
              >
                전체 사용자에게 발송
              </button>
            </div>

            <div className="announcement-guide">
              <h4>사용 안내</h4>
              <ul>
                <li>긴급 공지는 현재 접속 중인 모든 사용자에게 즉시 전송됩니다</li>
                <li>중요한 내용만 간결하게 작성해주세요</li>
                <li>예시: "시스템 점검으로 15:00~16:00 서비스가 일시 중단됩니다"</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;