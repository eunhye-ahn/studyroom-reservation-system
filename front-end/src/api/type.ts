export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface User {
  id: number;
  email: string;
  nickname: string;
}

export type FloorId = 1 | 2 | 3 | 4;

export type RoomId = number;

export type FloorButton = {
    id : string;
    x : number;
    y : number;
    w : number;
    h : number;
    label : string;
    roomId : RoomId;
    image : string;
}

export type SeatButton = {
    // seatId : number;
    x : number;
    y : number;
    w : number;
    h : number;
    label? : string;
    available? : boolean;
}   


export type MyReserve = {
  id: number;
  readingRoomName: string;
  seatNumber: number;
  date: string;
  startTime: string;
  endTime: string;
};
