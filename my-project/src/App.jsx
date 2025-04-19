import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NavigatorUrl from "./routes";

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="bg-black h-screen flex justify-center items-center">
        <div className="h-[95%] w-[30%] rounded-md" style={{backgroundColor: "white"}}>
            <NavigatorUrl/>
        </div>
    </div>
  )
}

export default App
