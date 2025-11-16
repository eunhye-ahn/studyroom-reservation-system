import { useEffect } from "react";
import useNotificationStore from "../store/notificationStore";
import webSocketService, { AdminNotification } from "../services/WebSocketService";

export const useNotification = (seatId : number | null) => {
  const { showNotification} = useNotificationStore();
  useEffect(()=> {
    console.log('🔔 useNotification 훅 실행, seatId:', seatId);
    //websocket에서 메시지를 받으면
    const unsubscribeAnnouncement = webSocketService.subscribeToAnnouncement(
      (notification:AdminNotification) => {
        console.log('긴급 공지 수신:', notification);
        showNotification(notification);
        console.log(" 긴급공지 수신 완료 !", notification)
      }
    );

    //좌석 알림 구독(조건부)
    let unsubscribeSeat: (()=> void) | undefined;

    if(seatId !== null){
      unsubscribeSeat = webSocketService.subscribeToSeatNotification(
        seatId,
        (notification:AdminNotification)=>{
          console.log("강제퇴실 알림 수신 :", notification);
          showNotification(notification);
        }
      );
    }


    //클린업 : 컴포넌트가 언마운트될때, seatId가 null이 될때 - 메모리 누수 방지?, 불필요한 웹소켓 구독 정리
    return ()=> {
      console.log('알림 구독 해제');
      unsubscribeAnnouncement();
      if(unsubscribeSeat){
        unsubscribeSeat();
      }
    };
  }
  ,[seatId, showNotification]);
}