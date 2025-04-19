import MyLocation from "./myLocation.jsx";
import SuggestionComponent from "./suggestionComponent.jsx";
const PlanTrip = ({ source, setSource, setSourceActive, destination, setDestination, sourceActive, myLocation, suggestAddress, selectLocation }) => {
    return (
        <div className="flex flex-col items-center gap-4 pt-5">
            <div className="h-[5px] w-[20%] rounded-3xl bg-gray-300 hover:bg-gray-400"></div>
            <h1 className="text-center text-3xl font-bold">Plan Your Trip</h1>
            <div className="w-full border-gray-300 border-t-4"></div>

            <div className="w-full flex flex-col justify-center gap-4 p-10 pt-3">
                <input
                    className="p-3 w-full bg-gray-300 text-lg rounded-lg"
                    type="text"
                    value={source}
                    onChange={ev => setSource(ev.target.value)}
                    onClick={() => setSourceActive(true)}
                    placeholder="From"
                />
                <div className="flex justify-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="size-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 7.5 7.5 3m0 0L12 7.5M7.5 3v13.5m13.5 0L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
                        />
                    </svg>
                </div>
                <input
                    className="p-3 bg-gray-300 text-lg rounded-lg"
                    type="text"
                    placeholder="To"
                    value={destination}
                    onClick={() => setSourceActive(false)}
                    onChange={ev => setDestination(ev.target.value)}
                />
            </div>
            <div className="w-full flex flex-col items-center gap-4">
                {sourceActive && <MyLocation myLocation={myLocation} />}

                <div className="w-full overflow-y-scroll h-[325px] flex flex-col items-center gap-3">
                    {suggestAddress.map((element, index) =>
                        index < 5 ? <SuggestionComponent key={index} selectLocation={selectLocation} {...element} /> : null
                    )}
                </div>
            </div>
        </div>
    );
};

export default PlanTrip;
