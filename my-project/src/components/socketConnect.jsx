import { useEffect } from 'react';
import {io} from 'socket.io-client';

export const socket=io('http://localhost:3000',{withCredentials:true,autoConnect:false});

export default function SocketConnect({children}){
    useEffect(()=>{
        socket.connect();
        return ()=>{
            console.log("Disconnecting");
            socket.disconnect();
        };
    },[])

    return children;
}