import { useContext } from "react";
import { createContext ,useState} from "react";

const AuthContext = createContext();

export default function AuthProvider({ children }) {
    const [isLogged, setIsLogged] = useState(false);
    const [username,setUsername]=useState("");
    const [isRider, setIsRider] = useState(false);
    const [registerLock,setRegisterLock]=useState(false);

  return (<AuthContext.Provider value={{isLogged,setIsLogged,isRider,setIsRider,username,setUsername,registerLock,setRegisterLock}}>
    {children}
    </AuthContext.Provider>);
}

export function useAuth() {
    return useContext(AuthContext);
}