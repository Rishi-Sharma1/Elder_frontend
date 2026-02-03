import axios from "axios";
import { auth } from "../src/config/firebase";

const api = axios.create({
  baseURL: "https://elderbackend-production.up.railway.app/api"
});

api.interceptors.request.use(async (config)=>{
  const token = await auth.currentUser?.getIdToken();
  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
