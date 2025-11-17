
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