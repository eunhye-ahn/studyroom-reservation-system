import { Client, IMessage,StompSubscription  } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export enum MessageType {
  STATUS_CHANGE = 'STATUS_CHANGE',  // ← 값 할당 필요!
  HEARTBEAT = 'HEARTBEAT',
  INITIAL_LOAD = 'INITIAL_LOAD'
}

export enum SeatStatus{
  AVAILABLE= 'AVAILABLE', 
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  OUT_OF_SERVICE = 'OUT_OF_SERVICE'
}

export interface SeatStatusMessage{
    seatId : number,
    number : number,
    status : SeatStatus,
    userId : number | null,
    timestamp : string,
    type : MessageType;
}

export interface AdminNotification{
  type: 'ANNOUNCEMENT' | 'FORCE_RETURNED';
  message: string;
  seatId: number | null;
}

export interface AdminControlRequest{
  action : 'FORCE_RETURN' | 'ANNOUNCEMENT',
  seatId? : number;
  message? : string; //메시지도 널이여도되나? ?의 의미 null과 다른점
  adminPassword:string;
}

type MessageCallback = (message:SeatStatusMessage) => void;

class WebSocketService {
    private client: Client | null = null;
    private messageCallbacks: Set<MessageCallback> = new Set();
    private currentRoomId: number | null = null;
    private announcementCallbacks: Set<(notification: AdminNotification) => void> = new Set();
    private forceReturnCallbacks: Set<(notification: AdminNotification) => void> = new Set();
    private isActivated: boolean = false;
private currentRoomSubscription: StompSubscription | null = null;

    //웹소켓 클라이언트 초기화
    constructor(){
        this.client = new Client({
        webSocketFactory:()=>new SockJS(
           import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8080/ws' 
        ),

        //디버그 메시지 출력
        debug : (str)=>{
            console.log(str);
        },

      reconnectDelay: 0,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      });

    //이벤트 핸들러 바인딩
      this.client.onConnect = this.onConnect.bind(this);
      this.client.onStompError = this.onStompError.bind(this); //이게머임


    }

    //연결시작
    public connect(userId: number | null, roomId:number | null): void {
    // if (!this.client || userId === null || roomId === null) return;

    //     this.currentRoomId = roomId;
    //     this.client.activate();
    //     localStorage.setItem('seat_userId', userId.toString());
    //     localStorage.setItem('seat_roomId', roomId.toString()); //이거두개는 스토리지에 왜 저장함

    console.log('[ws] 커넥트 호출');
    console.log('[ws] userId:',userId, 'roomId:',roomId);

    if(!this.client) {
      console.error('[ws] 클라이언트 없음');
      return;
    }

    if(this.isActivated){
      console.log('[ws] 이미 연결됨');

      if(roomId !== null && roomId !== this.currentRoomId){
        console.log('[ws] 룸아이디 변경');
        this.joinRoom(roomId);
      }
      return;
    }
    this.currentRoomId = roomId;
    console.log('[ws] acitvate 호출');
    this.client.activate();
    this.isActivated = true;
    }

    private onConnect(): void {
    console.log('Connected to WebSocket');

            //긴급 공지 구독
      this.client?.subscribe('/topic/announcements',(message:IMessage)=>{
        try{
        const notification: AdminNotification = JSON.parse(message.body);
        console.log('긴급공지수신:',notification);

        //등록된 모든 콜백 실행
        this.announcementCallbacks.forEach(callback=>callback(notification));
        }catch(e){
          console.error('Error parsing message', e);
        }
      });
      console.log('Subscribed complete');


    if(this.currentRoomId !== null){
      const subscriptionPath = `/topic/rooms/${this.currentRoomId}/seats`;
      //좌석 상태 구독
      this.subscribeToRoom(this.currentRoomId);

    }
    console.log('ws구독완료');
  }



    //연결 종료
    public disconnect(): void {
    // 연결되어 있을 때만 해제
    if (this.client && this.client.connected) {
      this.client.deactivate();
    }

    if (this.currentRoomSubscription) {
        this.currentRoomSubscription.unsubscribe();
        this.currentRoomSubscription = null;
        console.log('🪑 [WS] 방 구독 해제됨');
      }

    this.currentRoomId = null; //초기화
    this.isActivated = false;
  }

