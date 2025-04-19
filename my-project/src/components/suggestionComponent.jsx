export default function SuggestionComponent(props){
    const sub_address=props.display_name.split(',',4)


    return(
        <div onClick={()=>{props.selectLocation(props)}} className="w-[90%] p-3 rounded-2xl flex items-center gap-4 bg-gray-200 cursor-pointer hover:bg-gray-300 active:bg-gray-400">
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>

            </div>
            <div>
                <p className="text-xl">{props.display_place}</p>
                <p className="text-lg opacity-70 overflow-x-hidden">{`${sub_address[1]},${sub_address[2]},${sub_address[3]}`}</p>
            </div>
        </div>
    )
}