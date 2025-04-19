import { useEffect,useContext } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import L from "leaflet";
import "leaflet-routing-machine";
import {MapContext} from "../mapContext.jsx";

function Routing({ source, destination,setDistance }) {
    const map = useMap(); // Get the map instance


    useEffect(() => {
        if (!map) return;

        const sourceLatLng = L.latLng(source);
        const destinationLatLng = L.latLng(destination);

        const distance = sourceLatLng.distanceTo(destinationLatLng) / 1000; // Convert meters to km
        setDistance(distance.toFixed(2)); // Update state with distance

        const routingControl = L.Routing.control({
            waypoints: [sourceLatLng, destinationLatLng],
            routeWhileDragging: true,
            lineOptions: { styles: [{ color: "blue", weight: 6 }] }
        }).addTo(map);

        return () => map.removeControl(routingControl); // Cleanup on unmount
    }, [map, source, destination]); // Re-run when source/destination changes

    return null;
}

export default function RouteMap() {
    const {sourceLongitude,sourceLatitude,destinationLatitude,destinationLongitude,distance,setDistance}=useContext(MapContext);
    console.log("finalCoordinates",sourceLongitude,destinationLatitude)

    const source = [sourceLatitude,sourceLongitude]; // San Francisco
    const destination = [destinationLatitude, destinationLongitude]; // Nearby*/

    return (
        <MapContainer center={source} zoom={13} style={{width: "100%" }} className="h-full rounded-md absolute z-10">
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Routing source={source} destination={destination} setDistance={setDistance} />
        </MapContainer>
    );
}


//className="rounded-md absolute z-10"
/*<MapContainer center={center} zoom={13} className="rounded-md absolute z-10" style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={center}>
                <Popup>San Francisco</Popup>
            </Marker>
        </MapContainer>*/
