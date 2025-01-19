import React, { useState } from "react";
import axios from "axios";

const BingSearchBar: React.FC<{ query: string }> = ({ query }) => {
    const [images, setImages] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    const fetchImages = async () => {
        try {
            const response = await axios.post("http://127.0.0.1:8000/search_images/", { user_query: query });
            setImages(response.data.image_urls); // Ensure the backend response uses "image_urls" as the key
            setError(null);
        } catch (error) {
            setError("Error fetching, please try again.");
        }
    };

    React.useEffect(() => {
        const handler = setTimeout(() => {
            fetchImages();
        }, 1000); // Debounce for 1 second

        return () => {
            clearTimeout(handler);
        };
    }, [query]); // Fetch images whenever the query changes

    return (
        <div className="absolute bottom-[15%] left-1/4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
            {error && <div className="text-center font-serif font-bold text-red-500">{error}</div>}
            {!error && images.length > 0 ? (
                <div>
                    <h1 className="text-xl text-center font-serif font-bold text-gray-900 mb-2">Results</h1>
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((url, index) => (
                            <img
                                key={index}
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-auto rounded-md"
                            />
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
