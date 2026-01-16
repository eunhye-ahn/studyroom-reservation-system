import axiosInstance from "./axiosInstance"

export interface AdminNotificationHistory {
    id: number;
    type: 'FORCE_RETURNED' | 'ANNOUNCEMENT';
    message: string;
    seatId: number;
    userId: number;
    isRead: boolean;
    createdAt: string;
}

//안읽은 알림 가져오기
export async function getUnreadNotifications(userId: number): Promise<AdminNotificationHistory[]> {
    const res = await axiosInstance.get('/api/notifications/unread', {
        params: { userId }
    });
    return res.data;
}

//읽음 처리
export async function markNotificationAsRead(notificationId: number): Promise<void> {
    await axiosInstance.post(`/api/notifications/${notificationId}/read`);
}
