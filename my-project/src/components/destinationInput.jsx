const DestinationInput = ({ destination, setHeight, confirmDestination }) => {
    return (
        <div className="flex flex-col items-center pt-5 gap-4">
            <div className="h-[5px] w-[20%] rounded-3xl bg-gray-300 hover:bg-gray-400"></div>
            <h1 className="font-bold text-3xl">Set your Destination</h1>
            <div className="w-full border-gray-300 border-t-4"></div>
            <input
                onClick={() => setHeight(750)}
                value={destination}
                className="w-[90%] bg-gray-300 rounded-md p-3 text-xl"
                type="text"
                placeholder="Search"
            />
            <div className="w-full flex justify-center">
                <button
                    onClick={confirmDestination}
                    className="w-[90%] p-5 cursor-pointer rounded-md bg-black text-white text-2xl"
                >
                    Confirm Destination
                </button>
            </div>
        </div>
    );
};

export default DestinationInput;
