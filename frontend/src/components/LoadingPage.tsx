import React from 'react';

const LoadingPage = () => {
    return (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="relative bg-[#1a3a5e]/95 p-12 rounded-xl shadow-2xl backdrop-blur-sm">
                <div className="relative w-[160px] h-[160px] flex items-center justify-center">
                    {/* Rotating ring */}
                    <div className="absolute w-full h-full rounded-full border-8 border-transparent border-t-[#bde3ff] animate-[spin_2s_linear_infinite]" />
                    
                    {/* Center content */}
                    <div className="flex flex-col items-center">
                        <div className="text-[#bde3ff] font-['Cinzel'] text-lg tracking-wider">
                            LOADING
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoadingPage; 