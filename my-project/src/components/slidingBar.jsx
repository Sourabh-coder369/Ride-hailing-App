import { motion } from "framer-motion";
import {useEffect, useState,useContext} from "react";
import MyLocation from "./myLocation.jsx";
import SuggestionComponent from "./suggestionComponent.jsx";
import {MapContext} from "../mapContext.jsx";
import DestinationInput from "./destinationInput.jsx";
import PlanTrip from "./planTrip.jsx";
import RideSelection from "./rideSelection.jsx";
import ubergo from "../assets/ubergo.png"
import xlvan from "../assets/xlvan.png"
import ambulance from "../assets/ambulance.png"
import { useAuth } from "../contextProvider/authProvider.jsx";
import {socket} from "./socketConnect.jsx";
import WaitingRide from "./waitingRIde.jsx";

let Height=300;

export default function SlidingBar() {
    const [isExpanded,setIsExpanded]=useState(false)
    const [destination,setDestination]=useState("");
    const [prevY,setPrevY]=useState(0)
    const [height,setHeight]=useState(300)
    const [startY,setStartY]=useState(null);
    const [sourceActive,setSourceActive]=useState(false);
    const [source,setSource]=useState("")
    const [suggestAddress,setSuggestAddress]=useState([]);
    const {setSourceLongitude,setSourceLatitude,setDestinationLatitude,setDestinationLongitude,set}=useContext(MapContext);
    const [pickedDestination,setPickedDestination]=useState(false)
    const [selectedSource,setSelectedSource]=useState({});
    const [selectedDestination,setSelectedDestination]=useState({});
    const [selectedRide,setSelectedRide]=useState("")
    const [bookedRide,setBookedRide]=useState(false)
    const {isRider,username}=useAuth();
    const [acceptedRide,setAcceptedRide]=useState(false)

    socket.on('rideaccepted',(data)=>{
        setAcceptedRide(true);
    })

    useEffect(() => {
        if(username){
            socket.emit('getconnected',{username,role:"rider"})
        }
    },[username])

    useEffect(() => {
        const id=setTimeout(()=>{
            if(source){
                fetchLocation(source);
            }
        },2000)

        return ()=>{clearInterval(id)}
    }, [source]);

    useEffect(() => {
        const id=setTimeout(()=>{
            if(destination){
                fetchLocation(destination);
            }
        },2000)

        return ()=>{clearInterval(id)}
    }, [destination]);

    function socketRideCancel(){
        socket.emit('cancelride',{username})
        setPickedDestination(false);
        setBookedRide(false);
    }

    function selectLocation(data){
        //console.log("selectLocation",sourceActive,data)
        if(sourceActive){
            console.log("sourceData",data);
            let splitData=data.display_name.split(',')
            setSource(splitData[0]+splitData[1])
            setSelectedSource(data)
        }
        else{
            let splitData=data.display_name.split(',')
            setDestination(splitData[0]+splitData[1]);
            setSelectedDestination(data);
        }
    }

    async function fetchLocation(searchAddress){
        const res=await fetch( `https://api.locationiq.com/v1/autocomplete?key=pk.abf50dd0cdfa0150a86849d06f465ba1&q=${searchAddress}`)

        const addressData=await res.json();
        console.log(addressData)
        if(!addressData.error){
        setSuggestAddress(addressData);}

    }

    async function confirmDestination(){
        if(!selectedSource?.lat || !selectedDestination?.lat){
            window.alert("Address Not valid");
        } else {
            setPickedDestination(true);
            setSourceLatitude(selectedSource.lat);
            setSourceLongitude(selectedSource.lon);
            setDestinationLatitude(selectedDestination.lat);
            setDestinationLongitude(selectedDestination.lon);
            console.log("coordinates", selectedSource, selectedDestination);
        }
    }

    function rideBook(){
        setBookedRide(true);
        console.log("vehicle", selectedRide);
        socket.emit('bookride', {username, source, destination, vehicle: selectedRide});
    }

    function myLocation(){
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log("Latitude:", position.coords.latitude);
                    console.log("Longitude:", position.coords.longitude);
                    fetch(`http://localhost:3000/mylocation?lat=${position.coords.latitude}&long=${position.coords.longitude}`,{
                        method:'get',
                        credentials:'include',
                    }).then(res=>(res.json())).then((data)=>{
                        console.log("data",data)
                        setSource(data.address.split(',')[0])
                        console.log(data.address)
                    })
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                }
            );
        } else {
            console.log("Geolocation is not supported by this browser.");
        }

    }

    return (
        <div className="relative w-full h-full flex flex-col justify-end">
            {!pickedDestination && (
                <motion.div
                    className={`w-full bg-gray-100 rounded-lg absolute z-20 drop-shadow-lg`}
                    animate={{height}}
                    drag="y"
                    dragConstraints={{ top: 0, bottom: 0 }}
                    onDragStart={(event, info) => setStartY(info.point.y)} // Store drag start position
                    onDrag={(event, info) => {
                        if (startY !== null && info.point.y - startY > 50) {
                            setHeight(300); // Collapse if dragged down at least 50px
                        }
                        else if(startY!==null && info.point.y - startY < -50){
                            setHeight(750); // Expand if dragged up at least 50px

                        }}}
                    transition={{
                        duration: 0.7, // Speed of animation
                        ease: "easeInOut", // Smooth motion
                    }}
                >
                    {height===300 && (
                        <DestinationInput
                            destination={destination}
                            setHeight={setHeight}
                            confirmDestination={confirmDestination}
                        />
                    )}

                    {
                        height===750 && (
                            <PlanTrip
                                source={source}
                                setSource={setSource}
                                setSourceActive={setSourceActive}
                                destination={destination}
                                setDestination={setDestination}
                                sourceActive={sourceActive}
                                myLocation={myLocation}
                                suggestAddress={suggestAddress}
                                selectLocation={selectLocation}
                            />

                        )
                    }
                </motion.div>
            )}
            {pickedDestination && !bookedRide && (
                    <RideSelection 
                        ubergo={ubergo} 
                        ambulance={ambulance} 
                        xlvan={xlvan} 
                        selectedRide={selectedRide} 
                        rideBook={rideBook} 
                        setSelectedRide={setSelectedRide}
                    />
                )
            }

            {
                pickedDestination && bookedRide && !acceptedRide && (
                    <motion.div
                        className="w-full bg-gray-100 rounded-lg absolute z-20 shadow-lg shadow-gray-400"
                        animate={{ height: "250px" }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                    >
                        <WaitingRide acceptedRide={acceptedRide} socketRideCancel={socketRideCancel}/>
                    </motion.div>
                )
            }

            {
                pickedDestination && bookedRide && acceptedRide && (
                    <motion.div
                        className="w-full bg-gray-100 rounded-lg absolute z-20 shadow-lg shadow-gray-400"
                        animate={{ height: "650px" }}
                        drag="y"
                        dragConstraints={{ top: 0, bottom: 0 }}
                    >
                        <div className="flex flex-col justify-center items-center gap-6 pt-24">
                            <svg xmlns="http://www.w3.org/2000/svg" width="74" height="74" viewBox="0 0 24 24" fill="none"
                                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                 className="lucide lucide-circle-check-big">
                                <path d="M21.801 10A10 10 0 1 1 17 3.335"/>
                                <path d="m9 11 3 3L22 4"/>
                            </svg>
                            <div className="text-3xl text-center font-medium">Your Ride {selectedRide} has been Booked</div>
                            <div className="text-4xl">Thanks for using Uber</div>
                        </div>
                    </motion.div>
                )
            }
        </div>
    );
}
