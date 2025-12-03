import axiosInstance from "./axiosInstance";

// type CategoryType = {
//   name: "DATA_CENTER" | "STUDY_CENTER";
//   displayName: string;
// };



// export interface RoomInfo {
//   id: number;
//   categoryType?: CategoryType;
//   floor: number;
//   name: string;
//   reservationType: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
//   totalSeats: number;
//   availableSeats: number;
// }


// export async function fetchRooms(): Promise<RoomInfo[]> {
//   const res = await axiosInstance.get("/rooms");
//   console.log("서버 응답 rooms:", res.data); // 👈 이거 찍어보기
//   return res.data;
// }

// api/rooms.ts
export type CategoryCode = 'DATA_CENTER' | 'STUDY_CENTER';

const LABEL_FROM_CODE: Record<CategoryCode, string> = {
  DATA_CENTER: '자료관',
  STUDY_CENTER: '학습관',
};

export const LABEL_TO_CODE: Record<string, CategoryCode | undefined> = {
  '자료관': 'DATA_CENTER',
  '학습관': 'STUDY_CENTER',
};



export interface RoomInfo {
  id: number;
  name: string;
  floor: number;
  reservationType?: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
  totalSeats: number;
  availableSeats: number;
  categoryType?: {
    displayName: string;
    // code?: CategoryCode; // 서버가 code도 보내준다면
  };
  categoryLabel?: string;
}



function normalizeRoom(raw: any): RoomInfo {
  let code: CategoryCode | undefined =
    typeof raw.categoryType === 'string'
      ? raw.categoryType
      : raw.categoryType?.name ??
      raw.category_type?.name ??
      (typeof raw.category_type === 'string' ? raw.category_type : undefined);

  const label: string | undefined =
    raw.categoryType?.displayName ??
    raw.category_type?.display_name ??
    (code ? LABEL_FROM_CODE[code] : undefined);

  if (!code && label) {
    const key = label.trim();
    code = LABEL_TO_CODE[key];
  }


  return {
    id: raw.id ?? raw.roomId ?? raw.room_id,
    name: raw.name ?? raw.roomName ?? raw.room_name ?? '',
    floor: raw.floor ?? raw.floorNo ?? raw.floor_no ?? 0,
    reservationType: raw.reservationType ?? raw.reservation_type,
    totalSeats:
      raw.totalSeats ?? raw.totalSeatCount ?? raw.total_seats ?? raw.total_seat_count ?? 0,
    availableSeats:
      raw.availableSeats ?? raw.availableSeatCount ?? raw.available_seats ?? raw.available_seat_count ?? 0,
    categoryType: code,
    categoryLabel: label,
  };
}

export async function fetchRooms(): Promise<RoomInfo[]> {
  const { data } = await axiosInstance.get('/rooms');
  return (Array.isArray(data) ? data : []).map(normalizeRoom);
}
