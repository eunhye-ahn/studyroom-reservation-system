import useNotification from "../store/useNotificationStore";
import { useEffect, useRef } from "react";
import { AdminNotification } from "../services/WebSocketService";
import webSocketService from "../services/WebSocketService";


const useGlobalNotification = () =>{
const { showNotification} = useNotification();

  useEffect(()=>{

    //websocket에서 메시지를 받으면
    //콜백함수 : 메시지를 받으면 실행되도록
    const unsubscribeAnnouncement = webSocketService.subscribeToAnnouncement(
      (notification:AdminNotification) => {
        console.log('긴급 공지 수신:', notification);
        showNotification(notification);
        console.log(" 긴급공지 수신 완료 !", notification)
      }
    );

    return () => {
      console.log('🔔 [Global] 긴급공지 구독 해제');
      unsubscribeAnnouncement?.();

    };
  }, []);
}

export default useGlobalNotification;