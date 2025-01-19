import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const BingSearchBar: React.FC<{ a: string }> = ({ a }) => {
    const [images, setImages] = useState<string[]>([]);
    const [imageNames, setImageNames] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Debounce utility
    function debounce<T extends (...args: any[]) => void>(func: T, timeout = 300): (...args: Parameters<T>) => void {
        let timer: ReturnType<typeof setTimeout>;
        return (...args: Parameters<T>) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func(...args);
            }, timeout);
        };
    }

    // Fetch images logic
    const fetchImages = async () => {
        try {
            console.log("Fetching images with query:", a);
            const response = await axios.post(
                "http://localhost:8000/api/images",
                { user_query: a },
                { headers: { "Content-Type": "application/json" } }
            );
            console.log("Response from backend:", response.data);
            const validImageUrls: string[] = [];
            await Promise.all(
                response.data.image_urls.map(async (url: string) => {
                    try {
                        const img = new Image();
                        img.src = url;
                        await new Promise((resolve, reject) => {
                            img.onload = resolve;
                            img.onerror = reject;
                        });
                        validImageUrls.push(url);
                    } catch {
                        // Ignore invalid images
                    }
                })
            );
            setImages(validImageUrls);
            setImageNames(response.data.image_names);
            setError(null);
        } catch (error) {
            console.error("Error fetching images:", error);
            setError("Error fetching, please try again");
        }
    };

    // Debounced fetchImages
    const debouncedFetchImages = useCallback(debounce(fetchImages, 300), [a]);

    useEffect(() => {
        debouncedFetchImages();
    }, [debouncedFetchImages]);

    return (
        <div className="absolute bottom-[15%] left-1/4 bg-white p-8 rounded-xl shadow-lg w-full max-w-md h-[300px] overflow-y-auto">
            {error && (
                <div className="text-center font-serif font-bold text-red-500">
                    {error}
                </div>
            )}
            {!error && images.length > 0 ? (
                <div>
                    <h1 className="text-xl text-center font-serif font-bold text-gray-900 mb-2">
                        Results
                    </h1>
                    <div className="grid grid-cols-3 gap-4">
                        {images.map((url, index) => (
                            <div
                                key={index}
                                className="w-full h-full overflow-hidden rounded-md"
                            >
                                <button type="button">
                                    <img
                                        src={url}
                                        alt={`Image ${index + 1}`}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            </div>
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
