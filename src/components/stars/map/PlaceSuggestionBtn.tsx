import UserPlaceSuggestion from "../../user/Sugestion/UserPlaceSuggestion";
import { useState, useRef, useEffect } from "react";

export default function PlaceSuggestionBtn({

}){
    const [isSuggestionOpen, setIsSuggestionOpen] = useState(false);

    const toggleSuggestion = () => {
        setIsSuggestionOpen((prev) => !prev);
    };

    // 닫기 핸들러 추가
    const handleClose = () => {
        console.log("닫기 함수 호출됨");
        setIsSuggestionOpen(false);
    };


   return(
        <div>
            <div
                className={`absolute bottom-6 left-[18%] transform -translate-x-1/2 z-20 max-w-md bg-white shadow-md flex items-center rounded-full transition-all duration-300 ${
                    isSuggestionOpen
                        ? "bg-opacity-90"
                        : "bg-opacity-60 hover:bg-opacity-90"
                } md:bottom-6 md:left-6 md:transform-none md:w-88`}
            >
                <button
                className="flex-shrink-0 bg-transparent text-gray-500 hover:text-gray-700 mr-3 focus:outline-none border-0"
                onClick={toggleSuggestion}>
                    장소 추천
                </button>
                <UserPlaceSuggestion isOpen={isSuggestionOpen}
                 onClose={handleClose} />         

            </div>
        </div>
   ) 
}