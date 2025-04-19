import {useEffect,useState} from "react";
import {socket} from "../components/socketConnect";
import {useAuth} from "../contextProvider/authProvider";
import { MapContext } from "../mapContext";
import { useContext } from "react";

export default function DriverHome(){
    const {username}=useAuth();
    const [activeRides,setActiveRides]=useState([]);
    const {selectedVehicle,setSelectedVehicle}=useContext(MapContext);

    socket.on('newride',(data)=>{
        console.log("new ride",data);
        setActiveRides([...activeRides,data]);
    })

    socket.on('ridecancelled',(data)=>{
        console.log("ride cancelled",data);
        setActiveRides(activeRides.filter(ride=>ride.username!==data.username));
    })

    useEffect(()=>{
        console.log("vehicle",selectedVehicle);
        if (username && selectedVehicle) {
            console.log("driver name",username);
            socket.emit('getconnected',{username,role:"driver",vehicle:selectedVehicle});
        }
    },[username,selectedVehicle])



    function acceptRide(index){
        socket.emit('acceptride',{username:activeRides[index].username,driver:username});
    }


    return(
        <div className="flex flex-col gap-4 overflow-y-auto h-screen p-5">
            <div>
                <button className="bg-black text-2xl rounded-lg text-white px-9 py-2">Logout</button>
            </div>
            {activeRides && activeRides.map((ride,index)=>(
                <div className="flex flex-col items-center rounded-md gap-5 shadow-lg shadow-gray-400 p-5 bg-white"> 
                <div className="text-3xl font-bold">{ride.username} requests for ride</div>
                <div className="flex justify-evenly items-center gap-14 text-2xl">
                    <div>{ride.source}</div>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="size-20">
                    <path d="M438.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-160-160c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L338.8 224 32 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l306.7 
                    0L233.4 393.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l160-160z"/></svg>
                    <div>{ride.destination}</div>
                </div>
                <div className="flex justify-evenly items-center gap-10 text-2xl">
                    <button onClick={()=>(acceptRide(index))} className="cursor-pointer bg-black rounded-lg text-white px-9 py-2">Accept</button>
                    <button className="bg-black cursor-pointer rounded-lg text-white px-9 py-2">Decline</button>
                </div>
            </div>
            ))}
        </div>
    )
}