
import axiosInstance from "./axiosInstance";

export interface WaitingQueue {
    id: number;
    roomId: number;
    roomName: string;
    userId: number;
    userName: string;
    status: 'WAITING' | 'ASSIGNED' | 'CONFIRMED' | 'EXPIRED' | 'CANCELLED';
    queuePosition: number;
    assignedAt?: string;
    expiredAt?: string;
    createdAt: string;
    seat?: {
        id: number;
        number: number;
    };
}

//대기등록
export async function addToWaitingQueue(
    userId: number,
    roomId: number
): Promise<WaitingQueue> {
    const res = await axiosInstance.post("/api/waiting/add", null, {
        params: { userId, roomId }
    });
    return res.data;
}

//배정확정
export async function confirmAssignment(
    waitingId: number,
    userId: number
): Promise<void> {
    await axiosInstance.post(`/api/waiting/${waitingId}/confirm`, null, {
        params: { userId }
    });
}

//대기취소
export async function cancelWaiting(
    waitingId: number,
    userId: number
): Promise<void> {
    await axiosInstance.delete(`api/waiting/${waitingId}`, {
        params: { userId }
    });

}


//내대기목록조회
export async function getMyWaitingList(userId: number): Promise<WaitingQueue[]> {
    const res = await axiosInstance.get('/api/waiting/my', {
        params: { userId }
    });
    return res.data;
}

//특정열람실대기목록조회
export async function getWaitingListByRoom(roomId: number): Promise<WaitingQueue[]> {
    const res = await axiosInstance.get(`/api/waiting/${roomId}`, {
        params: { roomId }
    });
    return res.data;
}

