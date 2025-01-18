import React from "react"
import { useState } from "react"
import BingSearchBar from "./BingSearchBar"

const BingPopup: React.FC <{a: string}> = ({a}) => {
    const [isVisible, setIsVisible] = useState(true);
    const [showBingSearchBar, setShowBingSearchBar] = useState(false);

    const handleNo = () => {setIsVisible(false)}
    const handleYesShowBingSearch = () => {
        setIsVisible(false);
        setShowBingSearchBar(true);
    }

    return (
        <div>
            {isVisible && (<div className="absolute bottom-[15%] left-1/4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <div className="flex flex-col text-center mb-2">
                    <h1 className="text-xl font-serif font-bold text-gray-900 mb-2">
                        Use Bing to Assist in Image Search?
                    </h1>
                    <div className="flex flex-row justify-center gap-4 mt-2">
                        <button
                            className="text-lg font-serif bg-black text-white py-2 px-4 rounded hover:opacity-[50%] focus:outline-none"
                            name="bingpopupyes"
                            type="button"
                            value="Yes"
                            onClick={handleYesShowBingSearch}
                        >
                            Yes
                        </button>
                        <button
                            className="text-lg font-serif bg-black text-white py-2 px-4 rounded hover:opacity-[50%] focus:outline-none"
                            name="bingpopupno"
                            type="button"
                            value="No"
                            onClick={handleNo}
                        >
                            No
                        </button>
                    </div>
                </div>
            </div>
            )}
            {showBingSearchBar && <BingSearchBar a={a} />}
        </div>
    )
}

export default BingPopup;