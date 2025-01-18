import React, { useState, useEffect } from "react";
import axios from "axios";

const BingSearchBar: React.FC<{ a: string }> = ({ a }) => {
    const [images, setImages] = useState<string[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async () => {
        try {
            console.log("Fetching images with query:", a);
            const response = await axios.post("http://localhost:8000/api/images", { user_query: a }, { headers: { "Content-Type": "application/json" } });
            console.log("Response from backend:", response.data);
            setImages(response.data.image_urls);
            setImageNames(response.data.image_names);
            setError(null);
        } catch (error) {
            console.error("Error fetching images:", error);
            setError("Error fetching, please try again");
        }
    };
    var firstSixImageNames = imageNames.slice(0, 6);
    var secondSixImageNames = imageNames.slice(6, 30);
    var firstSixImages = images.slice(0, 6);
    var secondSixImages = images.slice(6, 30);

    const preProcessImages = (imgArray: string[], imgNames: string[]) => {
        var x = 0;
        for (var i = 0; i < 6; i++){
            while (x < 30 && imgNames[i] != undefined && (imgNames[i].includes("query") || imgNames[i].includes("?") || imgNames[i].includes("uery"))){
                imgArray[i] = secondSixImages[x]
                imgNames[i] = secondSixImageNames[x]
                x++;
            }
        }
        return imgArray;
    }

    useEffect(() => {
        fetchImages();
    }, [a]); // Fetch images whenever the query changes

    return (
        <div className="absolute bottom-[15%] left-1/4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            {error && <div className="text-center font-serif font-bold text-red-500">{error}</div>}
            {!error && preProcessImages(firstSixImages, firstSixImageNames) != undefined && imageNames != undefined && images != undefined && images.length > 0 ? (
                <div>
                    <h1 className="text-xl text-center font-serif font-bold text-gray-900 mb-2">Results</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {preProcessImages(firstSixImages, firstSixImageNames).map((url, index) => (
                            <div>
                            <img
                                key={index}
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-auto rounded-md"
                            />
                            <h4 className="text-center font-serif font-bold text-gray-900 mb-2">{imageNames[index]}</h4> </div>
                        ))}
                    </div>
                </div>
            ) : (
                !error && (
                    <h1 className="text-xl text-center font-serif font-bold text-gray-900 mb-2">
                        Loading Images...
                    </h1>
                )
            )}
        </div>
    );
};

export default BingSearchBar;
