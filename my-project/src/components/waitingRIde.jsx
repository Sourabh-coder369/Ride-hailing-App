import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from './socketConnect';

export default function WaitingRide({acceptRide,socketRideCancel}) {
    const [progress, setProgress] = useState(0);
    const [restartBar,setRestartBar]=useState(false);
    const navigate=useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev < 100) {
                    return prev + (100 / 10);
                } else {
                    clearInterval(interval);
                    return 100;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [restartBar]);

    function keepSearch() {
        setProgress(0);
        setRestartBar((prev)=>!prev);
    }

    return (
        <div className='p-10 flex flex-col justify-center gap-6'>
            <div style={{ 
                width: '90%', 
                height: '15px', 
                backgroundColor: '#e0e0df', 
                borderRadius: '10px', 
                overflow: 'hidden', 
                border: '1px solid black'
            }}>
                <div style={{ 
                    width: `${progress}%`, 
                    height: '100%', 
                    backgroundColor: 'black', 
                    borderRadius: '10px 0 0 10px', 
                    transition: 'width 1s linear' 
                }} />
            </div>
            <p className='text-4xl font-bold text-center'>Searching for the ride</p>
            {progress === 100 && (
                <div className='flex gap-10 justify-center'>
                    <button className="bg-black text-white p-4 text-xl cursor-pointer rounded-lg" onClick={keepSearch}>Keep Searching</button>
                    <button className="bg-black text-white p-4 text-xl cursor-pointer rounded-lg" onClick={socketRideCancel}>Go Back</button>
                </div>
            )}
        </div>
    );
}