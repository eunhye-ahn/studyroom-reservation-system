import { AdminNotificationHistory } from "../api/notification";

interface ForceReturnHistoryModalProps {
    notifications: AdminNotificationHistory[];
    onConfirm: () => void;                      //확인여부
}

const ForceReturnHistoryModal = ({ notifications, onConfirm }: ForceReturnHistoryModalProps) => {
    if (notifications.length === 0) return null;

    return (
        <div
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
                zIndex: 10000  // 다른 모달보다 위에
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '12px',
                    minWidth: '400px',
                    maxWidth: '500px',
                    maxHeight: '80vh',
                    overflow: 'auto'
                }}
            >
                <h2 style={{
                    color: '#dc2626',
                    marginBottom: '20px',
                    fontSize: '20px',
                    fontWeight: 'bold'
                }}>
                    ⚠️ 좌석 강제 반납 알림
                </h2>

                <div style={{ marginBottom: '20px' }}>
                    {notifications.map((notification, index) => (
                        <div
                            key={notification.id}
                            style={{
                                backgroundColor: '#fef2f2',
                                border: '1px solid #fecaca',
                                borderRadius: '8px',
                                padding: '15px',
                                marginBottom: index < notifications.length - 1 ? '10px' : '0'
                            }}
                        >
                            <p style={{
                                fontSize: '14px',
                                fontWeight: '500',
                                marginBottom: '8px',
                                color: '#1f2937'
                            }}>
                                {notification.message}
                            </p>
                            <p style={{
                                fontSize: '12px',
                                color: '#6b7280'
                            }}>
                                {new Date(notification.createdAt).toLocaleString('ko-KR', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    ))}
                </div>

                <button
                    onClick={onConfirm}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#2563eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#3b82f6'}
                >
                    확인
                </button>
            </div>
        </div>
    );
};

export default ForceReturnHistoryModal;