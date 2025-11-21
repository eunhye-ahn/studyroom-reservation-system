import useNotification from "../store/useNotificationStore";

const NotificationModal = () => {
  //store에서 필요한 데이터와 함수들 꺼내오기
  const {notification, isOpen, closeNotification} = useNotification();

  if(!isOpen || !notification) return null;

   //메시지 타입 확인
  const isForceReturn = notification.type === 'FORCE_RETURNED';
  const isAnnouncement = notification.type === 'ANNOUNCEMENT';
console.log('🎨 NotificationModal 렌더링:', { isOpen, notification });
  return(
    <div onClick = {closeNotification} 
    style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}>
      <div onClick = {(e) => e.stopPropagation()}
                style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          minWidth: '300px'
        }}>
        <p>{notification.message}</p>
        <button onClick={closeNotification}>확인</button>
      </div>
    </div>
  );

};

export default NotificationModal;