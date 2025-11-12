// import { useEffect, useState } from "react";
// import { Client } from "@stomp/stompjs";
// import SockJS from "sockjs-client";
// import { SocketClient } from "../websocket/SocketClient";

// interface SeatStatusDto {
//   seatId: number;
//   available: boolean;
//   userId: number;
//   timestamp: string;
// }


// function useSeatSocket() {

//   const [seats, setSeats] = useState<SeatStatusDto[]>([]);
//   let socketClient: SocketClient;

//   useEffect(() => {
//     const client = new Client({
//       webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
//       debug: (s) => console.log(s),
//     });

//     client.onConnect = () => {
//       client.subscribe(`/topic/rooms/${roomId}`, (message) => {
//         onUpdate(JSON.parse(message.body));
//       });
//     };

//     // 비동기 작업은 내부에서 처리 (effect 자체는 async 아님)
//     client.activate();

//     // ✅ cleanup은 동기 함수여야 함 (Promise 반환 금지)
//     return () => {
//       // Promise를 반환하지 않도록 그냥 호출만
//       void client.deactivate();        // or client.deactivate().catch(() => {});
//     };
//   }, [roomId, onUpdate]);
// }

// export default useSeatSocket;