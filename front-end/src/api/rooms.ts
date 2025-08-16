import axiosInstance from "./axiosInstance";

export interface RoomInfo {
  id: number;
  categoryType: 'general_pc' | 'group_study' | 'personal_carrel';
  subcategory: 'PERSON_1' | 'PERSON_2' | 'PERSON_4' | 'PERSON_6' | 'PERSON_12';
  floor: number;
  name: string;
  reservationType: 'SEAT_RESERVATION' | 'ROOM_RESERVATION';
  totalSeats: number;
  availableSeats: number;
}


export async function fetchRooms(): Promise<RoomInfo[]> {
  const response = await axiosInstance.get<RoomInfo[]>("/rooms");
  return response.data;
}