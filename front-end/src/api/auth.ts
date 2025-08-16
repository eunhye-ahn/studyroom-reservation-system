import axiosInstance from "./axiosInstance";

export async function login(email:string, password:string){
    const res = await axiosInstance.post("/api/auth/login", {email, password});
    return res.data;
}

export async function fetchMe(){
    const res = await axiosInstance("/api/auth/me");
    return res.data;
}