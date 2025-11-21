import useNotification from "../store/useNotificationStore";
import { useEffect } from "react";
import { AdminNotification } from "../services/WebSocketService";
import webSocketService from "../services/WebSocketService";


const useReturnNotification = (seatId : number | null) => {
    const {showNotification} = useNotification();



    useEffect(()=>{
        let unsubscribeSeat: (()=> void) | undefined;
        
        if(seatId !== null && seatId !== undefined){
            unsubscribeSeat = webSocketService.subscribeToSeatNotification(
                seatId,
                (notification:AdminNotification)=>{
                    console.log("강제퇴실 알림 수신 : ",notification);
                    showNotification(notification);
                }
            );
        }

        return()=>{
            unsubscribeSeat?.();
        };
        
    },[seatId, showNotification]);
}


export default useReturnNotification;