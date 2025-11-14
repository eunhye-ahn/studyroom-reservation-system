import { useEffect, useState } from "react";
import webSocketService, {AdminControlRequest, AdminNotification } from "../services/WebSocketService";

export const useAdminWebSocket=()=>{
    const [announcement, setAnnouncement]= useState<AdminNotification | null>(null);

    console.log(webSocketService);

    useEffect(()=>{
        //긴급공지구독
        const unsubscribeAnnouncement = webSocketService.subscribeToAnnouncement((notification)=>{
            console.log('hook에서 공지수신:',notification);
            setAnnouncement(notification);
        });

        return()=>{
            unsubscribeAnnouncement();
        };
    },[]);

    //강제 반납 전송 함수
    const forceReturnSeat=(seatId: number, password:string)=>{
        const request : AdminControlRequest = {
            action:'FORCE_RETURN',
            seatId:seatId,
            adminPassword:password
        };
        webSocketService.sendAdminControl(request);
    };

    //긴급공지 전송함수
   const sendAnnouncement = (message: string, password: string) => {
    const request: AdminControlRequest = {
      action: 'ANNOUNCEMENT',
      message: message,
      adminPassword: password
    };
    webSocketService.sendAdminControl(request);
  };
  
  //공지초기화함수
  const clearAnnouncement = () => {
    setAnnouncement(null);
  };

  return{
    announcement,
    clearAnnouncement,
    forceReturnSeat,
    sendAnnouncement
  }
}