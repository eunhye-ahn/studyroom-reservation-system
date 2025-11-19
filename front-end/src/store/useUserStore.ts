import {create} from "zustand";
import { persist } from "zustand/middleware";

interface UserInfo {
    id:number,
    name: string;
    email: string;
    role: 'STUDENT' | 'GRADUATE' | 'LIBRAIAN' | 'PROFESSOR' | 'ADMIN';
  }

interface UserStore {
  user: UserInfo | null;
  setUser: (user: UserInfo) => void;
  clearUser: () => void;
}


const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "user-store", // localStorage key
    }
  )
);
export default useUserStore;