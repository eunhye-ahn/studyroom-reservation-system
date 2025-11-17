
import React, { useState, useEffect } from 'react';
import { useAdminWebSocket } from '../../hooks/useAdminWebsocket';
import { useSeatWebSocket } from '../../hooks/useSeatWebSocket';
import useNotification from '../../store/useNotificationStore';

const AdminPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [announcementText, setAnnouncementText] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const { forceReturnSeat, sendAnnouncement } = useAdminWebSocket();
  const { seats, connected } = useSeatWebSocket(0); // userId 0 (관리자)

  useNotification();
  
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
        <div className="seat-list">
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
        </div>
      </div>
    </div>
  );
};

export default AdminPage;