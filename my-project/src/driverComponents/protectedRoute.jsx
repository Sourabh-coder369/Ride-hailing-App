import { useNavigate } from "react-router-dom";
import { useAuth } from "../contextProvider/authProvider";
import { useEffect } from "react";
import { MapContext } from "../mapContext";
import { useContext } from "react";

export function ProtectedRoute({children}){
    const {isLogged,setIsLogged,setUsername} = useAuth();
    const {setSelectedVehicle}=useContext(MapContext);
    const navigate=useNavigate()

    useEffect(()=>{
        fetch("http://localhost:3000/login/test",{
            method:"GET",
            credentials:'include',
        }).then(res=>res.json()).then(
            data=>{
                if(data.message==="Unauthorized"){
                    setIsLogged(false);
                    console.log("unauthorized")
                    navigate("/login");
                }
                else{
                    setIsLogged(true);
                    console.log("hello",data.username);
                    setUsername(data.username);
                    setSelectedVehicle(data.vehicleType);

                }
            }
        ).catch(err=>console.log(err))
    },[navigate])

    return children;
}