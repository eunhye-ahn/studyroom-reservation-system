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

export type RoomId =
    number
    // | "media_lounge"
    // | "situation_room"
    // | "smart_group"
    // | "book_square"
    // | "maru_1"
    // | "r201"
    // | "r202"
    // | "reading_room"
    // | "carrel"
    // | "maru_2"
    // | "beom_mugo"
    // | "sunrise_maru_1"
    // | "sunrise_maru_2"
    // | "group_study"
    // | "support_team"
    // | "hanjeok"
    // | "director_office"
    ;

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
    seatId : number;
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

