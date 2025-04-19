import{createContext,useState} from "react";

export const MapContext=createContext({})

export default function MapProvider({children}){
    const [sourceLongitude,setSourceLongitude]=useState(77.53475701110554)
    const [sourceLatitude,setSourceLatitude]=useState(12.932688303413201)
    const [destinationLongitude,setDestinationLongitude]=useState(77.52868808720038)
    const [destinationLatitude,setDestinationLatitude]=useState(12.94521686428834)
    const [distance,setDistance]=useState(0)
    const [selectedVehicle,setSelectedVehicle]=useState("")


    return(
        <MapContext.Provider value={{sourceLatitude,sourceLongitude,destinationLatitude,destinationLongitude,setSourceLatitude,setSourceLongitude,setDestinationLatitude,setDestinationLongitude,distance,setDistance,selectedVehicle,setSelectedVehicle}}>
            {children}
        </MapContext.Provider>
    )
}