import carLogo from '../assets/car_logo.jpg'
import {useAuth} from "../contextProvider/authProvider";
import {Link} from "react-router-dom";
export default function LandingPage() {
    const {isrider, setIsRider} = useAuth();
    return(
        <div className="p-4">
            <div className="w-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                     stroke="currentColor" className="size-10">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"/>
                </svg>
            </div>

            <div className="pt-12">
                <h1 className="font-bold text-7xl">Uber</h1>
            </div>

            <div className="pt-15 flex justify-evenly">
                <div className="w-[40%] bg-gray-100 p-5 rounded-md flex flex-col gap-6 drop-shadow-md ">
                    <div className="w-full">
                        <img className="w-[90%] opacity-70" src={carLogo}/>
                    </div>

                    <h1 className="font-bold text-3xl">Get a Ride</h1>
                    <div className="pl-4">
                        <button onClick={()=>(setIsRider(true))} className="bg-black rounded-full p-2 cursor-pointer">
                            <Link to="/login">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                     stroke="currentColor" className="size-7 text-white">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                                </svg>
                            </Link>
                        </button>
                    </div></div>

                    <div className="w-[40%] bg-gray-100 p-5 rounded-md flex flex-col gap-6 drop-shadow-md ">
                        <div className="w-full">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="size-30">
                                <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512l388.6 0c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304l-91.4 0z"/></svg>
                        </div>

                        <h1 className="font-bold text-3xl">Driver</h1>
                        <div className="pl-4">
                            <button onClick={()=>(setIsRider(false))}  className="bg-black rounded-full p-2 cursor-pointer">
                                <Link to="/login">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
                                         stroke="currentColor" className="size-7 text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round"
                                              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"/>
                                    </svg>
                                </Link>
                            </button>
                        </div>
                    </div>


            </div>
        </div>
    )
}