  // 메시지 수신 콜백 등록
  public subscribeToMessages(callback: MessageCallback): () => void {
    this.messageCallbacks.add(callback);

    // 구독 해제 함수 반환
    return () => {
      this.messageCallbacks.delete(callback);
    };
  }

  // 좌석 상태 업데이트 메시지 전송
  public updateSeatStatus(message: SeatStatusMessage): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    this.client.publish({
      destination: '/app/seat.updateStatus',
      body: JSON.stringify(message),
    });
  }

  // 좌석 사용 시작
  public startUsingSeat(seatId: number, seatNumber: number, userId: number): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    const message: SeatStatusMessage = {
      seatId,
      number: seatNumber,
      status: SeatStatus.OCCUPIED,
      userId,
      timestamp: new Date().toISOString(),
      type: MessageType.STATUS_CHANGE,
    };

    this.client.publish({
      destination: '/app/seat.updateStatus',
      body: JSON.stringify(message),
    });
  }

  // 좌석 반납
  public releaseSeat(seatId: number, seatNumber: number): void {
    if (!this.client || !this.client.connected) {
      console.error('WebSocket is not connected');
      return;
    }

    const message: SeatStatusMessage = {
      seatId,
      number: seatNumber,
      status: SeatStatus.AVAILABLE,
      userId: null,
      timestamp: new Date().toISOString(),
      type: MessageType.STATUS_CHANGE,
    };

    this.client.publish({
      destination: '/app/seat.updateStatus',
      body: JSON.stringify(message),
    });
  }

  // 하트비트 전송
  public sendHeartbeat(seatId: number, seatNumber: number, userId: number): void {
    if (!this.client || !this.client.connected) {
      return;
    }

    const message: SeatStatusMessage = {
      seatId,
      number: seatNumber,
      status: SeatStatus.OCCUPIED,
      userId,
      timestamp: new Date().toISOString(),
      type: MessageType.HEARTBEAT,
    };

    this.client.publish({
      destination: '/app/seat.updateStatus',
      body: JSON.stringify(message),
    });
  }

  //강제 반납 알림 메서드
  public subscribeToSeatNotification(seatId:number, callback:(notification: AdminNotification)=>void) {
    if(!this.client ||!this.client.connected){
      console.warn('Websocket is not connected');
      return () => {};
    }

    const subscription = this.client.subscribe(
      `/topic/seat/${seatId}`,
      (message:any)=>{
        const notification: AdminNotification = JSON.parse(message.body);
        console.log("강제반납알림수신:",notification);
        callback(notification);
      }
    );

    return ()=> {
      subscription.unsubscribe();
    }
  }

  public subscribeToAnnouncement(callback:(notification:AdminNotification)=>void){
    this.announcementCallbacks.add(callback);

    return()=>{
      this.announcementCallbacks.delete(callback);
    }
  }

  //관리자 제어 메시지 전송
  public sendAdminControl(request:AdminControlRequest){
    if(!this.client || !this.client.connected){
      console.error('Websocket is not connected');
      return;
    }
    console.log('관리자 제어 전송:',request);
    this.client.publish({
      destination: '/app/admin/control',
      body: JSON.stringify(request),
    });
  }

  private onStompError(frame: any): void {
    console.error('STOMP error', frame);
  }

  // 연결 상태 확인
  public isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  //방입장
  public joinRoom(roomId:number):void{
    console.log('방입장:',roomId);

    if(!this.client || !this.client.connected){
      console.error('ws연결안됨');
      return;
    }

    if (roomId === this.currentRoomId){
      return;
    }

    if (this.currentRoomSubscription) {
      console.log('🔄 [WS] 이전 방 구독 해제:', this.currentRoomId);
      this.currentRoomSubscription.unsubscribe();
      this.currentRoomSubscription = null;
  }

  this.currentRoomId = roomId;
    this.subscribeToRoom(roomId);
}

  public subscribeToRoom(roomId:number) : void{
    console.log('방구독',roomId);
    const subscriptionPath = `/topic/rooms/${roomId}/seats`;

          this.client?.subscribe(subscriptionPath, (message: IMessage) => {
        try {
          const seatMessage: SeatStatusMessage = JSON.parse(message.body);
          //상태메시지를 받으면 콜백 실행
          this.messageCallbacks.forEach(callback => callback(seatMessage));
        } catch (e) {
          console.error('Error parsing message', e);
        }
      });
  }
}

// 싱글톤 인스턴스 생성
export const webSocketService = new WebSocketService();
export default webSocketService;

