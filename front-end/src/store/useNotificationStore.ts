import {create} from 'zustand'
import { AdminNotification } from '../services/WebSocketService'

interface NotificationState {
  notification : AdminNotification | null;
  isOpen : boolean;

  showNotification: (notification : AdminNotification) => void;
  closeNotification: ()=>void;
}

const useNotification = create<NotificationState>((set)=>({
  notification : null,
  isOpen:false,

  showNotification:(notification)=>{
    set({
      notification : notification,
      isOpen:true
    });
  },

  closeNotification: ()=>{
    set({
      isOpen:false,
      notification:null
    });
  },

}));

export default useNotification;