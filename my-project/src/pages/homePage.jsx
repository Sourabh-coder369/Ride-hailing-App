import MyLeafletMap from "../components/mapView.jsx";
import SlidingBar from "../components/slidingBar.jsx";

export default function HomePage(){
    return(
        <div className="relative h-full flex flex-col justify-end">
            <MyLeafletMap/>
            <SlidingBar/>
        </div>
    )
}