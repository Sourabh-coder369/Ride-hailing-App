import {Routes, Route, Navigate} from "react-router-dom";
import LandingPage from "./pages/landingPage";
import HomePage from "./pages/homePage.jsx";
import MapProvider from "./mapContext.jsx";
import DriverLogin from "./pages/driverLogin.jsx";
import DriverHome from "./driverComponents/driverHome.jsx";
import AuthProvider from "./contextProvider/authProvider.jsx";
import { ProtectedRoute } from "./driverComponents/protectedRoute.jsx";
import SocketConnect from "./components/socketConnect.jsx";


export default function NavigatorUrl() {
return(
    <AuthProvider>
        <MapProvider>
            <Routes>
                <Route path="/" element={<Navigate to="/login"/>}></Route>
                <Route path="/login" element={<DriverLogin/>}></Route>
                <Route path="/chooserole" element={<LandingPage/>}></Route>
                <Route path="/rider/home" element={
                    <ProtectedRoute>
                        <SocketConnect>
                            <HomePage/>
                        </SocketConnect>
                    </ProtectedRoute>}></Route>
                <Route path="/driver/home" element={
                    <ProtectedRoute>
                        <SocketConnect>
                            <DriverHome/>
                        </SocketConnect>
                    </ProtectedRoute>}>
                </Route>        
            </Routes>
    </MapProvider>
    </AuthProvider>
)
}