import React from "react";
import { useState } from "react";

const BingSearchBar: React.FC = () => {
    return (
        <div>
            <div className="absolute bottom-[15%] left-1/4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                    <h1 className="text-xl text-center font-serif font-bold text-gray-900 mb-2">
                        Searching...
                    </h1>
            </div>
        </div>
    )
}
export default BingSearchBar