// import useNotification from "../store/useNotificationStore";
// import { useEffect, useRef } from "react";
// import { AdminNotification } from "../services/WebSocketService";
// import webSocketService from "../services/WebSocketService";


// const useReturnNotification = () =>{
// const { showNotification} = useNotification();
//   const isSubscribe = useRef(false);
//   const {seatId} = useSeatStore();

//     useEffect(()=>{
//     if (seatId === null) {
//       console.log('⚠️ [Seat] seatId 없음, 구독 생략');
//       return;
//     }

//     console.log('🔔 useNotification 훅 실행, seatId:', seatId);
//         //좌석 알림 구독(조건부)
//     let unsubscribeSeat: (()=> void) | undefined;
    
//     if(seatId !== null){
//         unsubscribeSeat = webSocketService.subscribeToSeatNotification(
//         seatId,
//             (notification:AdminNotification)=>{
//               console.log("강제퇴실 알림 수신 :", notification);
//               showNotification(notification);
//             }
//           );
//         }
    
    
//         //클린업 : 컴포넌트가 언마운트될때, seatId가 null이 될때 - 메모리 누수 방지?, 불필요한 웹소켓 구독 정리
//         return ()=> {
//           console.log('알림 구독 해제');
//           isSubscribe.current = false;
//           unsubscribeAnnouncement();
//         };
//       }
//       ,[]);
//     };
