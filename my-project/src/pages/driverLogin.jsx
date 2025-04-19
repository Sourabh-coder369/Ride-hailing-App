import {useState,useEffect,useContext} from "react";
import {useNavigate} from "react-router-dom";
import { useAuth } from "../contextProvider/authProvider";
import SuggestionComponent from "../components/suggestionComponent";
import {MapContext} from "../mapContext";

export default function UserLogin() {
    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [authenticate,setAuthenticate]=useState("login");
    const {isLogged,setIsLogged,isRider,setUsername:setName,registerLock,setRegisterLock}=useAuth();
    const navigate=useNavigate();
    const [suggestAddress,setSuggestAddress]=useState([]);
    const [currentLocation,setCurrentLocation]=useState("")
    const [selectedSource,setSelectedSource]=useState(null)
    const { setSourceLatitude, setSourceLongitude,selectedVehicle,setSelectedVehicle } = useContext(MapContext);

    useEffect(()=>{
        if(currentLocation){
            const id=setTimeout(()=>{
                fetchLocation(currentLocation);  
        },2000)

        return ()=>{clearInterval(id)}
    }},[currentLocation])

    async function handleLogin(){
        const loginData={
            username:username,
            password:password
        }

        const response=await fetch("http://localhost:3000/driver/login",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify(loginData)
        })

        response.json().then(data=>{
            if(data.login){
                console.log(data);
                setName(data.username);
                setIsLogged(true)
                if(data.role=="rider")
                    navigate("/rider/home");
                else{
                    navigate("/driver/home");
                }
            }
            else{
                window.alert("Login Failed , please try again")
            }
        })

    }

    async function handleRegister(){
        const loginData={
            username:username,
            password:password,
            role:isRider?"rider":"driver",
            vehicleType: isRider ? null : selectedVehicle
        }

        const response=await fetch("http://localhost:3000/driver/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include",
            body:JSON.stringify(loginData)
        })

        response.json().then(data=>{
            if(data.register){
                setName(data.username);
                setIsLogged(true)
                console.log("Registered");
                if(data.role=="rider")
                    navigate("/rider/home");
                else{
                    navigate("/driver/home");
                }
            }
            else{
                window.alert("Register Failed , please try again")
            }
        })}

        function changeAuthenticate(){
            if(authenticate=="register"){
                setAuthenticate("login")
            }
            else{
                setRegisterLock(true);
                navigate("/chooserole")
                setAuthenticate("register")
        }

    }


    async function fetchLocation(searchAddress){
        const res=await fetch( `https://api.locationiq.com/v1/autocomplete?key=pk.abf50dd0cdfa0150a86849d06f465ba1&q=${searchAddress}`)
        const addressData=await res.json();
        console.log(addressData)
        if(!addressData.error){
        setSuggestAddress(addressData);}
    }

    function selectLocation(data){
        let splitData=data.display_name.split(',')
        setCurrentLocation(splitData[0]+splitData[1])
        setSelectedSource(data)
        setSourceLatitude(data.lat);
        setSourceLongitude(data.lon);
    }

    return (
        <div className="flex justify-center items-center h-full">
            <form className="w-[100%] p-10 pb-30 backdrop-blur-3xl flex flex-col gap-8" onSubmit={(ev)=>ev.preventDefault()}>
                <div className="text-center text-4xl font-bold">{isRider?"Rider Login":"Driver Login"}</div>
                <input className="text-2xl p-5 rounded-md bg-gray-200" type="text" placeholder="Username" value={username} required onChange={(ev)=>setUsername(ev.target.value)}/>
                <input className="text-2xl p-5 rounded-md bg-gray-200" type="password" placeholder="Password" value={password} required onChange={(ev)=>setPassword(ev.target.value)}/>
                {!registerLock && (
                    <div className="flex flex-col justify-center">
                        {authenticate==="register"?
                        <button className="width-[100%] cursor-pointer text-2xl p-5 rounded-md bg-blue-500 text-white" onClick={handleRegister}>Register</button>
                        :
                        <button className="width-[100%] cursor-pointer text-2xl p-5 rounded-md bg-blue-500 text-white" onClick={handleLogin}>Login</button>
                    }
                    <div className="underline text-center text-2xl cursor-pointer" onClick={changeAuthenticate}>{authenticate=="register"?"login":"register"}</div>
                    </div>
                )}
                {
                    registerLock && !isRider &&(
                        <div className="width-[100%] flex gap-4 flex-col justify-center">
                            <input type="text" className="text-2xl p-5 rounded-md bg-gray-200" placeholder="Enter Current location" required value={currentLocation} onChange={(ev)=>{setCurrentLocation(ev.target.value)}}/>
                            <div className="relative w-full">   
                            {
                                suggestAddress.length>0 && !selectedSource && (
                                    <div className="w-full bg-white absolute overflow-y-scroll h-[225px] flex flex-col items-center gap-3">
                                {suggestAddress.map((element, index) =>
                                    index < 5 ? <SuggestionComponent key={index} selectLocation={selectLocation} {...element} /> : null
                                )}
                            </div>
                                )
                            }
                            </div>
                            <select className="text-2xl p-5 rounded-md bg-gray-200" value={selectedVehicle} onChange={(ev) => setSelectedVehicle(ev.target.value)}>
                                <option value="Uber Go">Uber Go</option>
                                <option value="Ambulance">Ambulance</option>
                                <option value="XL Car">XL Car</option>
                            </select>
                        </div>
                        
                    )
                }
                {
                    registerLock && (
                        <button className=" cursor-pointer text-2xl p-5 rounded-md bg-blue-500 text-white" onClick={handleRegister}>Register</button>
                    )
                }

            </form>
            
        </div>
    )
}