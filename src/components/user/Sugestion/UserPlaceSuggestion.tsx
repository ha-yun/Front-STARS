interface SuggestionProps{
    isOpen: boolean
}


export default function UserPlaceSuggestion({
    isOpen,
}: SuggestionProps){
    return(
        <div id="place_suggestion_wrap"
            className={`absolute md:-top-[200px] -top-[200px] max-h-[80vh] md:w-96 w-11/12 bg-white shadow-lg rounded-2xl transition-transform duration-300 z-20 ${
                isOpen
                    ? "md:translate-x-0 translate-x-0 opacity-100 pointer-events-auto"
                    : "translate-x-[-110%] pointer-events-none"
            }`}
    >
        <div className="p-2 h-full flex flex-col overflow-y-auto min-h-[25vh] max-h-[70vh] text-black">
            
            {/* 여기에 꾸미기~~ */}
        </div>

    </div>       
    )
}