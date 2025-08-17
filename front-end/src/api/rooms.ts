import axiosInstance from "./axiosInstance";

type CategoryType = {
  name: "DATA_CENTER" | "STUDY_CENTER";
  displayName: string;
};

export interface RoomInfo {
  id: number;
  categoryType: CategoryType;
  floor: number;
  name: string;
  reservationType: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
  totalSeats: number;
  availableSeats: number;
}


// export async function fetchRooms(): Promise<RoomInfo[]> {
//   const response = await axiosInstance.get<RoomInfo[]>("/rooms");
//   return response.data;
// }

export async function fetchRooms(): Promise<RoomInfo[]> {
  const res = await axiosInstance.get("/rooms");
  console.log("서버 응답 rooms:", res.data); // 👈 이거 찍어보기
  return res.data;
}
