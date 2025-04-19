import { motion } from "framer-motion";
import {useContext} from "react";
import {MapContext} from "../mapContext.jsx";

const RideSelection = ({ ubergo, ambulance, xlvan , selectedRide,setSelectedRide,rideBook}) => {
    const {distance}=useContext(MapContext)

    function findPrice(){
        console.log(distance)
        return distance*20;
    }
    console.log("selectedride",selectedRide)

    return (
        <motion.div
            className="w-full bg-gray-100 rounded-lg absolute z-20 drop-shadow-2xl"
            animate={{ height: "650px" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
        >
            <div className="flex flex-col items-center gap-4 pt-5">
                <div className="h-[5px] w-[20%] rounded-3xl bg-gray-300 hover:bg-gray-400"></div>
                <h1 className="text-center text-3xl font-bold">Plan Your Trip</h1>
                <div className="w-full border-gray-300 border-t-4"></div>
                <div className="flex flex-col gap-4 p-3">
                    {[
                        { img: ubergo, name: "Uber Go", price: `₹${findPrice()}` },
                        { img: ambulance, name: "Ambulance", price: `₹${findPrice()+100}` },
                        { img: xlvan, name: "XL Car", price: `₹${findPrice()+200}` }
                    ].map((ride, index) => (
                        <div onClick={()=>{setSelectedRide(ride.name)}} key={index} className="flex rounded-md p-3 gap-4 justify-evenly w-full cursor-pointer" style={{ border: selectedRide === ride.name ? "4px solid black" : "none"}}>
                            <div className="w-1/3">
                                <img className="w-full" src={ride.img} alt={ride.name} />
                            </div>
                            <div className="w-1/3 flex flex-col gap-2 justify-center items-start ">
                                <p className="text-3xl font-bold">{ride.name}</p>
                                <p className="text-xl">6 min away</p>
                            </div>
                            <div className="w-1/3 flex justify-center">
                                <p className="text-3xl pt-3">{ride.price}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="w-full flex justify-center">
                    <button onClick={rideBook} className="w-[90%] p-5 cursor-pointer rounded-md bg-black text-white text-2xl">
                        Choose Ride
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default RideSelection;
